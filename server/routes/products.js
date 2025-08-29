const express = require('express');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all products (for home page)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find()
      .populate('seller', 'name shopName')
      .sort({ createdAt: -1 });
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 🆕 NEW: Get products by category with pagination
router.get('/category/:categoryName', async (req, res) => {
  try {
    const { categoryName } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Case-insensitive category search
    const query = { category: new RegExp(categoryName, 'i') };

    const products = await Product.find(query)
      .populate('seller', 'name shopName')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.json({
      products,
      total,
      totalPages,
      currentPage: page,
      category: categoryName
    });
  } catch (error) {
    console.error('Error fetching category products:', error);
    res.status(500).json({ message: 'Error fetching category products', error: error.message });
  }
});

// Get single product (for detailed page)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'name shopName email');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 🔧 UPDATED: Create product (handles images array)
router.post('/', auth, async (req, res) => {
  try {
    if (!req.user.isSeller) {
      return res.status(403).json({ message: 'Please enable seller mode first' });
    }

    const { name, description, price, images, category, stock } = req.body;

    const product = new Product({
      name,
      description,
      price,
      images: images || [], // Handle images array
      image: images && images.length > 0 ? images[0] : '', // First image as main
      category,
      stock,
      seller: req.user._id
    });

    await product.save();
    await product.populate('seller', 'name shopName');

    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
});

// 🔧 UPDATED: Update product (handles images array)
router.put('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Prepare update data
    const updateData = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      stock: req.body.stock,
      images: req.body.images || [],
      image: req.body.images && req.body.images.length > 0 ? req.body.images[0] : ''
    };

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('seller', 'name shopName');

    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
});

// Delete product (dashboard)
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get seller's products (dashboard)
router.get('/seller/my-products', auth, async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
