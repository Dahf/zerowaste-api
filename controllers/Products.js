import Product from "../models/Products.js";
import { Op, Sequelize } from 'sequelize';

export const getProductByBarcode = async (req, res) => {
    const { barcode } = req.query;
    try {
        const product = await Product.findOne({
            where: {
                _id: barcode
            }
        });
        res.json(product);
    } catch (error) {
        // Handle the error appropriately
        console.error('Error fetching product by barcode:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
export const searchProducts = async (searchQuery, limit = 1000) => {
    return await Product.findAll({
      where: {
        product_name: {
            [Op.iLike]: `%${searchQuery}%`
        }
      },
      limit: limit
    });
  };