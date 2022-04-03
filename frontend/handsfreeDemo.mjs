// Inside your app

console.log('hello world')


import Handsfree from 'handsfree'



//--------------- ESTO ES LA CREACION DEL OBJETO QUE DETECTARA 
const handsfreeOBJ = new Handsfree({
    hands: {
      enabled: true,
      // The maximum number of hands to detect [0 - 4]
      maxNumHands: 2,
  
      // Minimum confidence [0 - 1] for a hand to be considered detected
      minDetectionConfidence: 0.5,
  
      // Minimum confidence [0 - 1] for the landmark tracker to be considered detected
      // Higher values are more robust at the expense of higher latency
      minTrackingConfidence: 0.5
    }
  })
  

const handIndex = 0;
const label = "Right";
const score = 0.5;
// ----------- IDENTIFICAR QUE MANO ES (IZQUIERDA O DERECHA)
// handIndex [0 - 3] An array of landmark points for each detected hands
handsfreeOBJ.data.hands.multiHandedness[handIndex] == {
    // "Right" or "Left"
    label,
    // The probability that it is "Right" or "Left"
    score
  }
  
  // hand 0
  handsfreeOBJ.data.hands.multiHandedness[0].label
  handsfreeOBJ.data.hands.multiHandedness[0].score


// ---------- Arrays de landkmarks (puntos rojos de la mano)

  // handIndex [0 - 3] An array of landmark points for each detected hands
  handsfreeOBJ.data.hands.landmarks

// Left hand, person #1
handsfreeOBJ.data.hands.landmarks[0]
// Right hand, person #1
handsfreeOBJ.data.hands.landmarks[1]

// ------------ ACESSO A LOS VALORES (x,y):
handsfreeOBJ.data.hands.landmarks[0][12].x



// -------- VISIBILIDAD DE UNA MANO
// Left hand, person #1
handsfreeOBJ.data.hands.landmarksVisible[0]


//-------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------
// El codigo de arriba es documentacion interesante
// El codgio de abajo es el que se usara en el poryecto
//-------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------
const handsfree = new Handsfree({
    hands: {
      enabled: true,
      // The maximum number of hands to detect [0 - 4]
      maxNumHands: 2,
  
      // Minimum confidence [0 - 1] for a hand to be considered detected
      minDetectionConfidence: 0.5,
  
      // Minimum confidence [0 - 1] for the landmark tracker to be considered detected
      // Higher values are more robust at the expense of higher latency
      minTrackingConfidence: 0.5
    }
  })

handsfree.start()


// TIP --> Parte más elevada del dedo
const THUMBS_TIP = 4
const INDEX_TIP = 8
const MIDDLE_TIP = 12
const RINGE_TIP = 16
const PINKY_TIP = 20

// MCP --> Nudillo del dedo (parte mas baja)
const THUMBS_MCP = 1
const INDEX_MCP = 5
const MIDDLE_MCP = 9
const RINGE_MCP = 13
const PINKY_MCP = 17

const WRIST_POSITION = 0


// El paramtro *landmarks* representa los landmarks de la mano: indexIsCurled(handsfree.data.hands.landmarks[1])
function thumbIsCurled(landmarks) {
    return landmarks[THUMBS_TIP].y < landmarks[INDEX_MCP].y; 
}

function indexIsCurled(landmarks) {
    return landmarks[INDEX_TIP].y < landmarks[INDEX_MCP].y;
}

function middleIsCurled(landmarks) {
    return landmarks[MIDDLE_TIP].y < landmarks[MIDDLE_MCP].y;
}

function ringeIsCurled(landmarks) {
    return landmarks[RINGE_TIP].y < landmarks[RINGE_MCP].y;
}

function pinkyIsCurled(landmarks) {
    return landmarks[PINKY_TIP].y < landmarks[PINKY_MCP].y;
}

function getPosition(landmarks) {
    return landmarks[WRIST_POSITION];
}

// USAGE
var isCurled = pinkyIsCurled(handsfree.data.hands.landmarks[0]);
var position = getPosition(handsfree.data.hands.landmarks[1])
var pos_x = position.x; // position.y;



/* IDEA:
En el cliente se iniciara el handsfree y se entrara en un bucle donde se ira comprobando que dedos estan extendidos,
el estado de los dedos (5 variables booleanas) se traducira en la manos 3D. Si un dedo esta extendido, este tambien lo estara
en el 3D. (aqui habria que ver como indicarlo al render del three.js ))

Dado que es online, no sera necesario realizar ninguna mecanica de paso de dedos. Se encarga el propio jugador

punto 0 posicion
*/

// True si ha cambiado
function thumbsChangeState(thumbCurledState, landkmarks) {
  return thumbCurledState !== thumbIsCurled(landkmarks)
}
function indexChangeState(indexCurledState, landkmarks) {
  return indexCurledState !== indexIsCurled(landkmarks)
}
function middleChangeState(middleCurledState, landkmarks) {
  return middleCurledState !== middleIsCurled(landkmarks)
}
function ringeChangeState( ringeCurledState, landkmarks) {
  return  ringeCurledState !==  ringeIsCurled(landkmarks)
}
function pinkyChangeState(pinkyCurledState, landkmarks) {
  return pinkyCurledState !== pinkyIsCurled(landkmarks)
}

// True --> Curled
var thumbCurledState = false;
var indexCurledState = false;
var middleCurledState = false;
var ringeCurledState = false;
var pinkyCurledState = false;


// COFE FUNCTION WHERE FLOW IS DEFINIED
function update(landkmarks) {
  if(thumbsChangeState(thumbCurledState, landkmarks)) {
    if(thumbIsCurled(landkmarks)) {
      // render.fingerDown(...)
    }
    else {
      // render.fingerUp(...)
    }
    thumbCurledState = ! thumbCurledState;
  }

  if(indexChangeState(indexCurledState, landkmarks)) {
    if(indexIsCurled(landkmarks)) {
      // render.fingerDown(...)
    }
    else {
      // render.fingerUp(...)
    }
    indexCurledState = ! indexCurledState;
  }

  if(middleChangeState(middleCurledState, landkmarks)) {
    if(middleIsCurled(landkmarks)) {
      // render.fingerDown(...)
    }
    else {
      // render.fingerUp(...)
    }
    middleCurledState = ! middleCurledState;
  }

  if(ringeChangeState(ringeCurledState, landkmarks)) {
    if(ringeIsCurled(landkmarks)) {
      // render.fingerDown(...)
    }
    else {
      // render.fingerUp(...)
    }
    ringeCurledState = ! ringeCurledState;
  }

  if(pinkyChangeState(pinkyCurledState, landkmarks)) {
    if(pinkyIsCurled(landkmarks)) {
      // render.fingerDown(...)
    }
    else {
      // render.fingerUp(...)
    }
    pinkyCurledState = ! pinkyCurledState;
  }
}


// Codigo para evitar que pete el programa si una mano no es visible o detectada
if (handsfree.data.hands) { // Solo entra si existen las manos
    // Una mano
    if(handsfree.data.hands.landmarksVisible[0]) {
        // Solo entra si la mano es visible y por lo tanto existen los landmarks
        update(handsfree.data.hands.landkmarks[0])
    }

    // La otra mano
    if(handsfree.data.hands.landmarksVisible[1]) {
        // Solo entra si la mano es visible y por lo tanto existen los landmarks
        update(handsfree.data.hands.landkmarks[1])
    }
}



// Quiza usar Listeners o Plugins si lo anterior no funciona