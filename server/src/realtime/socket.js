import { Server as IOServer } from "socket.io";
import jwt from "jsonwebtoken";

// Attach Socket.IO to an existing HTTP/S Express server.
// Usage: initSocket(server) in server bootstrap.
export const initSocket = (httpServer, expressApp) => {
  const io = new IOServer(httpServer, {
    cors: {
      origin:
        process.env.CLIENT_URL,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    },
  });

  // Expose globally so controllers/services can emit without plumbing through imports.
  globalThis.__io = io;

  // Optional: also attach to app for cleaner access
  if (expressApp) {
    expressApp.set("io", io);
  }

  // room mapping: userId -> socket room
  // client should send auth token: localStorage.getItem('intervuex_token')
 io.use((socket, next) => {
  try {
    const token = socket?.handshake?.auth?.token;


    if (!token) return next();

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY
    );


    socket.data.user = decoded;

    next();
  } catch (e) {
    next();
  }
});

  io.on("connection", (socket) => {
    const userId = socket?.data?.user?.id || socket?.data?.user?._id;
    if (userId) socket.join(String(userId));

    socket.on("disconnect", () => {
      // no-op
    });
  });

  // Helper for server-side emissions
  io.safeToUser = (userId, event, payload) => {
    if (!userId) return;
    io.to(String(userId)).emit(event, payload);
  };

  return io;
};
