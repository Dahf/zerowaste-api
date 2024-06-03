import Product from "../models/Products.js";
import { Op, Sequelize } from 'sequelize';
import re from 're';

function getImageUrl(productData, imageName, resolution = 'full') {
    if (!productData.images || !productData.images[imageName]) {
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

export const getProductByBarcode = async (req, res) => {
    const { barcode } = req.query;
    try {
        const product = await Product.findOne({
            where: {
                _id: barcode
            }
        });

        if (product) {
            const productData = product.toJSON(); // Assuming `product` is a Sequelize instance
            productData.imageFrontUrl = getImageUrl(productData, 'front');
            productData.imageIngredientsUrl = getImageUrl(productData, 'ingredients');
            productData.imageNutritionUrl = getImageUrl(productData, 'nutrition');
            res.json(productData);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        console.error('Error fetching product by barcode:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const searchProducts = async (searchQuery, limit = 10) => {
    try {
        const products = await Product.findAll({
            where: Sequelize.literal(`tsv @@ plainto_tsquery('simple', '${searchQuery}')`),
            limit: limit
        });

        const productsWithImages = products.map(product => {
            const productData = product.toJSON(); // Assuming `product` is a Sequelize instance
            productData.imageFrontUrl = getImageUrl(productData, 'front');
            productData.imageIngredientsUrl = getImageUrl(productData, 'ingredients');
            productData.imageNutritionUrl = getImageUrl(productData, 'nutrition');
            return productData;
        });

        return productsWithImages;
    } catch (error) {
        console.error('Error searching products:', error);
        throw error;
    }
};
