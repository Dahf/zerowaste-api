import supabase from '../config/Database.js'; 

export const addProductToGroup = async (groupId, productId) => {
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

        // Check if product exists
        const { data: product, error: productError } = await supabase
            .from('products')
            .select('*')
            .eq('_id', productId)
            .single();
        
        if (productError || !product) {
            throw new Error('Product not found');
        }

        // Insert into group_products
        const { error: insertError } = await supabase
            .from('group_products')
            .insert([{ groupId, productId }]);
        
        if (insertError) {
            throw insertError;
        }

        console.log(`Product ${productId} added to Group ${groupId}`);
    } catch (error) {
        console.error('Error adding product to group:', error);
    }
};

export const addMealToGroup = async (groupId, mealId) => {
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

        // Insert into group_meals
        const { error: insertError } = await supabase
            .from('group_meals')
            .insert([{ groupId, mealId }]);
        
        if (insertError) {
            throw insertError;
        }

        console.log(`Meal ${mealId} added to Group ${groupId}`);
    } catch (error) {
        console.error('Error adding meal to group:', error);
    }
};

export const getGroupMeals = async (groupId) => {
    try {
        // Fetch group meals
        const { data: groupMeals, error } = await supabase
            .from('group_meals')
            .select('meals(*)')
            .eq('groupId', groupId);
        
        if (error) {
            throw error;
        }

        return groupMeals.map(groupMeal => groupMeal.meals);
    } catch (error) {
        console.error('Error fetching group meals:', error);
    }
};

export const getGroupProducts = async (groupId) => {
    try {
        // Fetch group products
        const { data: groupProducts, error } = await supabase
            .from('group_products')
            .select('products(*)')
            .eq('groupId', groupId);

        if (error) {
            throw error;
        }

        const products = groupProducts.map(groupProduct => {
            const product = groupProduct.products;
            return {
                ...product,
                imageFrontUrl: getImageUrl(product, 'front'),
                imageIngredientsUrl: getImageUrl(product, 'ingredients'),
                imageNutritionUrl: getImageUrl(product, 'nutrition')
            };
        });
        return products;
    } catch (error) {
        console.error('Error fetching group products:', error);
    }
};

function getImageUrl(productData, baseName, resolution = 'full') {
    if (!productData.images) {
        return null;
    }

    // Find the first key that starts with the base name
    const imageName = Object.keys(productData.images).find(name => name.startsWith(baseName));
    if (!imageName) {
        return null;
    }

    const baseUrl = 'https://images.openfoodfacts.org/images/products';
    let folderName = productData.code;

    if (folderName.length > 8) {
        folderName = folderName.replace(/(...)(...)(...)(.*)/, '$1/$2/$3/$4');
    }

    let filename;
    if (/^\d+$/.test(imageName)) { // only digits
        const resolutionSuffix = resolution === 'full' ? '' : `.${resolution}`;
        filename = `${imageName}${resolutionSuffix}.jpg`;
    } else {
        const rev = productData.images[imageName].rev;
        filename = `${imageName}.${rev}.${resolution}.jpg`;
    }

    return `${baseUrl}/${folderName}/${filename}`;
}