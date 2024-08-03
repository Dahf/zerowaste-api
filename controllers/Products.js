import supabase from '../config/Database.js'; // Import the Supabase client

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

export const getProductByBarcode = async (req, res) => {
    const { barcode } = req.query;
    try {
        const { data: product, error } = await supabase
            .from('products')
            .select('*')
            .eq('_id', barcode)
            .single();

        if (error) {
            throw error;
        }

        if (product) {
            product.imageFrontUrl = getImageUrl(product, 'front');
            product.imageIngredientsUrl = getImageUrl(product, 'ingredients');
            product.imageNutritionUrl = getImageUrl(product, 'nutrition');
            res.json(product);
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
        const { data: products, error } = await supabase
            .from('products')
            .select('*')
            .textSearch('tsv', searchQuery, {
                type: 'plain',
                config: 'simple'
            })
            .limit(limit)
            .order('completeness', { ascending: false });

        if (error) {
            throw error;
        }

        const productsWithImages = products.map(product => {
            product.imageFrontUrl = getImageUrl(product, 'front');
            product.imageIngredientsUrl = getImageUrl(product, 'ingredients');
            product.imageNutritionUrl = getImageUrl(product, 'nutrition');
            return product;
        });

        return productsWithImages;
    } catch (error) {
        console.error('Error searching products:', error);
        throw error;
    }
};
