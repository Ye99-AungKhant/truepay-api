import express from "express";
import jwt from "jsonwebtoken"
import prisma from "../libs/prisma.js";

const router = express.Router()
const perPage = 10

router.get('/user', async (req, res) => {
    const currentPage = Math.max(Number(req.query.page) || 1, 1)

    const users = await prisma.user.findMany({
        skip: (currentPage - 1) * perPage,
        take: perPage
    })

    const totalCount = await prisma.user.count();

    const totalPages = Math.ceil(totalCount / perPage);
    res.status(200).json({ users, totalPages })
})

router.get('/userdetail/:userId', async (req, res) => {
    const userId = req.params.userId

    const currentPage = Math.max(Number(req.query.page) || 1, 1)

    const users = await prisma.user.findFirst({
        where: { id: Number(userId) }
    })

    const transaction = await prisma.userTransaction.findMany({
        skip: (currentPage - 1) * perPage,
        take: perPage,
        where: {
            OR: [
                { sender_user_id: Number(userId) },
                { recipient_user_id: Number(userId) },
            ]
        }
    })

    const totalTransaction = await prisma.userTransaction.findMany({
        where: {
            OR: [
                { sender_user_id: Number(userId) },
                { recipient_user_id: Number(userId) },
            ]
        }
    });

    const totalCount = totalTransaction.length

    const totalPages = Math.ceil(totalCount / perPage);
    res.status(200).json({ users, transaction, totalPages })
})


export { router as adminRouter };