import { searchProducts } from './Products.js';

export const getPrediction = async (req, res) => {
    const imgBuffer = req.body;
    try {
        const response = await fetch('http://python-predictor:5000/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/octet-stream'
            },
            body: imgBuffer
        });

        if (!response.ok) {
            throw new Error('Failed to get prediction from Python container');
        }

        const data = await response.json();
        const lineItems = data.line_items;

        const searchedProducts = await Promise.all(lineItems.map(async (item) => {
            try {
                const products = await searchProducts(item.item_name, 1);
                return {
                    ...item,
                    searchResults: products
                };
            } catch (error) {
                console.error(`Error searching for item ${item.item_name}:`, error);
                
            }
        }));

        data.line_items = searchedProducts;
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to get prediction from Python container');
    }
};
