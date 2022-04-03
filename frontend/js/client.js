import {leftHandOpponent, rightHandOpponent} from "./main.js";
//const socket = new WebSocket("wss://ws-vxax7qbyya-oa.a.run.app");
const socket = new WebSocket("ws://localhost:8999");

const user = {
  id: null,
  playing: null,
  hands: {
    leftHandFingers: [true, true, true, true, true],
    leftHandPos: {
      x: null,
      y: null,
    },
    rightHandFingers: [true, true, true, true, true],
    rightHandPos: {
      x: null,
      y: null,
    },
    events: [],
  },
};

const opponent = {
  hands: {
    leftHandFingers: [true, true, true, true, true],
    leftHandPos: {
      x: null,
      y: null,
    },
    rightHandFingers: [true, true, true, true, true],
    rightHandPos: {
      x: null,
      y: null,
    },
    events: [],
  },
};

function IMessage(type, message, id) {
  return {
    type,
    message,
    id,
  };
}

const typeEnum = Object.freeze({
  START: 0,
  STARTRESPONSE: 1,
  MOVEMENT: 2,
  MOVEMENTRESPONSE: 3,
  OPENRESPONSE: 4,
  CLOSE: 5,
});

socket.onopen = function (e) {
  console.log("[open] Conexión establecida");
  const msg = IMessage(typeEnum.START, null, null);
  socket.send(JSON.stringify(msg));
};

socket.onmessage = function (event) {
  // console.log(`[message] Datos recibidos del servidor: ${event.data}`);
  const msg = JSON.parse(event.data);
  switch (msg.type) {
    case typeEnum.OPENRESPONSE:
      user.id = msg.message.id;
      user.playing = msg.message.playing;
      setInterval(() => {
        const msg = IMessage(typeEnum.MOVEMENT, user.hands, user.id);
        socket.send(JSON.stringify(msg));
      }, 20);
      break;

    case typeEnum.MOVEMENTRESPONSE:
      if (msg.id === user.id) {
        opponent.hands.events = msg.message.events;
        opponent.hands.leftHandPos = msg.message.leftHandPos;
        opponent.hands.rightHandPos = msg.message.rightHandPos;
        opponent.hands.leftHandFingers = msg.message.leftHandFingers;
        opponent.hands.rightHandFingers = msg.message.rightHandFingers;
        updateFromServer(leftHandOpponent, rightHandOpponent);
      }
      break;

    default:
      break;
  }
};

socket.onclose = function (event) {
  const msg = IMessage(typeEnum.CLOSE, null, user.id);
  socket.send(JSON.stringify(msg));
  if (event.wasClean) {
    console.log(
      `[close] Conexión cerrada limpiamente, código=${event.code} motivo=${event.reason}`
    );
  } else {
    console.log("[close] La conexión se cayó");
  }
};

socket.onerror = function (error) {
  console.log(`[error] ${error.message}`);
};

window.onbeforeunload = function () {
  const msg = IMessage(typeEnum.CLOSE, null, user.id);
  socket.send(JSON.stringify(msg));
};

export const sendToServer = (leftHand, rightHand) => {
  user.hands.leftHandPos.x = leftHand.x;
  user.hands.leftHandPos.y = leftHand.y;
  user.hands.leftHandFingers = leftHand.fingersUp;

  user.hands.rightHandPos.x = rightHand.x;
  user.hands.rightHandPos.y = rightHand.y;
  user.hands.rightHandFingers = rightHand.fingersUp;
};

const updateFromServer = (leftHand, rightHand) => {
  leftHand.setPosition(opponent.hands.leftHandPos.x, opponent.hands.leftHandPos.y)
  leftHand.setFingersPosition(opponent.hands.leftHandFingers);

  rightHand.setPosition(opponent.hands.rightHandPos.x, opponent.hands.rightHandPos.y)
  rightHand.setFingersPosition(opponent.hands.rightHandFingers);
};