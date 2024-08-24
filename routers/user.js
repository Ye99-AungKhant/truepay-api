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

router.post('/verify', async (req, res) => {
    try {
        const { authUserId, idType, idNo, gender, dob, frontIDImg, backIDImg, country, city, postalCode } = req.body

        const checkUser = await prisma.user.findUnique({
            where: {
                id: authUserId,
            },
            update: {
                status: 'UnderVerified',
            },
        })
        const isValid = idType && idNo && gender && dob && frontIDImg && backIDImg && country && city && postalCode
        if (!isValid || !checkUser) return res.status(400).send("Bad request.")

        const userVerified = await prisma.userVerify.create({
            data: { user_id: checkUser, id_type: idType, id_no: idNo, gender: gender, dob: dob, front_id_url: frontIDImg, back_id_url: backIDImg, country: country, city: city, postal_code: postalCode }
        })
        res.status(200).json(userVerified)
    } catch (error) {
        res.status(500).json({ error });
    }
})

export { router as userRouter };