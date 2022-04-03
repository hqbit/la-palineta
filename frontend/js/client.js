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
      }, 1000);
      break;

    case typeEnum.MOVEMENTRESPONSE:
      if (msg.id === user.id) {
        opponent.hands.events = msg.message.events;
        opponent.hands.leftHandPos = msg.message.leftHandPos;
        opponent.hands.rightHandPos = msg.message.rightHandPos;
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
