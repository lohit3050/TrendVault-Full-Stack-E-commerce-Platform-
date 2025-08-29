const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

// Place new order
// In your order creation route (when Person B places order)
router.post('/', auth, async (req, res) => {
  try {
    const { buyer, items, totalAmount } = req.body;
    
    const order = new Order({
      user: req.user._id, // Person B (buyer)
      buyer,
      items: items.map(item => ({
        product: item.product,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        seller: item.seller // ✅ Person A (product owner) ID
      })),
      totalAmount,
      paymentMethod: 'Cash on Delivery',
      status: 'Pending'
    });

    await order.save();
    res.status(201).json({ orderNumber: order.orderNumber });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create order' });
  }
});


// Get user's orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate([
        { path: 'items.product', select: 'name price category' },
        { path: 'items.seller', select: 'name shopName' }
      ])
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// Get single order details
router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate([
        { path: 'items.product', select: 'name price category' },
        { path: 'items.seller', select: 'name shopName' }
      ])
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// Update order status (for sellers/admin)
router.put('/:orderId/status', auth, async (req, res) => {
  try {
    const { status, note } = req.body;
    
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Add to status history
    order.statusHistory.push({
      status,
      timestamp: new Date(),
      note
    });
    
    order.status = status;
    
    if (status === 'Delivered') {
      order.deliveredAt = new Date();
    }

    await order.save();
    res.json({ message: 'Order status updated successfully', order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Failed to update order status' });
  }
});

// Get seller statistics (total orders, total earnings)
router.get('/seller/stats', auth, async (req, res) => {
  try {
    const sellerId = req.user._id;
    
    // Get seller stats using aggregation
    const stats = await Order.aggregate([
      { $unwind: '$items' },
      { $match: { 'items.seller': sellerId } },
      {
        $group: {
          _id: null,
          totalOrders: { $addToSet: '$_id' }, // Count unique orders
          totalEarnings: { 
            $sum: { $multiply: ['$items.quantity', '$items.price'] } 
          }
        }
      },
      {
        $project: {
          totalOrders: { $size: '$totalOrders' }, // Get array size
          totalEarnings: 1
        }
      }
    ]);

    const result = stats[0] || { totalOrders: 0, totalEarnings: 0 };
    res.json(result);
  } catch (error) {
    console.error('Error fetching seller stats:', error);
    res.status(500).json({ message: 'Failed to fetch seller stats' });
  }
});

// Get orders for seller's products
router.get('/seller/orders', auth, async (req, res) => {
  try {
    const sellerId = req.user._id;
    console.log('Fetching orders for seller:', sellerId); // Debug log
    
    const orders = await Order.find({ 'items.seller': sellerId })
      .populate('user', 'name email')
      .populate('items.product', 'name price')
      .sort({ createdAt: -1 });
    
    console.log(`Found ${orders.length} orders for seller`); // Debug log
    res.json(orders);
  } catch (error) {
    console.error('Error fetching seller orders:', error);
    res.status(500).json({ message: 'Failed to fetch seller orders' });
  }
});

module.exports = router;
