import express from "express";
import jwt from "jsonwebtoken"
import prisma from "../libs/prisma.js";

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

router.post('/login', async (req, res) => {
    try {
        console.log(req.body);

        const { email, password } = req.body;
        const isValid = email && password

        if (!isValid) return res.status(400).send("Bad request.");

        const user = await prisma.user.findFirst({
            where: { email }
        });

        const secret = "s!c#1$G9";
        const token = jwt.sign(user, secret);

        res.status(200).json(token);
    } catch (error) {
        res.status(500).json({ error });
    }
})

router.post('/verify', async (req, res) => {

    // let dob = '12-4-2000', frontIDImg = 'file.png', backIDImg = 'file.png'
    // console.log(req.body);

    try {

        const { authUserId, idType, idNo, dob, gender, country, city, postalCode, frontIDImg, backIDImg } = req.body
        const isValid = authUserId && idType && idNo && gender && dob && frontIDImg && backIDImg && country && city && postalCode
        if (!isValid) return res.status(400).send("Bad request.")

        const checkUser = await prisma.user.update({
            where: {
                id: authUserId,
            },
            data: {
                status: 'Unverified',
            },
        })
        console.log('checkUser', checkUser);

        const userVerified = await prisma.userVerify.create({
            data: { user_id: checkUser.id, id_type: idType, id_no: idNo, gender: gender, dob: dob, front_id_url: frontIDImg, back_id_url: backIDImg, country: country, city: city, postal_code: parseInt(postalCode), address: 'a' }
        })

        console.log('userVerified', userVerified);

        res.status(200).json(userVerified)
    } catch (error) {
        res.status(500).json({ error });
    }
})

router.get('/profile/:id', async (req, res) => {
    try {
        const { id } = req.params
        const profileData = await prisma.user.findFirst({
            where: { id: parseInt(id) },
            include: { userverify: true }
        })
        console.log(profileData);

        res.status(200).json(profileData)
    } catch (error) {
        res.status(500).json({ error });
    }
})

router.patch('/profile', async (req, res) => {
    console.log(req.body);

    try {
        const { id, profile_url } = req.body
        const profileData = await prisma.user.update({
            where: { id },
            data: { profile_url },
        })
        console.log(profileData);

        res.status(200).json(profileData)

    } catch (error) {
        res.status(500).json({ error });
    }
})

export { router as userRouter };