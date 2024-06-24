import Group from '../models/Group.js';
import Product from '../models/Products.js';
import GroupProduct from '../models/GroupProduct.js';
import MealModel from '../models/Meals.js';
import GroupMeal from '../models/GroupMeal.js';

export const addProductToGroup = async (groupId, productId) => {
    try {
        const group = await Group.findByPk(groupId);
        const product = await Product.findByPk(productId);

        if (!group || !product) {
            throw new Error('Group or Product not found');
        }

        await GroupProduct.create({ groupId, productId });
        console.log(`Product ${productId} added to Group ${groupId}`);
    } catch (error) {
        console.error('Error adding product to group:', error);
    }
};

export const addMealToGroup = async (groupId, mealId) => {
    try {
        const group = await Group.findByPk(groupId);
        const meal = await MealModel.findByPk(mealId);

        if (!group || !meal) {
            throw new Error('Group or Meal not found');
        }

        await GroupMeal.create({ groupId, mealId });
        console.log(`Meal ${mealId} added to Group ${groupId}`);
    } catch (error) {
        console.error('Error adding meal to group:', error);
    }
};

export const getGroupMeals = async (groupId) => {
    try {
        const groupMeals = await Group.findByPk(groupId, {
            include: [
                { model: MealModel, through: { attributes: [] }, attributes: { exclude: [] } } // Alle Felder des Meal-Modells
            ],
            attributes: [] // Keine Gruppeninformationen zurückgeben
        });

        if (!groupMeals) {
            throw new Error('Group not found');
        }

        return groupMeals.meals; // Nur die Meals zurückgeben
    } catch (error) {
        console.error('Error fetching group meals:', error);
    }
};

export const getGroupProducts = async (groupId) => {
    try {
        const groupMeals = await Group.findByPk(groupId, {
            include: [
                { model: Product, through: { attributes: [] }, attributes: { exclude: [] } } // Alle Felder des Meal-Modells
            ],
            attributes: [] // Keine Gruppeninformationen zurückgeben
        });

        if (!groupMeals) {
            throw new Error('Group not found');
        }
        const productData = groupMeals.products
        productData.imageFrontUrl = getImageUrl(productData, 'front');
        productData.imageIngredientsUrl = getImageUrl(productData, 'ingredients');
        productData.imageNutritionUrl = getImageUrl(productData, 'nutrition');
        console.log(productData);
        return productData;
    } catch (error) {
        console.error('Error fetching group meals:', error);
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
