import express from "express";
import Meal from '../models/Meals.js'
import Ingredient from "../models/Ingredient.js";
import { Sequelize, Op } from "sequelize";

const router = express.Router();

const secretKey = process.env.KEY; 
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
router.get("/status", (request, response) => {
    const status = {
       "Status": "Running"
    };
    response.send(status);
 });

 function verifyJWT(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).send({ error: "Token ist erforderlich" });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(403).send({ error: "Token ist ungültig" });
        }
        req.user = decoded;
        next();
    });
}

 router.post("/meal", verifyJWT, async (request, response) => {
    const { name, description, servingSize, calories, fat, carbohydrates, protein, fiber, sugar, sodium, ingredients } = request.body
    try {

      const meal = await Meal.create({
        name,
        description,
        servingSize,
        calories,
        fat,
        carbohydrates,
        protein,
        fiber,
        sugar,
        sodium
      });
      if (ingredients && ingredients.length) {
        for (const ingredient of ingredients) {
          const [ing, created] = await Ingredient.findOrCreate({
            where: { name: ingredient.name },
            defaults: { measure: ingredient.measure }
          });
  
          // Verbinden der Zutat mit der Mahlzeit mit zusätzlichen Mengenangaben
          await meal.addIngredient(ing, { through: { quantity: ingredient.quantity } });
        }
      }
  
      // Antwort mit der erstellten Mahlzeit und ihren Zutaten
      const result = await Meal.findByPk(meal.id, {
        include: {
          model: Ingredient,
          through: {
            attributes: ['quantity']
          }
        }
      });
      res.status(201).json(result);
    } catch (error) {
      res.status(500).send('Server error: ' + error.message);
    }
    
 });
 router.get('/meals', async (req, res) => {
  const { ingredient, lan } = req.query;
  try {
    let foundItems;

    if (ingredient) {
      // Zutaten in ein Array aufteilen
      const ingredientsArray = ingredient.split(',').map(ing => ing.trim());
      
      // Zutaten übersetzen und in ein neues Array speichern
      const translatedIngredients = await Promise.all(
        ingredientsArray.map(async ing => await translateText(ing, "en"))
      );

      // Bedingungen für jede übersetzte Zutat erstellen
      const ingredientConditions = translatedIngredients.map(translatedIngredient => ({
        name: { [Op.iLike]: '%' + translatedIngredient + '%' }
      }));

      console.log(ingredientConditions)

      foundItems = await Meal.findAll({
        include: [{
          model: Ingredient,
          required: !!translatedIngredients.length,
        }, {
          required: !!translatedIngredients.length,
          model: Ingredient,
          as: "tagFilter",
          where: {
            [Op.and]: ingredientConditions
          }
        }],
      });
    } else {
      foundItems = await Meal.findAll({
        include: [{
          required: !!ingredient,
          model: Ingredient,
        }],
      });
    }
    
    // Ergebnisse zurückgeben
    res.json(foundItems);
  } catch (error) {
    res.status(500).send('Server error: ' + error.message);
  }
});
export default router;