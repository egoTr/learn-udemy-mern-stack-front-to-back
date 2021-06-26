const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/profile');
const { check, validationResult } = require('express-validator');

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);

        if (!profile)
            return res.status(400).json({ msg: 'Profile not found' });
        
        res.json(profile);
    } // try
    catch(err) {
        console.error(err.message);
        res.status(500).send('Server error');
    } // catch
}) // GET api/profile/me

// @route   GET api/profile/:userId
// @desc    Get profile by userId
// @access  Public
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        const profile = await Profile.findOne({ user: userId }).populate('user', ['name', 'avatar']);
        if (!profile)
            return res.status(400).json({ msg: 'Profile not found' });

        res.json(profile);
    } // try
    catch (err) {
        // Check if user's id is invalid or not found
        if (err.kind === 'ObjectId')
            return res.status(400).json({ msg: 'Profile not found' });

        console.error(err.message);
        res.status(500).send('Server error');
    } // catch
}) // GET api/profile/:userId

// @route   GET api/profile
// @desc    Get all profiles
// @access  Public
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } // try
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    } // catch
}) // GET api/profile

// @route   POST api/profile
// @desc    Create / update user's profile
// @access  Private
router.post(
    '/',
    [
        auth,
        [
            check('title', 'Title is required').not().isEmpty(),
            check('skills', 'Skills is required').not().isEmpty()
        ] // checks
    ], // middlewares
    async (req, res) => {
        const errors = validationResult(req);
        if  (!errors.isEmpty() )
            return res.status(400).json({ errors: errors.array() });

        // create profile
        const {
            company,
            website,
            location,
            bio,
            title,
            githubUsername,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedIn
        } = req.body;
        
        const profileFields = {};

        // social stuff
        const socials = {};
        if (youtube) socials.youtube = youtube;
        if (facebook) socials.youtube = facebook;
        if (twitter) socials.youtube = twitter;
        if (instagram) socials.youtube = instagram;
        if (linkedIn) socials.youtube = linkedIn;
        profileFields.socials = socials;

        // other stuff
        profileFields.user = req.user.id;
        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;
        if (title) profileFields.title = title;
        if (githubUsername) profileFields.githubUsername = githubUsername;
        if (skills)
            profileFields.skills = skills.split(',').map( skill => skill.trim() );

        try {
            let profile = await Profile.findOne({ user: req.user.id });

            // Update existing profile
            if (profile) {
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields },
                    { new: true }
                ) // findOneAndUpdate
            
                return res.json(profile);
            } // if

            // Create new profile
            profile = new Profile(profileFields);
            await profile.save();

            return res.json(profile);
        } // try
        catch(err) {
            console.error(err.message);
            res.status(500).send('Server error');
        } // catch

        res.send(profile);        
}) // POST api/profile

// @route   POST api/profile/experience
// @desc    Add experience
// @access  Private
router.post(
    '/experience',
    [
        auth,
        [
            check('title', 'Title is required').not().isEmpty(),
            check('company', 'Company is required').not().isEmpty(),
            check('from', 'From date is required').not().isEmpty()
        ] // checks
    ] // middlewares
    ,
    async (req, res) => {
        const errors = validationResult(req);
        if ( !errors.isEmpty() )
            return res.status(400).json({ errors: errors.array() });
           
        const newExp = req.body;

        try {
            const profile = await Profile.findOne({ user: req.user.id });
            profile.experiences = [...profile.experiences, newExp];
            await profile.save();

            res.json(profile);
        } // try
        catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        } // catch
}) // POST api/profile/experience

// @route   DELETE api/profile/experience/:exId
// @desc    Remove experience by Id
// @access  Private
router.delete('/experience/:exId', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        profile.experiences = profile.experiences.filter(ex => ex.id !== req.params.exId);
        await profile.save();

        res.json(profile);
    } catch (err) {
        // Check if experienceId is invalid or not found
        if (err.kind === 'ObjectId')
            return res.status(400).json({ msg: 'Experience not found '});

        console.error(err.message);
        res.status(500).send('Server error');
    } // catch
}) // DELETE api/profile/experience/:exId

module.exports = router;