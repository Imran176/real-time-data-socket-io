import React, { useState, useEffect } from "react";

import { io } from "socket.io-client";
import {
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Line,
} from "recharts";

const socket = io("http://localhost:5000", {
  transports: ["websocket", "polling"],
});

function App() {
  const [dateTime, setDateTime] = useState("");
  const [chartData, setchartData] = useState([]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket Connected Successfully!");
    });

    socket.on("time", (data) => {
      setDateTime(data);
    });

    socket.on("chart", (cData) => {
      // setchartData(cData);
      setchartData((currentData) => [...currentData, cData]);
    });
  }, []);

  return (
    <div className="App">
      <h1>Implementing Real Time Data using React + Socket.io</h1>
      <h2>
        {dateTime ? `Count Down: ${dateTime}` : "Waiting for socket connection"}
      </h2>
      <hr />
      <LineChart
        width={800}
        height={400}
        data={chartData}
        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
      >
        <XAxis dataKey="name" />
        <Tooltip />
        <CartesianGrid stroke="#f5f5f5" />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#ff7300"
          activeDot={{ r: 8 }}
          yAxisId={0}
        />
        {/* <Line
          type="monotone"
          dataKey="y"
          stroke="#82ca9d"
          activeDot={{ r: 8 }}
          yAxisId={1}
        /> */}
      </LineChart>
    </div>
  );
}

export default App;
