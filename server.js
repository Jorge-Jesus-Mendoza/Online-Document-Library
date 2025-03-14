import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import onCall from './socketEvents/onCall.js'
import onWebRtcSignal from './socketEvents/onWebRtcSignal.js'


const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

export let io

app.prepare().then(() => {
  const httpServer = createServer(handler);

  io = new Server(httpServer);
  let onlineUsers = []

  io.on("connection", (socket) => {
    // add user
    socket.on('addNewUser', (newUser) => {
      newUser && !onlineUsers.some(user => user?.id === newUser?.id) && onlineUsers.push({
        id: newUser?.id,
        socketId: socket.id,
        profile: newUser.profile
      })
      io.emit("getUsers", onlineUsers)
    })

    socket.on('disconnect', () => {
      onlineUsers = onlineUsers.filter(user => user?.socketId !== socket.id); // ✅ Ahora sí se actualiza correctamente
      io.emit("getUsers", onlineUsers);
    });

    
    // call events
    socket.on('call', (participants) => onCall(participants));
    socket.on('webrtcSignal', onWebRtcSignal);

    // socket.on('call', onCall)

  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
