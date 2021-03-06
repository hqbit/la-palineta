import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js";
import {Hand} from "./hand.js";
import {handsFreeController} from "./handsfree.js";
import {sendToServer} from "./client.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let clock;

const setUpScene = () => {
    clock = new THREE.Clock();

    camera.position.y = 0.5;
    camera.position.z = 0.5;
    camera.position.x = 0.5;
    camera.rotation.x = -Math.PI / 2;

    scene.background = new THREE.Color(0xffd1dc);
    scene.fog = new THREE.Fog(0xa0a0a0, 10, 50);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    hemiLight.position.set(0, 40, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xC4C0C0, 0.5);
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

const animate = () => {
    requestAnimationFrame(animate);

    const mixerUpdateDelta = clock.getDelta();

    leftHandPlayer.update(mixerUpdateDelta, 'leftHandPlayer');
    rightHandPlayer.update(mixerUpdateDelta, 'rightHandPlayer');

    leftHandOpponent.update(mixerUpdateDelta, 'leftHandOpponent');
    rightHandOpponent.update(mixerUpdateDelta, 'rightHandOpponent');

    handsFreeController(leftHandPlayer, rightHandPlayer);
    sendToServer(leftHandPlayer, rightHandPlayer);

    renderer.render(scene, camera);
};

setUpScene()

const leftHandPlayer = new Hand('LEFT', -0.5, 0.5, animate, scene);
const rightHandPlayer = new Hand('RIGHT', 0.5, 0.5, animate, scene);

export const leftHandOpponent = new Hand('LEFT', 500, 0.2, animate, scene, true);
export const rightHandOpponent = new Hand('RIGHT', 500, 0.2, animate, scene, true);
