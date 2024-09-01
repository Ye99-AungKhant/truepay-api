import { Expo } from 'expo-server-sdk'
let expo = new Expo();

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

    (async () => {
        for (let chunk of chunks) {
            try {
                let receipts = await expo.sendPushNotificationsAsync(chunk);
                console.log(receipts);
            } catch (error) {
                console.error(error);
            }
        }
    })();
};

export default handlePushTokens