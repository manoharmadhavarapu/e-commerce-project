const User = require('../models/userModel');
const asyncHandler = require('../middlewares/asyncHandler');
const bcrypt = require('bcryptjs');
const generatToken = require('../utils/createToken');


// create new user
const createUser = asyncHandler(async (req, res) => {

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        throw new Error("Please fill all the inputs")
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400).send("User alraedy exist with this email")
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({ username, email, password: hashedPassword });

    try {

        await newUser.save();
        generatToken(res, newUser._id);

        res.status(201).json({
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            isAdmin: newUser.isAdmin
        })

    } catch (error) {
        res.status(400)
        throw new Error("Invlaid user data")
    }
})


// login user
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);

        if (isPasswordValid) {
            generatToken(res, existingUser._id);

            return res.status(200).json({
                _id: existingUser._id,
                username: existingUser.username,
                email: existingUser.email,
                isAdmin: existingUser.isAdmin
            })
        }
    }

    throw new Error("Password incorrect or user not exists")
})


// logout user
const logoutCurrentUser = asyncHandler(async (req, res) => {

    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    })

    res.status(200).json({
        message: "Logged Out Successfully"
    })
})

// get all users --> admin route
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
})


// get current user 
const getCurrentUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
        })
    }
    else {
        res.status(404);
        throw new Error("User Not Found")
    }
})

// update current user 
const updateCurrentUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = bcrypt.hash(req.body.password, salt);
            user.password = hashedPassword
        }

        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin
        })
    }
    else {
        res.status(404);
        throw new Error("User Not Found");
    }
})

// delete user by id --> admin routes
const deleteUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        if (user.isAdmin) {
            res.status(400)
            throw new Error("Cannot delete admin user")
        }

        await User.deleteOne({ _id: user._id });
        res.status(204).json({
            message: "User Removed"
        })
    }
    else {
        res.status(404)
        throw new Error("User not found")
    }
})

// get user by id --> admin route
const getUserById = asyncHandler(async (req, res)=> {
    const user = await User.findById(req.params.id).select('-password');

    if(user) {
        res.status(200).json(user)
    }
    else {
        res.status(404)
        throw new Error("User not found")
    }
})

// update current user by id --> admin route
const updateUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if(user) {
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        user.isAdmin = Boolean(req.body.isAdmin);

        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin
        })
    }
    else {
        res.status(404)
        throw new Error("User not found")
    }
})

module.exports = {
    createUser,
    loginUser,
    logoutCurrentUser,
    getAllUsers,
    getCurrentUserProfile,
    updateCurrentUserProfile,
    deleteUserById,
    getUserById,
    updateUserById
}