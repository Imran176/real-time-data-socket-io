import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import os from "os-utils";

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3001",
  },
  transports: ["websocket", "polling"],
});

let currentTime;

io.on("connection", (socket) => {
  console.log("Some just connected!");

  if (currentTime) clearInterval(currentTime);

  setInterval(() => {
    socket.emit("time", new Date().getSeconds());
  }, 1000);

  let t = 0;
  setInterval(() => {
    // Every second, emit a 'chart' event to client
    os.cpuUsage((cpuPercent) => {
      socket.emit("chart", {
        name: t++,
        value: cpuPercent,
      });
    });
  }, 1000);
});

httpServer.listen(5000);
