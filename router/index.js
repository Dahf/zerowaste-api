import express from "express";
import Meal from '../models/Meals.js'
import Ingredient from "../models/Ingredient.js";
import { Sequelize, Op } from "sequelize";
import MealIngredient from "../models/MealIngredients.js";

const router = express.Router();

const secretKey = process.env.KEY; 

async function translateText(texts, targetLang, sourceLang = 'auto') {
  const response = await fetch("https://translate.silasbeckmann.de/translate", {
      method: "POST",
      body: JSON.stringify({
          q: texts,
          source: sourceLang,
          target: targetLang,
          format: "text"
      }),
      headers: { "Content-Type": "application/json" }
  });

  const data = await response.json();
  return data.map(item => item.translatedText);
}


async function translateObject(obj, targetLang) {
  const itemsToTranslate = [];
  const paths = [];

  function extractStringsToTranslate(obj, path = []) {
      for (const key in obj) {
          if (typeof obj[key] === 'string') {
              itemsToTranslate.push(obj[key]);
              paths.push([...path, key]);
          } else if (Array.isArray(obj[key])) {
              obj[key].forEach((item, index) => extractStringsToTranslate(item, [...path, key, index]));
          } else if (typeof obj[key] === 'object' && obj[key] !== null) {
              extractStringsToTranslate(obj[key], [...path, key]);
          }
      }
  }

  extractStringsToTranslate(obj);

  const translatedTexts = await translateText(itemsToTranslate, targetLang);

  translatedTexts.forEach((translatedText, index) => {
      let current = obj;
      const path = paths[index];
      for (let i = 0; i < path.length - 1; i++) {
          current = current[path[i]];
      }
      current[path[path.length - 1]] = translatedText;
  });

  return obj;
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
          const translatedIngredient = await translateText([ingredient], 'en');
          foundItems = await Meal.findAll({
              include: [{
                  model: Ingredient,
                  required: !!translatedIngredient[0],
              }, {
                  required: !!translatedIngredient[0],
                  model: Ingredient,
                  as: "tagFilter",
                  where: { name: { [Op.iLike]: '%' + translatedIngredient[0] + '%' } }
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

      // Wenn eine Zielsprache angegeben ist, übersetze die gesamte Antwort
      if (lan && lan !== 'en') {
          const responseObject = { meals: foundItems };
          await translateObject(responseObject, lan);
          foundItems = responseObject.meals;
      }

      // Ergebnisse zurückgeben
      res.json(foundItems);
  } catch (error) {
      res.status(500).send('Server error: ' + error.message);
  }
});

export default router;