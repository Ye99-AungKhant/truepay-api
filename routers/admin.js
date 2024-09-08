import express from "express";
import jwt from "jsonwebtoken"
import prisma from "../libs/prisma.js";

const router = express.Router()
const perPage = 10

router.get('/user', async (req, res) => {
    const currentPage = Math.max(Number(req.query.page) || 1, 1)

    const users = await prisma.user.findMany({
        skip: (currentPage - 1) * perPage,
        take: perPage,
        include: { userverify: true }
    })

    const totalCount = await prisma.user.count();

    const totalPages = Math.ceil(totalCount / perPage);
    res.status(200).json({ users, totalPages })
})

router.get('/', async (req, res) => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date()

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const totalUser = await prisma.user.count();
    const totalTransactionForMonth = await prisma.userTransaction.aggregate({
        _sum: {
            amount: true,
        },
        where: {
            createdAt: {
                gte: startOfMonth,
                lte: now,
            },
        },
    })
    const pendingUser = await prisma.user.findMany({
        where: { status: 'Pending' },
        include: { userverify: true }
    })

    const todayTransactions = await prisma.userTransaction.findMany({
        where: {
            createdAt: {
                gte: startOfToday,
                lte: endOfToday,
            },
        },
    });

    const hourlyTransactions = todayTransactions.reduce((acc, transaction) => {
        const hour = new Date(transaction.createdAt).getHours();
        if (!acc[hour]) {
            acc[hour] = { totalAmount: 0, count: 0 };
        }
        acc[hour].totalAmount += transaction.amount;
        acc[hour].count += 1;
        return acc;
    }, {});

    const todayAverageTransactionForChart = Object.keys(hourlyTransactions).map(hour => ({
        hour: parseInt(hour),
        averageAmount: hourlyTransactions[hour].totalAmount / hourlyTransactions[hour].count,
    }));

    let monthlyTransactions = [];
    const currentYear = now.getFullYear();

    for (let i = 0; i < 12; i++) {
        const startOfMonth = new Date(currentYear, i, 1);
        const endOfMonth = new Date(currentYear, i + 1, 0); // last day of the month

        // Get transaction sum for each month
        const totalTransactionForMonth = await prisma.userTransaction.aggregate({
            _sum: {
                amount: true,
            },
            where: {
                createdAt: {
                    gte: startOfMonth,
                    lte: endOfMonth,
                },
            },
        });

        // Store the result in an array
        monthlyTransactions.push({
            month: startOfMonth.toLocaleString('default', { month: 'short' }), // Month name
            year: startOfMonth.getFullYear(),
            totalAmount: totalTransactionForMonth._sum.amount || 0, // Handle null sums
        });
    }

    const totalTodayTransactions = todayTransactions.length
    const totalPendingUser = pendingUser.length

    res.status(200).json({ totalUser, totalTransactionForMonth, totalPendingUser, pendingUser, totalTodayTransactions, todayAverageTransactionForChart, monthlyTransactions })
})

router.get('/transactions', async (req, res) => {
    const currentPage = Math.max(Number(req.query.page) || 1, 1)
    const transaction = await prisma.userTransaction.findMany({
        skip: (currentPage - 1) * perPage,
        take: perPage,
        include: {
            sender: {
                select: {
                    name: true,
                    phone: true
                },
            },
            recipient: {
                select: {
                    name: true,
                    phone: true
                },
            }
        },
    })

    const totalCount = await prisma.userTransaction.count()

    const totalPages = Math.ceil(totalCount / perPage);
    res.status(200).json({ transaction, totalPages })
})

router.get('/userdetail/:userId', async (req, res) => {
    const userId = req.params.userId

    const currentPage = Math.max(Number(req.query.page) || 1, 1)

    const transaction = await prisma.userTransaction.findMany({
        skip: (currentPage - 1) * perPage,
        take: perPage,
        where: {
            OR: [
                { sender_user_id: Number(userId) },
                { recipient_user_id: Number(userId) },
            ]
        },
        include: {
            sender: {
                select: {
                    name: true,
                    phone: true
                },
            },
            recipient: {
                select: {
                    name: true,
                    phone: true
                },
            }
        },
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
    res.status(200).json({ transaction, totalPages })
})

router.patch('/userVerify', async (req, res) => {
    console.log('userVerify', req.body);

    const { userId } = req.body
    const user = await prisma.user.update({
        where: { id: userId },
        data: { status: 'Verified' }
    })
    res.status(200).json(user)
})


export { router as adminRouter };