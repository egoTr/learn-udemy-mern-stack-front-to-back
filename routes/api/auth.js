const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const config = require('config');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');

// @route   GET api/auth
// @desc    Test route
// @access  Public
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        
        res.json(user);
    } // try
    catch(err) {
        console.error(err.message);
        res.status(500).send('Server error')
    } // catch
}) // get api/auth

// @route   POST api/auth
// @desc    Login
// @access  Public
router.post(
    '/',
    [
        check('email', 'Invalid email').isEmail()
    ], // validator
    async (req, res) => {
        const errors = validationResult(req);
        
        if( !errors.isEmpty() ) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            // Check if user exists
            const userExisting = await User.findOne({ email });
            if (!userExisting) {
                return res.status(400).json({ errors: [{ msg: 'Invalid username or password'}] });
            } // if

            // check password
            const isMatch = await bcrypt.compare(password, userExisting.password);
            if (!isMatch) {
                return res.status(400).json({ errors: [{ msg: 'Invalid username or password'}] });
            } // if

            // return jsonwebtoken
            const payload = {
                user: {
                    id: userExisting.id
                }
            } // payload
            jwt.sign( 
                payload,
                config.get('jwtSecret'),
                { expiresIn: 360000 }, // 100 hours
                (err, token) => {
                    if (err) throw err;
                    res.json({ token })
                } // callBack
            ); // jwt.sign
        } // try
        catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        } // catch
    } // async (req, res)
) // POST api/auth

module.exports = router;