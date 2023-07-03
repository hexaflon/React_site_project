const router = require("express").Router();
const { Post, validatePost, validateUpdate } = require("../models/post");

router.post("/create", async (req, res) => {
    try {
        const { error } = validatePost(req.body);
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }

        const post = new Post(req.body);
        await post.save();
        res.status(200).send(post);
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});
router.delete('/delete/:id', async (req, res) => {
    try {
        
        const post = await Post.findByIdAndRemove(req.params.id);

        if (!post) return res.status(404).send({ message: 'Post not found' });

        res.send({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal server error' });
    }
});
router.put('/update/:id', async (req, res) => {
    try {
        
        const { error } = validateUpdate(req.body);
        if (error) return res.status(400).send({ message: error.details[0].message });

        
        const post = await Post.findByIdAndUpdate(
            req.params.id,
            {
                content: req.body.content,
                date: req.body.date
            },
            { new: true }
        );
        console.log(post)
        if (!post) return res.status(404).send({ message: 'Post not found' });

        res.send(post);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal server error' });
    }
});
router.get("/read", async (req, res) => {
    try {
        const posts = await Post.find().sort("-date");
        //console.log(Date.now())
        res.status(200).send(posts);
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;
