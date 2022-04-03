import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js";
import {Hand} from "./hand.js";
import {handsFreeController} from "./handsfree.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let clock;

const setUpScene = () => {
    clock = new THREE.Clock();

    camera.position.y = 0.5;
    camera.rotation.x = -Math.PI / 2;

    scene.background = new THREE.Color(0xa0a0a0);
    scene.fog = new THREE.Fog(0xa0a0a0, 10, 50);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(3, 10, 10);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 2;
    dirLight.shadow.camera.bottom = -2;
    dirLight.shadow.camera.left = -2;
    dirLight.shadow.camera.right = 2;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 40;
    scene.add(dirLight);
}

const configureHandsFree = () => {
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
}

const animate = () => {
    requestAnimationFrame(animate);

    const mixerUpdateDelta = clock.getDelta();

    leftHandPlayer.update(mixerUpdateDelta);
    rightHandPlayer.update(mixerUpdateDelta);

    renderer.render(scene, camera);

    handsFreeController(leftHandPlayer, rightHandPlayer);
};

setUpScene()

const leftHandPlayer = new Hand('LEFT', -0.2, 0.2, animate, scene);
const rightHandPlayer = new Hand('RIGHT', 0.2, 0.2, animate, scene);


document.addEventListener('keydown', function (event) {
    switch (event.key) {
        case "q":
            leftHandPlayer.fingerDown(0);
            rightHandPlayer.fingerDown(0);
            break;
        case "1":
            leftHandPlayer.fingerUp(0);
            rightHandPlayer.fingerUp(0);
            break;
        case "w":
            leftHandPlayer.fingerDown(1);
            rightHandPlayer.fingerDown(1);
            break;
        case "2":
            leftHandPlayer.fingerUp(1);
            rightHandPlayer.fingerUp(1);
            break;
        case "e":
            leftHandPlayer.fingerDown(2);
            rightHandPlayer.fingerDown(2);
            break;
        case "3":
            leftHandPlayer.fingerUp(2);
            rightHandPlayer.fingerUp(2);
            break;
        case "r":
            leftHandPlayer.fingerDown(3);
            rightHandPlayer.fingerDown(3);
            break;
        case "4":
            leftHandPlayer.fingerUp(3);
            rightHandPlayer.fingerUp(3);
            break;
        case "t":
            leftHandPlayer.fingerDown(4);
            rightHandPlayer.fingerDown(4);
            break;
        case "5":
            leftHandPlayer.fingerUp(4);
            rightHandPlayer.fingerUp(4);
            break;
    }
});