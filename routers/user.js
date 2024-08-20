import express from "express";
import prisma from "../prisma.js";

const router = express.Router()

router.post('/user', async (req, res) => {
    try {
        const { name, phone, email, password } = req.body;
        const isValid = name && phone && email && password

        if (!isValid) return res.status(400).send("Bad request.");

        const user = await prisma.user.create({
            data: { name, phone, email, password },
        });

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error });
    }
})

export { router as userRouter };