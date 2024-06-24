import express from "express";
import dotenv from "dotenv";
import Meal from './models/Meals.js'
import Ingredient from "./models/Ingredient.js";
import Product from "./models/Products.js";
import router from "./router/index.js";
import MealIngredient from "./models/MealIngredients.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';
import fs from 'fs';
import { verifyTokenAdmin } from "./middleware/VerifyToken.js";
import bodyParser from "body-parser";
import GroupProduct from "./models/GroupProduct.js";
import Group from "./models/Group.js";
import MealModel from "./models/Meals.js";
import GroupMeal from "./models/GroupMeal.js";


dotenv.config();
const app = express();

const corsOptions = {
  origin: 'https://silasbeckmann.de', // Domain des Frontends
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.raw({ type: 'application/octet-stream', limit: '10mb' }));
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
    let categoryString = "";
    if (Array.isArray(formData.category)) {
      categoryString = formData.category.find(cat => cat !== "") || "";
    } else {
      categoryString = category;
    }
    const meal = await Meal.create({
      name: formData.name,
      category: categoryString,
      description: formData.description,
      servingSize: formData.servingSize,
      calories: formData.calories,
      fat: formData.fat,
      carbohydrates: formData.carbohydrates,
      protein: formData.protein,
      energy: formData.energy,
      sugar: formData.sugar,
      sodium: formData.sodium,
      image: publicUrl
    });
    
    if (Array.isArray(JSON.parse(formData.ingredients)) && JSON.parse(formData.ingredients).length > 0) {
      try {
        const ingredientPromises = JSON.parse(formData.ingredients).map(async (ingredient) => {
          console.log(ingredient);
          const ing = await Ingredient.create({ name: ingredient.name, measure: ingredient.measure, quantity: ingredient.quantity });
          return meal.addIngredient(ing);
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


Group.belongsToMany(Product, { through: GroupProduct });
Product.belongsToMany(Group, { through: GroupProduct });

Group.belongsToMany(MealModel, { through: GroupMeal });
MealModel.belongsToMany(Group, { through: GroupMeal });


const PORT = process.env.PORT || 8088;


app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});


