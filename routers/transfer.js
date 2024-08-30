import express from "express";
import jwt from "jsonwebtoken"
import prisma from "../libs/prisma.js";

const router = express.Router()
function generateUniqueCode() {
    // Get current timestamp
    const timestamp = new Date().getTime().toString().substring(0, 12);

    return timestamp;
}


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

router.post('/', async (req, res) => {
    try {
        const { password, senderId, recipientId, amount, note } = req.body
        console.log(req.body);
        const senderIdInt = parseInt(senderId)
        const recipientIdInt = parseInt(recipientId)
        const amountInt = parseInt(amount)
        console.log('trans', senderIdInt, recipientIdInt, amountInt);

        const passwordCheck = await prisma.user.findFirst({
            where: {
                id: { equals: senderIdInt },
                password: { equals: password }
            }
        })

        if (!passwordCheck) {
            return res.status(400).json({ message: 'Your password is not match. Please try again.' })
        }

        const [sender, recipient] = await prisma.$transaction([
            prisma.user.findFirst({
                where: { id: senderIdInt },
                select: { id: true, balance: true }
            }),
            prisma.user.findFirst({
                where: { id: recipientIdInt },
                select: { id: true, balance: true }
            })
        ])
        console.log('sender', sender);
        console.log('recipient', recipient);

        if (sender.balance >= amountInt) {
            let uuid = generateUniqueCode()
            const senderBalanceUpdate = sender.balance - amountInt
            const recipientBalanceUpdate = recipient.balance + amountInt

            const [createTransaction, updateSender, updateRecipient] = await prisma.$transaction([
                prisma.userTransaction.create({
                    data: {
                        transactionId: uuid,
                        sender_user_id: senderIdInt,
                        recipient_user_id: recipientIdInt,
                        amount: amountInt,
                        note: note
                    }
                }),
                prisma.user.update({
                    where: { id: senderIdInt },
                    data: { balance: senderBalanceUpdate }
                }),
                prisma.user.update({
                    where: { id: recipientIdInt },
                    data: { balance: recipientBalanceUpdate }
                }),
            ])

            return res.status(200).json(createTransaction)
        }
        return res.status(400).json({ message: 'Your balance is insufficient.' })

    } catch (error) {
        res.status(500).json({ error });
    }
})

router.get('/history/:id', async (req, res) => {
    try {
        const { id } = req.params
        const transactions = await prisma.userTransaction.findMany({
            where: {
                OR: [
                    { sender_user_id: parseInt(id) },
                    { recipient_user_id: parseInt(id) },
                ]
            },
            include: {
                sender: {
                    select: {
                        name: true,
                    },
                },
                recipient: {
                    select: {
                        name: true,
                    },
                }
            },
            orderBy: [
                { createdAt: 'asc' }
            ]
        })

        res.status(200).json(transactions)
    } catch (error) {
        res.status(500).json({ error });
    }
})

router.get('/transaction-id/:transaction_id', async (req, res) => {
    try {
        const { transaction_id } = req.params
        const transaction = await prisma.userTransaction.findFirst({
            where: { transactionId: transaction_id }
        })

        res.status(200).json(transaction)
    } catch (error) {
        res.status(500).json({ error });
    }
})

export { router as transferRouter };