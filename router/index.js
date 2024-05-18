import express from "express";
import { verifyToken, verifyTokenAdmin } from "../middleware/VerifyToken.js";
import { getMeal, getTopGenericName } from "../controllers/Meals.js";
import { Login, Logout, Register } from "../controllers/Users.js";
import { refreshToken } from "../controllers/RefreshToken.js";

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
router.delete('/logout', Logout);
router.get('/meals', getMeal);
router.get('/top-generic-name', async (req, res) => {

   const ingredientsArray = req.query.ingredients.split(',').map(ing => ing.trim());

   const translatedIngredients = await Promise.all(
      ingredientsArray.map(async ing => await translateText(ing, "en"))
  );

   try {
     const topGenericName = await getTopGenericName(translatedIngredients);
     res.json({ topGenericName });
   } catch (error) {
     res.status(500).json({ error: error.message });
   }
 });
export default router;