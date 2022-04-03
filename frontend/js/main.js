import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js";
import {GLTFLoader} from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const loader = new GLTFLoader();
let hand, skeleton, mixer, clock, animations;

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

    animations = gltf.animations;
    mixer = new THREE.AnimationMixer(hand);
    console.log(animations)

    animate();
});

document.addEventListener('keydown', function(event) {
    let clip;

    switch (event.key){
        case "q":
            clip = animations[FINGER_1_DOWN];
            break;
        case "1":
            clip = animations[FINGER_1_UP];
            break;
        case "w":
            clip = animations[FINGER_2_DOWN];
            break;
        case "2":
            clip = animations[FINGER_2_UP];
            break;
        case "e":
            clip = animations[FINGER_3_DOWN];
            break;
        case "3":
            clip = animations[FINGER_3_UP];
            break;
        case "r":
            clip = animations[FINGER_4_DOWN];
            break;
        case "4":
            clip = animations[FINGER_4_UP];
            break;
        case "t":
            clip = animations[FINGER_5_DOWN];
            break;
        case "5":
            clip = animations[FINGER_5_UP];
            break;
    }

    let action = mixer.clipAction(clip);
    action.repetitions = 1;
    action.play();
    console.log(clip.name)
});