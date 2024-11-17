const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const registerSchema = Joi.object({
    firstName: Joi.string().min(2).max(30).required(),
    userName: Joi.string().min(2).max(30).required(),
    lastName: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

const register = async (req, res) => {


    // validate user input
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });


    // check if email already exists

    try {
        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ error: 'Email already exists' });

    } catch (error) {
        res.status(500).json({ error: err.message });
    }


    // hash password 
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user 
    try {
        const createdUser = await User.create({ firstName, lastName, email,userName, password: hashedPassword })

        const token = jwt.sign({ id: createdUser._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });

        // create refresh token
        const refreshToken = jwt.sign({ id: createdUser._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

        // set cookies
        res.cookie('jwt', refreshToken, { httpOnly: true, scure: true, sameSite: 'None', maxAge: 7 * 24 * 60 * 60 * 1000 });


        res.status(200).json({ id: createdUser._id, email: createdUser.email, userName: createdUser.userName, token: token, refreshToken: refreshToken });

    } catch (error) {
        res.status(500).json({ error: err.message });
    }
}


const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

const login = async (req, res) => {


    // validate user input
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const foundUser = await User.findOne({ email });
        if (!foundUser) return res.status(400).json({ error: 'User not found' });


        const isMatch = await bcrypt.compare(password, foundUser.password);
        if (!isMatch) return res.status(400).json({ error: 'Wrong password' });


        const token = jwt.sign({ id: foundUser._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

        // create refresh token
        const refreshToken = jwt.sign({ id: foundUser._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

        // set cookies
        res.cookie('jwt', refreshToken, { httpOnly: true, scure: true, sameSite: 'None', maxAge: 7 * 24 * 60 * 60 * 1000 });

        res.status(200).json({ id: foundUser._id, email: foundUser.email, userName: foundUser.userName, token: token, refreshToken: refreshToken });

    } catch (error) {
        res.status(500).json({ error: err.message });
    }
}

const refreshToken = async (req, res) => {
    let refreshToken = req.cookies?.jwt || req.body.refreshToken;

    if (!refreshToken) return res.status(401).json({ error: 'Unauthorized' });

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
        if (err) return res.status(403).json({ error: 'Forbidden' });

        const foundUser = await User.findOne({ _id: decoded.id });
        if (!foundUser) return res.status(401).json({ error: 'Unauthorized' });

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decodedToken) => {

            if (err) return res.status(403).json({ error: 'Forbidden' });

            const newToken = jwt.sign({ id: foundUser._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
            const newRefreshToken = jwt.sign({ id: foundUser._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

            res.status(200).json({
                id: foundUser._id,
                email: foundUser.email,
                email: foundUser.userName,
                token: newToken,
                refreshToken: newRefreshToken
            });
        });
    });
}

const logout = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); // No content
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    res.json({ message: 'Cookie cleared' });
}

module.exports = {
    register,
    login,
    refreshToken,
    logout
}