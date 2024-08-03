import supabase from '../config/Database.js';
import pluralize from "pluralize";

// Function to translate text
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

// Function to get meal combinations based on ingredients
export const getMealCombination = async (req, res) => {
    const { ingredients } = req.query;
    if (!ingredients) return res.status(400).json({ error: 'Ingredients must be provided' });

    const ingredientsArray = ingredients.split(',').map(ing => ing.trim());

    if (ingredientsArray.length === 0) {
        return res.status(400).json({ error: 'Ingredients must be a non-empty array' });
    }
    const translatedIngredients = await Promise.all(
        ingredientsArray.map(async ing => await translateText(ing, "en"))
    );

    const replacements = {};
    translatedIngredients.forEach((ingredient, idx) => {
        replacements[`ingredient${idx}`] = `%${ingredient}%`;
    });
    console.log(replacements);

    try {
        const { data: result, error } = await supabase
            .rpc('get_meal_combination', replacements);
        
        if (error) {
            throw error;
        }

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Function to get a meal based on ingredients or id
export const getMeal = async (req, res) => {
    const { ingredients, lan, id } = req.query;
    try {
        if (id) {
            const { data: result, error } = await supabase
                .from('meals')
                .select('*, ingredients (*)')
                .eq('id', id)
                .single();
            if (error) throw error;
            res.json(result);
            return;
        }

        let foundItems;

        if (ingredients) {
            const ingredientsArray = ingredients.split(',').map(ing => ing.trim());

            // Translate each ingredient
            const translatedIngredients = await Promise.all(
                ingredientsArray.map(async ing => await translateText(ing, "en"))
            );

            const { data: foundItems, error } = await supabase
                .from('meals')
                .select('*, ingredients (*)')
                .in('ingredients.name', translatedIngredients);
            if (error) throw error;

        } else {
            const { data: foundItems, error } = await supabase
                .from('meals')
                .select('*, ingredients (*)');
            if (error) throw error;
        }

        res.json(foundItems);
    } catch (error) {
        res.status(500).send('Server error: ' + error.message);
    }
}

// Function to get top generic names based on specific ingredients
export const getTopGenericNames = async (specificIngredients) => {
    const ingredientCounts = {};

    for (const ingredientName of specificIngredients) {
        console.log(`Verarbeite Zutat: ${ingredientName}`);
        
        const singularName = pluralize.singular(ingredientName);
        const pluralName = pluralize.plural(ingredientName);
        
        console.log(`Singular: ${singularName}, Plural: ${pluralName}`);

        const searchTerms = [singularName, pluralName];

        for (const term of searchTerms) {
            try {
                console.log(`Suche nach Zutaten mit dem Begriff: ${term}`);
                
                const { data: ingredients, error } = await supabase
                    .from('ingredients')
                    .select('*')
                    .ilike('name', `%${term}%`);
                if (error) throw error;
                
                console.log(`Gefundene Zutaten für ${term}: ${ingredients.length}`);

                if (!ingredients.length) {
                    console.log(`Keine Zutaten gefunden für: ${term}`);
                    continue;
                }

                for (const ingredient of ingredients) {
                    console.log(`Verarbeite Zutat: ${ingredient.name}`);

                    const { count: resultCount, error: mealError } = await supabase
                        .from('meals')
                        .select('*, ingredients (*)', { count: 'exact' })
                        .eq('ingredients.id', ingredient.id);
                    if (mealError) throw mealError;

                    console.log(`Gefundene Mahlzeiten für Zutat ${ingredient.name} (ID: ${ingredient.id}): ${resultCount}`);

                    if (!ingredientCounts[ingredient.name]) {
                        ingredientCounts[ingredient.name] = 0;
                    }
                    ingredientCounts[ingredient.name] += resultCount;
                }
            } catch (error) {
                console.error(`Fehler beim Abrufen der Zutaten für ${term}:`, error);
            }
        }
    }

    const genericNames = Object.keys(ingredientCounts);
    console.log(`Alle generischen Namen: ${genericNames.join(', ')}`);

    return genericNames;
}

// Function to get all unique categories
export const getAllUniqueCategories = async (req, res) => {
    try {
        const { data: categories, error } = await supabase
            .from('meals')
            .select('category', { count: 'exact' });

        if (error) throw error;

        const uniqueCategories = [...new Set(categories.map(cat => cat.category))];
        res.json({ categories: uniqueCategories });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Function to get random meals
export const getRandomMeals = async (req, res) => {
    const { limit } = req.query;
    const mealLimit = limit ? parseInt(limit) : 5;

    try {
        const { data: randomMeals, error } = await supabase
            .from('meals')
            .select('*, ingredients (*)')
            .order('random')
            .limit(mealLimit);

        if (error) throw error;

        res.json(randomMeals);
    } catch (error) {
        console.error('Error fetching random meals:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Function to assign products to a meal in a group
export const assignProductsToMealInGroup = async (groupId, mealId, productIds) => {
    try {
        // Check if group exists
        const { data: group, error: groupError } = await supabase
            .from('groups')
            .select('*')
            .eq('id', groupId)
            .single();
        
        if (groupError || !group) {
            throw new Error('Group not found');
        }

        // Check if meal exists
        const { data: meal, error: mealError } = await supabase
            .from('meals')
            .select('*')
            .eq('id', mealId)
            .single();
        
        if (mealError || !meal) {
            throw new Error('Meal not found');
        }

        // Get existing assignments
        const { data: existingAssignments, error: existingAssignmentsError } = await supabase
            .from('meal_products')
            .select('*')
            .eq('mealId', mealId)
            .eq('groupId', groupId)
            .in('productId', productIds);
        
        if (existingAssignmentsError) throw existingAssignmentsError;

        // Extract existing product IDs
        const existingProductIds = existingAssignments.map(assignment => assignment.productId);

        // Filter new assignments
        const newProductIds = productIds.filter(productId => !existingProductIds.includes(productId));

        // Create new assignments
        if (newProductIds.length > 0) {
            const mealProducts = newProductIds.map(productId => ({
                mealId: mealId,
                productId: productId,
                groupId: groupId
            }));

            const { error: bulkCreateError } = await supabase
                .from('meal_products')
                .insert(mealProducts);
            
            if (bulkCreateError) throw bulkCreateError;
        }

        return meal;
    } catch (error) {
        console.error('Error assigning products to meal in group:', error);
        throw error;
    }
};
