const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const User = require('../../models/user');
const Post = require('../../models/post');

// @route   GET api/posts/:userId
// @desc    Get all posts by UserId
// @access  Private
router.get(
    '/:userId',
    auth,
    async (req, res) => {
        try {
            const posts = await Post.find({ user: req.params.userId }).sort({ date: -1 }); // sort date DESC
            res.json(posts);
        } catch (err) {
            // Check if user is invalid or not found
            if (err.kind === 'ObjectId')
                return res.status(400).json({ msg: 'No post found' });

            console.error(err.message);
            res.status(500).send('Server error');
        } // catch
}) // GET /api/posts/:userId

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post(
    '/',
    [
        auth,
        [
            check('text', 'Text is required').not().isEmpty()
        ], // checks
    ], // middlewares
    async (req, res) => {
        const errors = validationResult(req);
        if ( !errors.isEmpty() )
            return res.status(400).json({ errors: errors.array() });
        
        try {
            const user = await User.findById(req.user.id).select("-password");
    
            const post = new Post ({
                user: user.id,
                userName: user.name,
                userAvatar: user.avatar,
                text: req.body.text
            }) // newPost

            await post.save();

            res.json(post);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        } // catch
}) // POST api/posts 

// @route   POST api/posts/like/:postId
// @desc    Like a post
// @access  Private
router.post(
    '/like/:postId',
    auth,
    async (req, res) => {
        try {
            const post = await Post.findById(req.params.postId);

            // Check if post exists
            if (!post)
                return res.status(400).json({ msg: 'Post not found' });

            // Todo:
            // Not allow to like own post

            // Check if user already liked
            const alreadyLiked = post.likes.some(like => like.user.toString() === req.user.id);
            if (alreadyLiked)
                return res.status(400).json({ msg: 'Already liked' });

            post.likes = [ ...post.likes, {user: req.user.id} ];
            await post.save();

            res.json(post.likes);
        } catch(err) {
            // Check if postId is not valid
            if (err.kind === 'ObjectId')
                return res.status(400).json({ msg: 'Post not found '});

            console.error(err.message);
            res.status(500).send('Server error');
        } // catch
}) // POST api/posts/like/:postId

// @route   POST api/posts/unlike/:postId
// @desc    Unlike a post
// @access  Private
router.post(
    '/unlike/:postId',
    auth,
    async (req, res) => {
        try {
            const post = await Post.findById(req.params.postId);

            // Check if post exists
            if (!post)
                return res.status(400).json({ msg: 'Post not found' });

            post.likes = post.likes.filter(like => like.user.toString() !== req.user.id);
            await post.save();

            res.json(post.likes);
        } catch(err) {
            // Check if postId is not valid
            if (err.kind === 'ObjectId')
                return res.status(400).json({ msg: 'Post not found '});

            console.error(err.message);
            res.status(500).send('Server error');
        } // catch
}) // POST api/posts/unlike/:postId

// @route   POST api/posts/comment/:postId
// @desc    Comment a post
// @access  Private
router.post(
    '/comment/:postId',
    [
        auth,
        [
            check('text', 'Comment text is required').not().isEmpty()
        ] // checks
    ], // middlewares
    async (req, res) => {
        const errors = validationResult(req);
        if ( !errors.isEmpty() )
            return res.status(400).json({ errors: errors.array() });

        try {
            const post = await Post.findById(req.params.postId);

            // Check if post exists
            if (!post)
                return res.status(400).json({ msg: 'Post not found' });

            const comment = {
                user: req.user.id,
                text: req.body.text
            };
            post.comments = [ ...post.comments, comment ];
            await post.save();

            res.json(post.comments);
        } catch(err) {
            // Check if postId is not valid
            if (err.kind === 'ObjectId')
                return res.status(400).json({ msg: 'Post not found '});

            console.error(err.message);
            res.status(500).send('Server error');
        } // catch
}) // POST api/posts/comment/:postId

// @route   DELETE api/posts/:postId/comment/:commentId
// @desc    Delete comment by id
// @access  Private
router.delete(
    '/:postId/comment/:commentId',
    auth,
    async (req, res) => {
        try {
            const post = await Post.findById(req.params.postId);
            
            // Check if post exists
            if (!post)
                return res.status(400).json({ msg: 'No post found' });

            // Check if comment exists
            const comments = post.comments.filter(comment => comment.id === req.params.commentId);
            if (comments.length === 0)
                return res.status(400).json({ msg: 'Comment not found' });

            // Check if current user is the comment's owner
            const comment = comments[0];
            if (`${comment.user}` !== `${req.user.id}`) // Convert stuff to string
                return res.status(401).json({ msg: 'Unauthorized' });

            post.comments = post.comments.filter(comment => comment.id !== req.params.commentId);
            await post.save();

            res.send(post.comments);
        } catch (err) {
            // Check if post is invalid
            if (err.kind === 'ObjectId')
                return res.status(400).json({ msg: 'No post found' });

            console.error(err.message);
            res.status(500).send('Server error');
        } // catch
}) // DELETE api/posts/:postId/comment/:commentId

// @route   DELETE api/posts/:postId
// @desc    Delete post by id
// @access  Private
router.delete(
    '/:postId',
    auth,
    async (req, res) => {
        try {
            const post = await Post.findById(req.params.postId);
            
            // Check if post exists
            if (!post)
                return res.status(400).json({ msg: 'No post found' });

            // Check if current user is the post's owner
            if (`${post.user}` !== `${req.user.id}`) // Convert stuff to string
                return res.status(401).json({ msg: 'Unauthorized' });

            await Post.findByIdAndRemove(req.params.postId);

            res.send('Post deleted');
        } catch (err) {
            // Check if post is invalid
            if (err.kind === 'ObjectId')
                return res.status(400).json({ msg: 'No post found' });

            console.error(err.message);
            res.status(500).send('Server error');
        } // catch
}) // DELETE api/posts/:postId

module.exports = router;