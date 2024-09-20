const express = require('express');
const { authenticate, authorizeAdmin } = require('../middlewares/authMiddleware');
const { createCategory, updateCategory, deleteCategory, listCategory, readCategory } = require('../controllers/categoryController')

const router = express.Router();

router.route('/').post(authenticate, authorizeAdmin, createCategory);

router.route('/categories').get(listCategory)

router.route('/:categoryId')
    .put(authenticate, authorizeAdmin, updateCategory)
    .delete(authenticate, authorizeAdmin, deleteCategory)
    .get(readCategory)
    


module.exports = router;
