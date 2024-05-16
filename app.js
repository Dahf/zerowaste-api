import express from "express";
import dotenv from "dotenv";
import Meal from './models/Meals.js'
import Ingredient from "./models/Ingredient.js";
import router from "./router/index.js";
import MealIngredient from "./models/MealIngredients.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';
import fs from 'fs';
import { verifyTokenAdmin } from "./middleware/VerifyToken.js";

dotenv.config();
const app = express();

const corsOptions = {
  origin: 'https://silasbeckmann.de', // Domain des Frontends
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.use(router);

const UPLOAD_DIR = 'uploads';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadPath = path.join(__dirname, UPLOAD_DIR);
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

// Konfigurieren von Multer für Dateiuploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath); // Verzeichnis, in das die Dateien hochgeladen werden sollen
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Dateiname
    },
});

const upload = multer({ storage: storage });


app.use('/uploads', express.static(uploadPath));

app.post('/meal', verifyTokenAdmin, upload.single('image'), async (req, res) => {
  const file = req.file;
  const body = req.body;
  console.log(req);
  try {
    if (!file) {
        return res.status(400).send('Keine Datei hochgeladen');
    }
    const publicUrl = `${req.protocol}://silasbeckmann.de/api/uploads/${file.filename}`;
    const formData = {};
    for (const key in body) {
        formData[key] = body[key];
    }

    const meal = await Meal.create({
      name: formData.name,
      description: formData.description,
      servingSize: formData.servingSize,
      calories: formData.calories,
      fat: formData.fat,
      carbohydrates: formData.carbohydrates,
      protein: formData.protein,
      fiber: formData.fiber,
      sugar: formData.sugar,
      sodium: formData.sodium,
      image: publicUrl
    });
    
    console.log(formData);
    console.log(formData.ingredients);

    if (Array.isArray(formData.ingredients) && formData.ingredients.length > 0) {
      try {
        const ingredientPromises = formData.ingredients.map(async (ingredient) => {
          console.log(ingredient);
          const ing = await Ingredient.create({ name: ingredient.name, measure: ingredient.measure, quantity: ingredient.quantity });
          return meal.addIngredient(ing, { through: { quantity: ingredient.quantity } });
        });
    
        await Promise.all(ingredientPromises);
      } catch (error) {
        console.error('Error processing ingredients:', error);
      }
    } else {
      console.log('No ingredients found or ingredients is not an array.');
    }

    const result = await Meal.findByPk(meal.id, {
      include: {
        model: Ingredient,
        through: {
          model: MealIngredient
        }
      }
    });
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Error creating meal:', error);
    res.status(500).json({ error: 'Failed to create meal' });
  }
});


Meal.belongsToMany(Ingredient, { 
  through: MealIngredient,
  uniqueKey: 'id',
  foreignKey: 'mealId',
  otherKey: 'ingredientId',
});
Meal.belongsToMany(Ingredient, { 
  through: MealIngredient,
  uniqueKey: 'id',
  foreignKey: 'mealId',
  otherKey: 'ingredientId',
  as: 'tagFilter'
});
Ingredient.belongsToMany(Meal, { through: MealIngredient });

const PORT = process.env.PORT || 8088;


app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});

