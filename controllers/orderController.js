const Order = require('../models/Order');
const Product = require('../models/Product');

// Place order (User/Staff/Admin)
// Place order (Auto type based on role)
exports.placeOrder = async (req, res) => {
  const { products } = req.body;
  const userRole = req.user.role;

  if (!products || !Array.isArray(products)) {
    return res.status(400).json({ message: 'Invalid products data' });
  }

  // Determine type automatically
  let type;
  if (userRole === 'admin' || userRole === 'staff') {
    type = 'add_stock';
  } else if (userRole === 'user') {
    type = 'buy_product';
  } else {
    return res.status(400).json({ message: 'Invalid user role' });
  }

  try {
    const formattedProducts = [];

    for (const item of products) {
      const product = await Product.findById(item.id);
    
      if (!product) {
        return res.status(404).json({ message: `Product with ID ${item.id} not found` });
      }
    
      // For 'buy_product', check stock
      if (type === 'buy_product' && product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`
        });
      }
    
      formattedProducts.push({
        productId: product._id,
        name: product.name,
        quantity: item.quantity,
      });
    }
    

    const order = await Order.create({
      orderedBy: req.user._id,
      type,
      products: formattedProducts,
      status: 'pending'
    });

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error placing order' });
  }
};

// Admin, Staff, User: can see their own orders
exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ orderedBy: req.user._id }).sort('-createdAt');
  res.json(orders);
};

// Admin: Get all orders
exports.getAllOrders = async (req, res) => {
  const orders = await Order.find().populate('orderedBy', 'name email role').sort('-createdAt');
  res.json(orders);
};

// Admin: Approve order
exports.processOrder = async (req, res) => {
  const { orderId, status } = req.body;

  if (typeof status !== 'boolean' || !orderId) {
    return res.status(400).json({ message: 'orderId and boolean status are required' });
  }

  try {
    const order = await Order.findById(orderId);

    if (!order || order.status !== 'pending') {
      return res.status(404).json({ message: 'Order not found or already processed' });
    }

    // If status is false => reject
    if (!status) {
      order.status = 'rejected';
      await order.save();
      return res.json({ message: 'Order rejected successfully' });
    }

    // If status is true => approve
    for (const item of order.products) {
      const product = await Product.findOne({ name: item.name });

      if (order.type === 'add_stock') {
        if (product) {
          product.stock += item.quantity;
          await product.save();
        } else {
          await Product.create({
            name: item.name,
            stock: item.quantity
          });
        }
      }

      if (order.type === 'buy_product') {
        if (!product || product.stock < item.quantity) {
          return res.status(400).json({ message: `Insufficient stock for ${item.name}` });
        }
        product.stock -= item.quantity;
        await product.save();
      }
    }

    order.status = 'approved';
    await order.save();

    res.json({ message: 'Order approved and stock updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while processing order' });
  }
};

const fetchOrdersByStatus = async (status, res, label) => {
  try {
    const orders = await Order.find({ status }).populate('orderedBy', 'name email');

    if (orders.length === 0) {
      return res.status(200).json({ message: `No ${label} orders found`, data: [] });
    }

    res.json({ message: `${label.charAt(0).toUpperCase() + label.slice(1)} orders fetched successfully`, data: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Failed to fetch ${label} orders` });
  }
};

// Admin: All pending orders
exports.getPendingOrders = (req, res) => fetchOrdersByStatus('pending', res, 'pending');

// Admin: All approved orders
exports.getApprovedOrders = (req, res) => fetchOrdersByStatus('approved', res, 'approved');

// Admin: All rejected orders
exports.getRejectedOrders = (req, res) => fetchOrdersByStatus('rejected', res, 'rejected');
