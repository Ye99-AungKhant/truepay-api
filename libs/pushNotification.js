import { Expo } from 'expo-server-sdk'
let expo = new Expo({
    accessToken: process.env.EXPO_ACCESS_TOKEN,
    useFcmV1: true
});

const handlePushTokens = ({ expoPushToken, transactionId }) => {
    console.log('expoPushToken of server', expoPushToken);

    const body = 'Received a new transaction'
    let notifications = [];
    if (!Expo.isExpoPushToken(expoPushToken)) {
        console.error(`Push token ${expoPushToken} is not a valid Expo push token`);
    }

    notifications.push({
        to: expoPushToken,
        sound: "default",
        title: 'True Pay',
        body: body,
        data: { transactionId }
    });

    let chunks = expo.chunkPushNotifications(notifications);
    let tickets = [];

    (async () => {
        for (let chunk of chunks) {
            try {
                let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                console.log(ticketChunk);
                tickets.push(...ticketChunk);
            } catch (error) {
                console.error(error);
            }
        }
    })();

    let receiptIds = [];
    for (let ticket of tickets) {
        if (ticket.status === 'ok') {
            receiptIds.push(ticket.id);
        }
    }

    let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);

    (async () => {
        for (let chunk of receiptIdChunks) {
            try {
                let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
                console.log(receipts);

                for (let receiptId in receipts) {
                    let { status, message, details } = receipts[receiptId];
                    if (status === 'ok') {
                        continue;
                    } else if (status === 'error') {
                        console.error(
                            `There was an error sending a notification: ${message}`
                        );
                        if (details && details.error) {
                            console.error(`The error code is ${details.error}`);
                        }
                    }
                }
            } catch (error) {
                console.error(error);
            }
        }
    })();

};

export default handlePushTokens