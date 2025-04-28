const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort('-createdAt');
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error while fetching products' });
  }
};


// Admin: Create new product
exports.createProduct = async (req, res) => {
  const { name, stock } = req.body;

  if (!name || stock == null) {
    return res.status(400).json({ message: 'Name and stock are required' });
  }

  try {
    const product = await Product.create({
      name,
      stock
    });

    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating product' });
  }
};
