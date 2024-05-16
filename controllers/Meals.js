import Meal from "../models/Meals.js";
import Ingredient from "../models/Ingredient.js";
import { Op } from 'sequelize';
import MealIngredient from "../models/MealIngredients.js";

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
          const translatedIngredients = await Promise.all(
              ingredientsArray.map(async ing => await translateText(ing, "en"))
          );

          console.log("Translated Ingredients:");
          translatedIngredients.forEach(condition => {
              console.log(JSON.stringify(condition, null, 2));
          });

          const ingredientConditions = translatedIngredients.map(translatedIngredient => {
              const condition = {
                  name: { [Op.iLike]: '%' + translatedIngredient + '%' }
              };
              console.log("Created Condition:", JSON.stringify(condition, null, 2));
              return condition;
          });

          console.log("Bedingungen mit JSON.stringify:");
          console.log(JSON.stringify({ [Op.and]: ingredientConditions }, null, 2));

          console.log("Einzelne Bedingungen:");
          ingredientConditions.forEach(condition => {
              console.log(JSON.stringify(condition, null, 2));
          });

          foundItems = await Meal.findAll({
              include: [{
                  model: Ingredient,
                  required: true, // required should be true if there are ingredients
              }, {
                  model: Ingredient,
                  as: "tagFilter",
                  required: true, // required should be true if there are ingredients
                  where: {
                      [Op.and]: ingredientConditions
                  }
              }],
          });
      } else {
          foundItems = await Meal.findAll({
              include: [{
                  model: Ingredient,
                  required: false,
              }],
          });
      }

      res.json(foundItems);
  } catch (error) {
      res.status(500).send('Server error: ' + error.message);
  }
};
