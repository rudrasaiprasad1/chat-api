import { messaging } from "../config/firebase";

export const sendPushNotification = async (
  token: string,
  title: string,
  body: string
) => {
  const message = {
    notification: { title, body },
    token,
    android: {
      priority: "high",
    },
    apns: {
      headers: {
        "apns-priority": "10",
      },
    },
    webpush: {
      notification: {
        title,
        body,
        icon: "/firebase-logo.png",
      },
      fcmOptions: {
        link: "/chat",
      },
    },
    data: {
      title,
      body,
    },
  };

  return await messaging.send(message as any);
};

export const sendPushNotificationToTokens = async (
  tokens: string[],
  title: string,
  body: string
) => {
  const results = await Promise.all(
    tokens.map(async (token) => {
      try {
        const response = await sendPushNotification(token, title, body);
        return { success: true, response };
      } catch (error: any) {
        return { success: false, error };
      }
    })
  );

  const successCount = results.filter((item) => item.success).length;
  const failureCount = results.filter((item) => !item.success).length;

  return {
    successCount,
    failureCount,
    results,
  };
};