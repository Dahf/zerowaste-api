import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken"
import Meal from './models/Meals.js'
import Ingredient from "./models/Ingredient.js";
import router from "./router/index.js";
import MealIngredient from "./models/MealIngredients.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

dotenv.config();
const app = express();


app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));
app.use(cors({ credentials:true, origin:'https://zerowaste-frontend' }));

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

