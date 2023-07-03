const router = require("express").Router()
const { User, validate, validateUpdate} = require("../models/user")
const bcrypt = require("bcrypt")
router.post("/", async (req, res) => {
    try {
        const { error } = validate(req.body)
        if (error)
            return res.status(400).send({ message: error.details[0].message })
        const user = await User.findOne({ email: req.body.email })
        if (user)
            return res
                .status(409)
                .send({ message: "User with given email already Exist!" })
        const salt = await bcrypt.genSalt(Number(process.env.SALT))
        const hashPassword = await bcrypt.hash(req.body.password, salt)
        await new User({ ...req.body, password: hashPassword }).save()
        res.status(201).send({ message: "User created successfully" })
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" })
    }
})
router.put("/updateProfile", async (req, res) => {
    try {
        console.log(req.body)
        const { error } = validateUpdate(req.body);
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }

        const user = await User.findOne({"email":req.body.email})
        //console.log(user)
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;

        await user.save();

        res.send({ message: "Profile updated successfully" });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});
module.exports = router