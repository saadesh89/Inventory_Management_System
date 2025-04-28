const express = require('express');
const router = express.Router();

const { getAllProducts, createProduct } = require('../controllers/productController');
const { protect } = require('../middlewares/authMiddleware');
const { allowRoles } = require('../middlewares/roleMiddleware');

router.get('/', getAllProducts);
router.post('/', protect, allowRoles('admin'), createProduct);


module.exports = router;
