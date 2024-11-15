const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const asyncHandler = require('./asyncHandler');

const authenticate = asyncHandler(async (req, res, next) => {
    let token;

    // read jwt from the 'jwt' cookie
    token = req.cookies.jwt;

    if (token) {
        try {

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.userId).select('-password');
            next();

        } catch (error) {
            res.status(401)
            throw new Error("Not authorized, token failed.")
        }
    }
    else {
        res.status(401)
        throw new Error("Not authorized, token failed.")
    }
})

//  check for the admin
const authorizeAdmin = (req, res, next) => {

    if(req.user && req.user?.isAdmin) {
        return next();
    }
    res.status(401).send("Not authorized as admin")

}

module.exports = {authenticate, authorizeAdmin}