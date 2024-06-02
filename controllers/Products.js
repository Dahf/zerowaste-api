import Product from "../models/Products.js";

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
export const searchProducts = async (searchQuery) => {
    const terms = searchQuery.split(' ').map(term => term.trim());
  
    return await Product.findAll({
      where: {
        [Op.or]: [
          {
            product_name: {
              [Op.iLike]: `%${searchQuery}%`
            }
          },
          ...terms.map(term => ({
            categories: {
              [Op.iLike]: `%${term}%`
            }
          }))
        ]
      }
    });
  };