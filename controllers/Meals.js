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
                ingredientsArray.map(async ing => {
                    const translated = await translateText(ing, "en");
                    return translated.toLowerCase();
                })
            );


            foundItems = await Meal.findAll({
                where: {
                  id: {
                    [Op.in]: Sequelize.literal(`
                      (SELECT "mealId" FROM "MealIngredient" WHERE "ingredientId" IN 
                      (SELECT "id" FROM "ingredient" WHERE "name" IN (${translatedIngredients.map(name => `'${name}'`).join(',')}))
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