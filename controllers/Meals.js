import Meal from "../models/Meals.js";
import Ingredient from "../models/Ingredient.js";
import { Op, Sequelize } from 'sequelize';
import MealIngredient from "../models/MealIngredients.js";
import db from "../config/Database.js";

async function translateText(text, targetLang, sourceLang = 'auto') {
    const response = await fetch("https://translate.silasbeckmann.de/translate", {
        method: "POST",
        body: JSON.stringify({
            q: text,
            source: sourceLang,
            target: targetLang,
            format: "text",
            api_key: process.env.TRANSLATE_API_KEY

        }),
        headers: { "Content-Type": "application/json" }
    });

    const data = await response.json();
    return data.translatedText;
}

export const getMeal = async (req, res) => {
    const { ingredient, lan, id } = req.query;
    try {
        if (id) {
            const result = await Meal.findByPk(id, {
                include: {
                    model: Ingredient,
                    through: {
                        model: MealIngredient
                    }
                }
            });
            res.json(result);
            return;
        }
  
        let foundItems;
  
        if (ingredient) {

            const ingredientsArray = ingredient.split(',').map(ing => ing.trim());

            // Translate each ingredient
            const translatedIngredients = await Promise.all(
                ingredientsArray.map(async ing => await translateText(ing, "en"))
            );


            foundItems = await Meal.findAll({
                where: {
                    id: {
                      [Op.in]: Sequelize.literal(`
                        (SELECT "mealId" FROM "MealIngredient" WHERE "ingredientId" IN 
                        (SELECT "id" FROM "ingredient" WHERE ${translatedIngredients.map(name => `"name" ILIKE '%${name}%'`).join(' OR ')})
                        GROUP BY "mealId"
                        HAVING COUNT(DISTINCT "ingredientId") = ${translatedIngredients.length})
                      `)
                    }
                  },
                include: [
                  {
                    model: Ingredient,
                    through: { attributes: [] }  // exclude MealIngredient attributes
                  }
                ]
              });
           
        } else {
            foundItems = await Meal.findAll({
                include: [
                    {
                        model: Ingredient,
                        required: true,
                    }
                ],
            });
        }
  
        res.json(foundItems);
    } catch (error) {
        res.status(500).send('Server error: ' + error.message);
    }
  };

export const getTopGenericName = async(specificIngredients) => {
  const ingredientCounts = {};

  for (const ingredientName of specificIngredients) {
    const ingredients = await Ingredient.findAll({ where: { name: ingredientName } });
    for (const ingredient of ingredients) {
      const result = await Meal.findAndCountAll({
        include: {
          model: Ingredient,
          where: { id: ingredient.id }
        }
      });
      if (!ingredientCounts[ingredient.name]) {
        ingredientCounts[ingredient.name] = 0;
      }
      ingredientCounts[ingredient.name] += result.count;
    }
  }

  // Finden des generischen Namens mit den meisten Mahlzeiten
  let topGenericName = null;
  let maxCount = 0;
  for (const [ingredientName, count] of Object.entries(ingredientCounts)) {
    if (count > maxCount) {
      maxCount = count;
      topGenericName = ingredientName;
    }
  }

  return topGenericName;
}