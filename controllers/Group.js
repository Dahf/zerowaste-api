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
        const productData = groupMeals.products.toJSON(); // Assuming `product` is a Sequelize instance
        productData.imageFrontUrl = getImageUrl(productData, 'front');
        productData.imageIngredientsUrl = getImageUrl(productData, 'ingredients');
        productData.imageNutritionUrl = getImageUrl(productData, 'nutrition');
      
        return productData;
    } catch (error) {
        console.error('Error fetching group meals:', error);
    }
};