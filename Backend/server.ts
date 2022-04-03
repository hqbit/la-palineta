import express from "express";
import * as http from "http";
import * as WebSocket from "ws";
import { Request, Response } from "express";
import path from "path";

enum typeEnum {
  START = 0,
  STARTRESPONSE = 1,
  MOVEMENT = 2,
  MOVEMENTRESPONSE = 3,
  OPENRESPONSE = 4,
}

enum fingerEvents {
  L1UP,
  L2UP,
  L3UP,
  L4UP,
  L5UP,
  L1DOWN,
  L2DOWN,
  L3DOWN,
  L4DOWN,
  L5DOWN,
  R1UP,
  R2UP,
  R3UP,
  R4UP,
  R5UP,
  R1DOWN,
  R2DOWN,
  R3DOWN,
  R4DOWN,
  R5DOWN,
}

interface IPos {
  x: number;
  y: number;
}

interface IMessage {
  id: number;
  message: any;
  type: typeEnum;
}

interface IHands {
  leftHandFingers: boolean[];
  leftHandStates: number[];
  leftHandPos: IPos;
  rightHandFingers: boolean[];
  rightHandStates: number[];
  rightHandPos: IPos;
}

interface IUser {
  id: number;
  connection: WebSocket;
  hands: IHands;
  playing: boolean;
}

const users: Array<IUser> = [];

let currentIdCount = 0;

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
  addUser(ws);

  ws.on("message", (message: string) => {
    //log the received message and send it back to the client

    const msg = JSON.parse(message) as IMessage;

    console.log("received: %s", message);

    switch (msg.type) {
      case typeEnum.START:
        break;

      case typeEnum.MOVEMENT:
        sendMovement(msg);
        break;
      default:
        break;
    }
  });
});

//start our server
server.listen(process.env.PORT || 8999, () => {
  console.log(
    `Server started on port ${
      (server.address() as WebSocket.AddressInfo).port
    } :)`
  );
});

function addUser(ws: WebSocket) {
  const id = generateId();
  let user: IUser = {
    id,
    connection: ws,
    hands: {
      leftHandFingers: [true, true, true, true, true],
      leftHandStates: [],
      leftHandPos: {
        x: null,
        y: null,
      },
      rightHandFingers: [true, true, true, true, true],
      rightHandStates: [],
      rightHandPos: {
        x: null,
        y: null,
      },
    },
    playing: false,
  };

  if (users.length <= 2) {
    user.playing = true;
  }

  users.concat(user);
  const response: IMessage = {
    type: typeEnum.OPENRESPONSE,
    message: { playing: user.playing, id: user.id },
    id: null,
  };

  user.connection.send(JSON.stringify(response));
}

function sendMovement(msg: IMessage) {
  const targetUser = users
    .filter((x) => x.playing === true)
    .find((x) => x.id !== msg.id);

  console.log(users.filter((x) => x.playing === true));
  if (targetUser) {
    targetUser.id = 99999;

    console.log(users);
    // users.find(x => x.id === msg.id) = null;

    const response: IMessage = {
      type: typeEnum.MOVEMENTRESPONSE,
      message: msg?.message?.hands,
      id: targetUser.id,
    };
    console.log("sending: %s", response);
    broadcast(response);
    // targetUser.connection.send(JSON.stringify(response));
  }
}

function broadcast(msg: IMessage) {
  users.forEach((user) => {
    user.connection.send(JSON.stringify(msg));
  });
}

function generateId(): number {
  currentIdCount += 1;
  return currentIdCount;
}
