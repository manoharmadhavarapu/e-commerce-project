const Order = require('../models/orderModel');
const Product = require('../models/productModel');

const asyncHandler = require('../middlewares/asyncHandler');

// utility function
function calcPrices(orderItems) {
    const itemsPrice = orderItems.reduce((acc, item) => acc + item.price * item.qty, 0);

    const shippingPrice = itemsPrice > 100 ? 0 : 10;

    const taxRate = 0.15;
    const taxPrice = (itemsPrice * taxRate).toFixed(2);

    const totalPrice = (itemsPrice + shippingPrice + parseFloat(taxPrice)).toFixed(2);

    return {
        itemsPrice: itemsPrice.toFixed(2),
        shippingPrice: shippingPrice.toFixed(2),
        taxPrice,
        totalPrice,
    }
}

// create an order
const createOrder = async (req, res) => {

    try {
        const { orderItems, shippingAddress, paymentMethod } = req.body;

        if (orderItems && orderItems.length === 0) {
            res.status(400);
            throw new Error("No Order Items")
        }

        const itemsFromDB = await Product.find({
            _id: { $in: orderItems.map(x => x._id) }
        })

        const dbOrderItems = orderItems.map((itemFromClient) => {
            console.log('itemFromClient', itemFromClient);
            const matchingItemFromDB = itemsFromDB.find((itemFromDB) => itemFromDB._id.toString() === itemFromClient._id);

            if (!matchingItemFromDB) {
                res.status(404);
                throw new Error(`Product not found: ${itemFromClient._id}`)
            }

            return {
                ...itemFromClient,
                product: itemFromClient._id,
                price: matchingItemFromDB.price,
                _id: undefined,
            };
        });
        console.log('dbOrderItems', dbOrderItems)

        const { itemsPrice, taxPrice, shippingPrice, totalPrice } = calcPrices(dbOrderItems);

        const order = new Order({
            orderItems: dbOrderItems,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);

    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

// get all orders ---> admin route
const getAllOrders = async (req, res) => {

    try {

        const orders = await Order.find({}).populate('user', "id username");
        res.json(orders);

    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

//get user orders
const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        res.json(orders);

    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

// count total orders ---> admin route
const countTotalOrders = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        res.json({
            totalOrders
        })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

// calculate total sales ---> admin route
const calculateTotalSales = async (req, res) => {
    try {
        const orders = await Order.find();
        const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);
        res.json({
            totalSales
        })

    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

// calculate total sales by date ---> admin route
const calculateTotalSalesByDate = async (req, res) => {
    try {
        const salesByDate = await Order.aggregate([
            {
                $match: {
                    isPaid: true
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$paidAt' }
                    },
                    totalSales: {
                        $sum: '$totalPrice'
                    }
                }
            }
        ]);

        res.json(salesByDate);

    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}


// find order by id
const findOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'username email');

        if (order) {
            res.json(order);
        } else {
            res.status(404)
            throw new Error("Order not found");
        }

    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

// mark order as paid 
const markOrderAsPaid = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
                id: req.body.id,
                status: req.body.status,
                update_time: req.body.update_time,
                email_address: req.body.payer.email_address,
            }

            const upadteOrder = await order.save();
            return res.status(200).json(upadteOrder)

        } else {
            res.status(404)
            throw new Error("Order not found");
        }

    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

// mark order as delivered 
const markOrderAsDelivered = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.isDelivered = true;
            order.deliveredAt = Date.now();

            const updateOrder = await order.save();
            res.status(200).json(updateOrder);

        } else {
            res.status(404)
            throw new Error("Order not found");
        }

    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

module.exports = {
    createOrder,
    getAllOrders,
    getUserOrders,
    countTotalOrders,
    calculateTotalSales,
    calculateTotalSalesByDate,
    findOrderById,
    markOrderAsPaid,
    markOrderAsDelivered,
}
