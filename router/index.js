import express from "express";
import { verifyGroupToken, verifyToken, verifyTokenAdmin } from "../middleware/VerifyToken.js";
import { assignProductsToMealInGroup, getAllUniqueCategories, getMeal, getMealCombination, getRandomMeals, getTopGenericNames } from "../controllers/Meals.js";
import { Login, Logout, Register } from "../controllers/Users.js";
import { refreshToken } from "../controllers/RefreshToken.js";
import { getProductByBarcode, searchProducts } from "../controllers/Products.js";
import { getPrediction } from "../controllers/Predict.js";
import { addMealToGroup, addProductToGroup, getGroupMeals, getGroupProducts } from "../controllers/Group.js";

const router = express.Router();

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

router.post('/login', Login);
router.post('/register', Register);
router.get('/token', refreshToken);
router.get('/categories', getAllUniqueCategories);
router.delete('/logout', Logout);
router.get('/meals', getMeal);
router.get('/random-meals', getRandomMeals);
router.get('/combination', getMealCombination);
router.get('/products', getProductByBarcode);
router.post('/predict', getPrediction);

// Route zum Zuweisen von Produkten zu einem Meal in einer Gruppe
router.post('/assign-products', verifyGroupToken, async (req, res) => {
  const { groupId, mealId, productIds } = req.body;

  if (!groupId || !mealId || !productIds) {
      return res.status(400).json({ error: 'groupId, mealId und productIds müssen angegeben werden' });
  }

  try {
      const meal = await assignProductsToMealInGroup(groupId, mealId, productIds);
      res.json({ message: 'Produkte erfolgreich zugewiesen', meal });
  } catch (error) {
      res.status(500).json({ error: 'Fehler beim Zuweisen der Produkte' });
  }
});

// Route zum Hinzufügen eines Produkts zu einer Gruppe
router.post('/group/:groupId/products/:productId', verifyGroupToken, async (req, res) => {
  const { groupId, productId } = req.params;
  if (!groupId || !productId) {
    return res.status(400).send("groupId und productId müssen angegeben werden.");
  }
  try {
    await addProductToGroup(groupId, productId);
    res.status(200).send(`Product ${productId} added to Group ${groupId}`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Route zum Hinzufügen eines Meals zu einer Gruppe
router.post('/group/:groupId/meals/:mealId', verifyGroupToken, async (req, res) => {
  const { groupId, mealId } = req.params;
  if (!groupId || !mealId) {
    return res.status(400).send("groupId und mealId müssen angegeben werden.");
  }
  try {
    await addMealToGroup(groupId, mealId);
    res.status(200).send(`Meal ${mealId} added to Group ${groupId}`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Route zum Abrufen der Meals einer Gruppe
router.get('/group/:groupId/meals', verifyGroupToken, async (req, res) => {
  const { groupId } = req.params;
  if (!groupId) {
    return res.status(400).send("groupId muss angegeben werden.");
  }
  try {
    const meals = await getGroupMeals(groupId);
    res.status(200).json(meals);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Route zum Abrufen der Products einer Gruppe
router.get('/group/:groupId/products', verifyGroupToken, async (req, res) => {
  return res.status(400).send(req);
  const { groupId } = req.params;
  if (!groupId) {
    return res.status(400).send("groupId muss angegeben werden.");
  }
  try {
    const products = await getGroupProducts(groupId);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get('/products/search', async (req, res) => {
   try {
     const { query } = req.query;
     if (!query) {
       return res.status(400).json({ message: 'Query parameter is required' });
     }
 
     const products = await searchProducts(query);
     if (products.length > 0) {
       res.status(200).json(products);
     } else {
       res.status(404).json({ message: 'No products found' });
     }
   } catch (error) {
     res.status(500).json({ error });
     console.log(error);
   }
 });

router.get('/top-generic-name', async (req, res) => {

   const ingredientsArray = req.query.ingredients.split(',').map(ing => ing.trim());

   const translatedIngredients = await Promise.all(
      ingredientsArray.map(async ing => await translateText(ing, "en"))
  );

  console.log(translatedIngredients)

   try {
     const topGenericName = await getTopGenericNames(translatedIngredients);
     res.json({ topGenericName });
   } catch (error) {
     res.status(500).json({ error: error.message });
   }
 });

export default router;