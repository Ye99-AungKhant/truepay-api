import express from "express";
import jwt from "jsonwebtoken"
import prisma from "../libs/prisma";

const router = express.Router()

router.post('/register', async (req, res) => {
    try {
        console.log(req.body);

        const { name, phone, email, password } = req.body;
        const isValid = name && phone && email && password

        if (!isValid) return res.status(400).send("Bad request.");

        const user = await prisma.user.create({
            data: { name, phone, email, password },
        });

        const secret = "s!c#1$G9";
        const token = jwt.sign(user, secret);

        res.status(200).json(token);
    } catch (error) {
        res.status(500).json({ error });
    }
})

export { router as userRouter };