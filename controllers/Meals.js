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

            const ingredientsArray = ingredient.split(',').map(ing => ing.trim());
        
            // Translate each ingredient
            const translatedIngredients = await Promise.all(
                ingredientsArray.map(async ing => await translateText(ing, "en"))
            );

            foundItems = await Meal.findAll({
                include: [{
                    model: Ingredient,
                    required: !!translatedIngredients.length,
                }, {
                    required: !!translatedIngredients.length,
                    model: Ingredient,
                    as: "tagFilter",
                    where: {
                        name: {
                            [Op.in]: translatedIngredients
                        }
                    }
                    
                    
                    /*where: {
                        name: { [Op.in]: translatedIngredients }
                    }*/
                }],
                group: ['meals.id'],
                having: Sequelize.literal(`COUNT(DISTINCT "ingredients"."id") = ${translatedIngredients.length}`),
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