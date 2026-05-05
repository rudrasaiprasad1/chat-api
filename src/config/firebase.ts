import admin from "firebase-admin";
import serviceAccount from "./firebase-service-account.json";
import { messaging as AdminMessaging } from "firebase-admin";

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});


export const messaging: AdminMessaging.Messaging = admin.messaging();