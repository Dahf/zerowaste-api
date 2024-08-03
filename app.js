import express from "express";
import dotenv from "dotenv";
import router from "./router/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import supabase from './config/Database.js';

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

app.post('/meal', async (req, res) => {
  const file = req.file; // Read file from the request
  const body = req.body;
  
  try {
    if (!file) {
      return res.status(400).send('Keine Datei hochgeladen');
    }

    // Upload image to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('meal-images') // Ensure you have a bucket named 'meal-images'
      .upload(`public/${file.originalname}`, file.buffer, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      throw uploadError;
    }

    const publicUrl = supabase
      .storage
      .from('meal-images')
      .getPublicUrl(`public/${file.originalname}`).data.publicUrl;

    const formData = {};
    for (const key in body) {
      formData[key] = body[key];
    }

    let categoryString = "";
    if (Array.isArray(formData.category)) {
      categoryString = formData.category.find(cat => cat !== "") || "";
    } else {
      categoryString = formData.category;
    }

    // Insert the meal into the database
    const { data: mealData, error: mealError } = await supabase
      .from('meals')
      .insert([{
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
      }])
      .single();

    if (mealError) {
      throw mealError;
    }

    const mealId = mealData.id;

    // Insert ingredients if they exist
    const ingredients = JSON.parse(formData.ingredients);
    if (Array.isArray(ingredients) && ingredients.length > 0) {
      const ingredientPromises = ingredients.map(async (ingredient) => {
        const { data: ingredientData, error: ingredientError } = await supabase
          .from('ingredients')
          .insert([{
            name: ingredient.name,
            measure: ingredient.measure,
            quantity: ingredient.quantity
          }])
          .single();

        if (ingredientError) {
          throw ingredientError;
        }

        const ingredientId = ingredientData.id;

        // Insert into MealIngredient
        const { data: mealIngredientData, error: mealIngredientError } = await supabase
          .from('meal_ingredients')
          .insert([{
            mealId,
            ingredientId
          }]);

        if (mealIngredientError) {
          throw mealIngredientError;
        }
      });

      await Promise.all(ingredientPromises);
    }

    // Fetch the meal with its ingredients
    const { data: result, error: fetchError } = await supabase
      .from('meals')
      .select(`
        *,
        ingredients (
          *
        )
      `)
      .eq('id', mealId)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Error creating meal:', error);
    res.status(500).json({ error: 'Failed to create meal' });
  }
});


const PORT = process.env.PORT || 8088;

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});


