import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken"
import Meal from './models/Meals.js'
import Ingredient from "./models/Ingredient.js";
import router from "./router/index.js";
import MealIngredient from "./models/MealIngredients.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';
import fs from 'fs';
dotenv.config();
const app = express();

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

app.post('/api/meal', upload.single('image'), (req, res) => {
  const file = req.file;
  const body = req.body;

  console.log('Datei:', file);
  console.log('Formulardaten:', body);

  if (!file) {
      return res.status(400).send('Keine Datei hochgeladen');
  }

  // Verarbeite die anderen Formulardaten
  const formData = {};
  for (const key in body) {
      formData[key] = body[key];
  }
  console.log('Verarbeitete Formulardaten:', formData);

  // Generiere den öffentlichen Link zur hochgeladenen Datei
  const publicUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;

  // Sende die Antwort an den Client
  res.status(200).json({
      message: 'Upload erfolgreich',
      fileUrl: publicUrl
  });
});

const corsOptions = {
  origin: 'https://silasbeckmann.de', // Domain des Frontends
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

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

app.use(router);

async function createMealWithIngredients() {
  const meal = await Meal.create({
    name: 'Veggie Pizza',
    description: 'A delicious vegetarian pizza with lots of fresh toppings.',
    servingSize: 2
  });

  const tomato = await Ingredient.create({ name: 'Tomato', measure: 'g', quantity: '3' });
  const cheese = await Ingredient.create({ name: 'Cheese', measure: 'g', quantity: '3' });

  await meal.addIngredient(tomato, { through: { measure: '2 cups' } });
  await meal.addIngredient(cheese, { through: { measure: '1.5 cups' } });

  console.log('Meal and Ingredients added');
}

//createMealWithIngredients();

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});

