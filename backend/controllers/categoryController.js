const asyncHandler = require('../middlewares/asyncHandler');
const Category = require('../models/categoryModel');


// create a category --> admin route
const createCategory = asyncHandler(async (req, res) => {
    try {

        const { name } = req.body;

        if (!name?.trim()) {
            return res.json({
                error: "Name is required"
            })
        }

        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.json({
                error: "Already exists"
            })
        }

        const category = await new Category({ name }).save()
        res.json(category)

    } catch (error) {
        // console.log(err);
        res.status(400).json(error)
    }
})


// update category --> admin route
const updateCategory = asyncHandler(async (req, res) => {
    try {
        const { name } = req.body;
        const { categoryId } = req.params;

        const category = await Category.findOne({ _id: categoryId });

        if (!category) {
            return res.status(404).json({
                error: "Category not found"
            })
        }

        category.name = name;

        const updatedCategory = await category.save();
        res.json(updatedCategory);

    } catch (error) {
        // console.log(error);
        res.status(500).json({ error: "Internal Server Error" })
    }
})


// delete category --> admin route
const deleteCategory = asyncHandler(async (req, res) => {
    try {
        const { categoryId } = req.params;
        const deleteCategory = await Category.findByIdAndDelete(categoryId);

        if (!deleteCategory) {
            return res.status(404).json({
                error: "Id not found to delete"
            })
        }

        res.json(deleteCategory);

    } catch (error) {
        // console.log(error);
        res.status(500).json({ error: "Internal Server Error" })
    }
})


// get all categories
const listCategory = asyncHandler(async (req, res) => {
    try {
        const all = await Category.find({});
        res.status(200).json(all);
    } catch (error) {
        // console.log(error);
        res.status(400).json(error.message)
    }
})


// read category by id
const readCategory = asyncHandler(async (req, res)=> {
    try {
        const category = await Category.findOne({_id: req.params.categoryId});
        // console.log('category', category)
        if(!category) {
            return res.status(404).json({
                error: "Category not found"
            })
        }

        res.status(200).json(category);
        
    } catch (error) {
        // console.log(error);
        res.status(400).json(error.message)
    }
})

module.exports = {
    createCategory,
    updateCategory,
    deleteCategory,
    listCategory,
    readCategory
}