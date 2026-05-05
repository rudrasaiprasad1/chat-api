import express from "express";
import authRoutes from "./routes/auth.routes";
import notificationRoutes from "./routes/notification.routes";
import userRoutes from "./routes/user.routes";
import chatRoutes from "./routes/chat.routes";
import cors from "cors";
import { env } from "./config/env";

const app = express();



// const allowedOrigins = [
//     "http://localhost:5173",
//     "http://localhost:3000",
// ];



// app.use(
    //     cors({
        //         origin: (origin, callback) => {
//             // allow server-to-server / Postman / no-origin requests
//             if (!origin) return callback(null, true);

//             if (allowedOrigins.includes(origin)) {
//                 return callback(null, true);
//             }

//             return callback(new Error("Not allowed by CORS"));
//         },
//         credentials: true,
//     })
// );

const allowedOrigins = env.CORS_ORIGINS.split(",");
app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Blocked by CORS"));
            }
        },
        credentials: true,
    })
);

app.use(express.json());

app.use("/api/chat", chatRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/users", userRoutes);

export default app;