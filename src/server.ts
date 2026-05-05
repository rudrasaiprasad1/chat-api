// import app from "./app";
// import { env } from "./config/env";
// const allowedOrigins = env.CORS_ORIGINS.split(",");
// const PORT = env.PORT;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${allowedOrigins[0]}`);
// });

import http from "http";
import app from "./app";
import { env } from "./config/env";
import { Server } from "socket.io";
import { initChatSocket } from "./socket/chat.socket";
const allowedOrigins = env.CORS_ORIGINS.split(",");
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      allowedOrigins[1]!,
    ],
    credentials: true,
  },
});

initChatSocket(io);

server.listen(env.PORT, () => {
  console.log(`Server running on http://localhost:${env.PORT}`);
});