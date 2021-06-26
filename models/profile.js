const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    company: String,
    website: String,
    location: String,
    title: {
        type: String,
        required: true
    },
    skills: [String],
    bio: String,
    githubUsername: String,
    experiences: [
        {
            title: { 
                type: String,
                required: true
            }, // title
            company: String,
            location: String,
            from: {
                type: Date,
                required: true
            }, // from
            to: Date,
            current: Boolean,
            description: String
        }
    ], // experiences
    education: [
        {
            school: { 
                type: String,
                required: true
            }, // title
            degree: String,
            major: String,
            from: {
                type: Date,
                required: true
            }, // from
            to: Date,
            current: Boolean,
            description: String
        }
    ], // experiences
    socials: {
        youtube: String,
        twitter: String,
        facebook: String,
        linkedIn: String,
        instagram: String
    }, // social
    date: {
        type: Date,
        default: Date.now()
    } // date
})

module.exports = Profile = mongoose.model('profile', ProfileSchema);
