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
            const ingredientSubQueryOptions = {
                attributes: [Sequelize.fn('DISTINCT', Sequelize.col('ingredientId'))],
                where: {
                    ingredientId: {
                        [Op.in]: translatedIngredients
                    }
                }
            };
            
            const ingredientSubQuery = db.getQueryInterface()
                .queryGenerator
                .selectQuery('MealIngredient', ingredientSubQueryOptions, Ingredient)
                .slice(0, -1); // Remove the semicolon
            const mealsWithHamAndCheese = await Meal.findAll({
                    include: [
                      {
                        model: Ingredient,
                        where: {
                          name: {
                            [Op.in]: ['Ham', 'Cheese']
                          }
                        },
                        through: {
                          attributes: []  // exclude MealIngredient attributes
                        }
                      }
                    ],
                    group: ['meals.id'],  // Group by Meal to handle the join correctly
                    having: Sequelize.literal('COUNT(DISTINCT `ingredient`.`id`) = 2')  // Ensure both ingredients are included
            });
            res.json(mealsWithHamAndCheese);
            return;
            /*
            foundItems = await Meal.findAll({
                
                include: [{
                    model: Ingredient,
                    required: !!translatedIngredients.length,
                },{
                    model: Ingredient,
                    required: !!translatedIngredients.length,
                    as: "tagFilter",
                    where: {
                        id: {
                            [Op.in]: Sequelize.literal(`(${ingredientSubQuery})`)
                        }
                    },
                }/*, {
                    required: !!translatedIngredients.length,
                    model: Ingredient,
                    as: "tagFilter",
                    /*where: {
                        name: {
                            [Op.in]: translatedIngredients
                        }
                    }*/
                    
                    
                    /*where: {
                        name: { [Op.in]: translatedIngredients }
                    }
                }],*/
                /*group: ['meals.id', 'ingredients.id', 'ingredients->MealIngredient.mealId'],
                having: Sequelize.literal(`COUNT(DISTINCT "ingredients"."id") = ${translatedIngredients.length}`),*/
            /*});*/
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