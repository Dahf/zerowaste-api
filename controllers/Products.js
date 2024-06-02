import Product from "../models/Products.js";

export const getProductByBarcode = async (req, res) => {
    const { barcode } = req.query;
    const product = await Product.findOne({
        where: {
            _id: barcode
        }
    });

    res.json(product);
}