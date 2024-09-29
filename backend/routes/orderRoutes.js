const express = require('express');
const { authenticate, authorizeAdmin } = require('../middlewares/authMiddleware');
const { createOrder, getAllOrders, getUserOrders, countTotalOrders, calculateTotalSales, calculateTotalSalesByDate, findOrderById, markOrderAsPaid, markOrderAsDelivered } = require('../controllers/orderController');

const router = express.Router();

router.route('/')
    .post(authenticate, createOrder)
    .get(authenticate, authorizeAdmin, getAllOrders)

router.route('/mine')
    .get(authenticate, getUserOrders)

router.route('/total-orders').get(authenticate, authorizeAdmin, countTotalOrders)
router.route('/total-sales').get(authenticate, authorizeAdmin, calculateTotalSales)
router.route('/total-sales-by-date').get(authenticate, authorizeAdmin, calculateTotalSalesByDate)
router.route('/:id').get(authenticate, findOrderById);
router.route('/:id/pay').put(authenticate, markOrderAsPaid);
router.route('/:id/deliver').put(authenticate, authorizeAdmin, markOrderAsDelivered);

module.exports = router;