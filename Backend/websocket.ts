import express from "express";
import * as http from "http";
import * as WebSocket from "ws";

enum typeEnum {
  START = 0,
  STARTRESPONSE = 1,
  MOVEMENT = 2,
  MOVEMENTRESPONSE = 3,
  OPENRESPONSE = 4,
  CLOSE = 5,
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
  leftHandPos: IPos;
  rightHandFingers: boolean[];
  rightHandPos: IPos;
  events: string[];
}

interface IUser {
  id: number;
  connection: WebSocket;
  hands: IHands;
  playing: boolean;
}

let users: Array<IUser> = [];

let currentIdCount = 0;

const app = express();

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

    // console.log("received: %s", message);

    switch (msg.type) {
      case typeEnum.START:
        break;

      case typeEnum.MOVEMENT:
        sendMovement(msg);
        break;

      case typeEnum.CLOSE:
        deleteUser(msg);
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
      leftHandFingers: [false, true, true, true, true],
      leftHandPos: {
        x: null,
        y: null,
      },
      rightHandFingers: [false, true, true, true, true],
      rightHandPos: {
        x: null,
        y: null,
      },
      events: [],
    },
    playing: false,
  };

  if (users.length <= 2) {
    user.playing = true;
  }

  users.push(user);
  const response: IMessage = {
    type: typeEnum.OPENRESPONSE,
    message: { playing: user.playing, id: user.id },
    id: null,
  };

  user.connection.send(JSON.stringify(response));
}

function deleteUser(msg: IMessage) {
  // console.log("before delete:");
  // console.log(users.map((x) => console.log(x.id)));
  users = users.filter((x) => x.id !== msg.id);
  // console.log("after delete:");
  // console.log(users.map((x) => console.log(x.id)));
}

function sendMovement(msg: IMessage) {
  const targetUser = users
    .filter((x) => x.playing === true)
    .find((x) => x.id !== msg.id);

  const originUser = users.find((x) => x.id === msg.id);

  if (targetUser) {
    if (originUser?.hands) {
      originUser.hands.leftHandPos = (msg.message as IHands).leftHandPos;
      originUser.hands.rightHandPos = (msg.message as IHands).rightHandPos;
    }

    const response: IMessage = {
      type: typeEnum.MOVEMENTRESPONSE,
      message: {
        events: generateEvents(originUser, msg?.message),
        leftHandFingers: originUser.hands.leftHandFingers,
        rightHandFingers: originUser.hands.rightHandFingers,
        leftHandPos: originUser.hands.leftHandPos,
        rightHandPos: originUser.hands.rightHandPos,
      },
      id: targetUser.id,
    };

    originUser.hands = msg.message as IHands;

    console.log("sending: %s", response);
    broadcast(response);
  }
}

function generateEvents(savedUser: IUser, recievedHands: IHands) {
  let res: string[] = [];
  let savedHands = savedUser.hands;

  for (let i = 0; i < savedHands.leftHandFingers.length; i++) {
    const savedExtended = savedHands.leftHandFingers[i];
    const recievedExtended = recievedHands.leftHandFingers[i];
    if (savedExtended === false && recievedExtended === true) {
      res.push(
        Object.keys(fingerEvents)[Object.values(fingerEvents).indexOf(i)]
      );
    }

    if (savedExtended === true && recievedExtended === false) {
      res.push(
        Object.keys(fingerEvents)[Object.values(fingerEvents).indexOf(i + 5)]
      );
    }
  }

  for (let i = 0; i < savedHands.rightHandFingers.length; i++) {
    const savedExtended = savedHands.rightHandFingers[i];
    const recievedExtended = recievedHands.rightHandFingers[i];

    if (savedExtended === false && recievedExtended === true) {
      res.push(
        Object.keys(fingerEvents)[Object.values(fingerEvents).indexOf(i + 10)]
      );
    }

    if (savedExtended === true && recievedExtended === false) {
      res.push(
        Object.keys(fingerEvents)[
          Object.values(fingerEvents).indexOf(i + 10 + 5)
        ]
      );
    }
  }

  return res;
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
