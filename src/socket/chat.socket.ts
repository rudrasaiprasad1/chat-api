import { Server, Socket } from "socket.io";

export const initChatSocket = (io: Server) => {
    io.on("connection", (socket: Socket) => {
        console.log("User connected:", socket.id);

        socket.on("join-room", (roomId: string) => {
            socket.join(roomId);
        });

        socket.on("send-message", (data) => {
            io.to(data.roomId).emit("receive-message", data);
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
};