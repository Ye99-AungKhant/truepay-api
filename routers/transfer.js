import express from "express";
import jwt from "jsonwebtoken"
import prisma from "../libs/prisma.js";

const router = express.Router()

router.get('/check/:phone', async (req, res) => {
    try {
        const { phone } = req.params
        const transfercheck = await prisma.user.findFirst({
            where: { phone },
            select: { id: true, name: true, phone: true, profile_url: true }
        })
        console.log(transfercheck);
        if (transfercheck) {
            res.status(200).json(transfercheck)
        } else {
            res.status(400).json({ message: 'This number is not registered' })
        }
    } catch (error) {
        res.status(500).json({ error });
    }
})

export { router as transferRouter };