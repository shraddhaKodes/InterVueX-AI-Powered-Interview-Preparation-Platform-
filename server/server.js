import app from "./app.js";
import { v2 as cloudinary } from "cloudinary";
import { initSocket } from "./src/realtime/socket.js";

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Start the Server (need HTTP server instance for Socket.IO)
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});

// Socket.IO
initSocket(server, app);
