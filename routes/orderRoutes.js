const express = require('express');
const router = express.Router();
const {
  placeOrder,
  getMyOrders,
  getAllOrders,
  processOrder,
  getPendingOrders,
  getApprovedOrders,
  getRejectedOrders
} = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');
const { allowRoles } = require('../middlewares/roleMiddleware');

// Any logged-in user can place an order and view their orders
router.post('/', protect, placeOrder);
router.get('/my-order', protect, getMyOrders);

// Admin-only access for the following
router.get('/', protect, allowRoles('admin'), getAllOrders);
router.put('/', protect, allowRoles('admin'), processOrder);

// Admin-only access for All order status routes
router.get('/pending-order', protect, allowRoles('admin'), getPendingOrders);
router.get('/approved-order', protect, allowRoles('admin'), getApprovedOrders);
router.get('/rejected-order', protect, allowRoles('admin'), getRejectedOrders);


module.exports = router;
 