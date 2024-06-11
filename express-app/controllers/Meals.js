import Meal from "../models/Meals.js";
import Ingredient from "../models/Ingredient.js";
import { Op, Sequelize } from 'sequelize';
import MealIngredient from "../models/MealIngredients.js";
import db from "../config/Database.js";
import pluralize from "pluralize";

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
export const getMealCombination = async(req, res) => {
  const { ingredients } = req.query;
  if (!ingredients) return res.status(400).json({ error: 'Ingredients must be provided' });

  const ingredientsArray = ingredients.split(',').map(ing => ing.trim());

  if (ingredientsArray.length === 0) {
    return res.status(400).json({ error: 'Ingredients must be a non-empty array' });
  }
  const translatedIngredients = await Promise.all(
      ingredientsArray.map(async ing => await translateText(ing, "en"))
  );

  const replacements = {};
  translatedIngredients.forEach((ingredient, idx) => {
    replacements[`ingredient${idx}`] = `%${ingredient}%`;
  });
  console.log(replacements);

  try {
    const result = await db.query(
      `
      WITH ingredient_combinations AS (
        SELECT
          mi."mealId",
          ARRAY_AGG(i.name ORDER BY i.name) AS ingredients
        FROM
          "MealIngredient" mi
        JOIN
          "ingredient" i ON mi."ingredientId" = i.id
        WHERE
          ${translatedIngredients.map((_, idx) => `i.name ILIKE :ingredient${idx}`).join(' OR ')}
        GROUP BY
          mi."mealId"
        HAVING
          COUNT(*) >= 2
      )
      SELECT
        m.*,
        json_agg(json_build_object(
          'id', i.id,
          'name', i.name,
          'measure', i.measure,
          'quantity', i.quantity,
          'createdAt', i."createdAt",
          'updatedAt', i."updatedAt"
        )) AS ingredients
      FROM
        "meals" m
      JOIN
        "MealIngredient" mi ON m.id = mi."mealId"
      JOIN
        "ingredient" i ON mi."ingredientId" = i.id
      JOIN
        ingredient_combinations ic ON m.id = ic."mealId"
      GROUP BY
        m.id
      ;
      `,
      {
        replacements,
        type: db.QueryTypes.SELECT,
      }
    );

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
export const getMeal = async (req, res) => {
    const { ingredients, lan, id } = req.query;
    console.log(req.query)
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
  
        if (ingredients) {

            const ingredientsArray = ingredients.split(',').map(ing => ing.trim());

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

  export const getTopGenericNames = async (specificIngredients) => {
    const ingredientCounts = {};
  
    for (const ingredientName of specificIngredients) {
      const singularName = pluralize.singular(ingredientName);
      const pluralName = pluralize.plural(ingredientName);
  
      const searchTerms = [singularName, pluralName];
  
      for (const term of searchTerms) {
        try {
          // Finden aller Zutaten mit dem spezifischen Namen (singular und plural)
          const ingredients = await Ingredient.findAll({
            where: {
              name: {
                [Op.iLike]: `%${term}%`
              }
            }
          });
  
          if (!ingredients.length) {
            console.log(`Keine Zutaten gefunden für: ${term}`);
            continue;
          }
  
          for (const ingredient of ingredients) {
            // Zählen der Mahlzeiten, die diese Zutat enthalten
            const result = await Meal.findAndCountAll({
              include: {
                model: Ingredient,
                where: { id: ingredient.id }
              }
            });
  
            console.log(`Gefundene Mahlzeiten für Zutat ${ingredient.name} (ID: ${ingredient.id}): ${result.count}`);
  
            if (!ingredientCounts[ingredient.name]) {
              ingredientCounts[ingredient.name] = 0;
            }
            ingredientCounts[ingredient.name] += result.count;
          }
        } catch (error) {
          console.error(`Fehler beim Abrufen der Zutaten für ${term}:`, error);
        }
      }
    }
  
    // Sammeln aller generischen Namen
    const genericNames = Object.keys(ingredientCounts);
    
    console.log(`Alle generischen Namen: ${genericNames.join(', ')}`);
  
    return genericNames;
  };

  export const getAllUniqueCategories = async (req, res) => {
    try {
      const categories = await Meal.findAll({
        attributes: [
          [Meal.sequelize.fn('DISTINCT', Meal.sequelize.col('category')), 'category']
        ],
        raw: true
      });
      
      const uniqueCategories = categories.map(cat => cat.category);
      res.json({ categories: uniqueCategories });
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
export const getRandomMeals = async (req, res) => {
  const { limit } = req.query;
  const mealLimit = limit ? parseInt(limit) : 5; // Default auf 5 zufällige Mahlzeiten, wenn kein Limit angegeben ist

  try {
    const randomMeals = await Meal.findAll({
      include: [
        {
          model: Ingredient,
          through: { attributes: [] }  // Exkludieren der MealIngredient-Attribute
        }
      ],
      order: [
        Sequelize.fn('RANDOM')
      ],
      limit: mealLimit
    });

    res.json(randomMeals);
  } catch (error) {
    console.error('Error fetching random meals:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};