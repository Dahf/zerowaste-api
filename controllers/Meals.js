import Meal from "../models/Meals.js";
import Ingredient from "../models/Ingredient.js";
import { Op, Sequelize } from 'sequelize';
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
            try {
                // Ensure ingredient is a string
                if (typeof ingredient !== 'string') {
                    throw new Error(`Expected a string for ingredient, but got ${typeof ingredient}`);
                }
            
                // Log the received ingredient
                console.log("Received ingredient:", ingredient);
            
                // Split the ingredient string into an array and trim whitespace
                const ingredientsArray = ingredient.split(',').map(ing => ing.trim());
            
                // Log the split and trimmed ingredients
                console.log("Ingredients array:", ingredientsArray);
            
                // Translate each ingredient
                const translatedIngredients = await Promise.all(
                    ingredientsArray.map(async ing => await translateText(ing, "en"))
                );
            
                // Log the translated ingredients
                console.log("Translated ingredients:", translatedIngredients);
            
                // Search for meals with the given ingredients
                foundItems = await Meal.findAll({
                    include: [{
                        model: Ingredient,
                        required: !!translatedIngredients.length,
                    }, {
                        required: !!translatedIngredients.length,
                        model: Ingredient,
                        as: "tagFilter",
                        where: {
                            [Op.in]: translatedIngredients
                        }
                    }],
                });
            
                // Log the found items
                console.log("Found items:", foundItems);
            
            } catch (error) {
                // Log any errors
                console.error("Error processing ingredients:", error.message);
            }
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