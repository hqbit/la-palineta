import express from "express";
import * as http from "http";
import * as WebSocket from "ws";
import { Request, Response } from "express";
import path from "path";

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname + "/../frontend/index.html"));
});

const publicDirectoryPath = path.join(__dirname, "/../frontend");
app.use(express.static(publicDirectoryPath));

app.listen(5000, () => {
  console.log("Application started on port 5000!");
});

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws: WebSocket) => {
  //connection is up, let's add a simple simple event
  ws.on("message", (message: string) => {
    //log the received message and send it back to the client
    console.log("received: %s", message);
    ws.send(`Hello, you sent -> ${message}`);
  });

  //send immediatly a feedback to the incoming connection
  ws.send("Hi there, I am a WebSocket server");
});

//start our server
server.listen(process.env.PORT || 8999, () => {
  console.log(
    `Server started on port ${
      (server.address() as WebSocket.AddressInfo).port
    } :)`
  );
});
