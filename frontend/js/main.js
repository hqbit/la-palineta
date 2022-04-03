import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js";
import {GLTFLoader} from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const loader = new GLTFLoader();
let hand, skeleton, mixer, clock;

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

const animate = () => {
    requestAnimationFrame(animate);

    const mixerUpdateDelta = clock.getDelta();
    mixer.update(mixerUpdateDelta);
    renderer.render(scene, camera);
};

setUpScene()

loader.load('../models/hand/left.glb', function (gltf) {
    hand = gltf.scene;
    hand.rotation.y = -Math.PI / 2;
    scene.add(hand);

    skeleton = new THREE.SkeletonHelper(hand);
    skeleton.visible = false;
    scene.add(skeleton);

    const animations = gltf.animations;
    mixer = new THREE.AnimationMixer(hand);
    console.log(animations)

    let clip = animations[0];
    let action = mixer.clipAction(clip);
    action.play();

    clip = animations[1];
    action = mixer.clipAction(clip);
    action.play();

    animate();
});