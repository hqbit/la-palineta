// Inside your app

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


/* IDEA:
En el cliente se iniciara el handsfree y se entrara en un bucle donde se ira comprobando que dedos estan extendidos,
el estado de los dedos (5 variables booleanas) se traducira en la manos 3D. Si un dedo esta extendido, este tambien lo estara
en el 3D. (aqui habria que ver como indicarlo al render del three.js ))

Dado que es online, no sera necesario realizar ninguna mecanica de paso de dedos. Se encarga el propio jugador

punto 0 posicion
*/

// True --> Curled
var thumbCurledState = false;
var indexCurledState = false;
var middleCurledState = false;
var ringeCurledState = false;
var pinkyCurledState = false;

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

function ringeChangeState(ringeCurledState, landkmarks) {
    return ringeCurledState !== ringeIsCurled(landkmarks)
}

function pinkyChangeState(pinkyCurledState, landkmarks) {
    return pinkyCurledState !== pinkyIsCurled(landkmarks)
}


// COFE FUNCTION WHERE FLOW IS DEFINIED
function update(landkmarks, handModel) {
    if (thumbsChangeState(thumbCurledState, landkmarks)) {
        if (!thumbIsCurled(landkmarks)) {
            handModel.fingerDown(4);
        } else {
            handModel.fingerUp(4);
        }
        thumbCurledState = !thumbCurledState;
    }

    if (indexChangeState(indexCurledState, landkmarks)) {
        if (!indexIsCurled(landkmarks)) {
            handModel.fingerDown(3);
        } else {
            handModel.fingerUp(3);
        }
        indexCurledState = !indexCurledState;
    }

    if (middleChangeState(middleCurledState, landkmarks)) {
        if (!middleIsCurled(landkmarks)) {
            handModel.fingerDown(2);
        } else {
            handModel.fingerUp(2);
        }
        middleCurledState = !middleCurledState;
    }

    if (ringeChangeState(ringeCurledState, landkmarks)) {
        if (!ringeIsCurled(landkmarks)) {
            handModel.fingerDown(1);
        } else {
            handModel.fingerUp(1);
        }
        ringeCurledState = !ringeCurledState;
    }

    if (pinkyChangeState(pinkyCurledState, landkmarks)) {
        if (!pinkyIsCurled(landkmarks)) {
            handModel.fingerDown(0);
        } else {
            handModel.fingerUp(0);
        }
        pinkyCurledState = !pinkyCurledState;
    }
}


// Codigo para evitar que pete el programa si una mano no es visible o detectada

export const handsFreeController = (leftHand, rightHand) => {
    if (handsfree.data.hands) { // Solo entra si existen las manos
        // Una mano
        if (handsfree.data.hands.landmarksVisible[0]) {
            // Solo entra si la mano es visible y por lo tanto existen los landmarks
            console.log(handsfree.data.hands['landmarks'])
            update(handsfree.data.hands['landmarks'][0], leftHand);
        }

        // La otra mano
        if (handsfree.data.hands.landmarksVisible[1]) {
            // Solo entra si la mano es visible y por lo tanto existen los landmarks
            update(handsfree.data.hands['landmarks'][1], rightHand);
        }
    }
}

// Quiza usar Listeners o Plugins si lo anterior no funciona