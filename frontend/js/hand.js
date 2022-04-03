import {GLTFLoader} from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js";

const loader = new GLTFLoader();

export class Hand {
    side = "LEFT" | "RIGHT";
    x = 0;
    y = 0;

    fingersUp = [true, true, true, true, true];

    _animationsDown = [FINGER_1_DOWN, FINGER_2_DOWN, FINGER_3_DOWN, FINGER_4_DOWN, FINGER_5_DOWN];
    _animationsUp = [FINGER_1_UP, FINGER_2_UP, FINGER_3_UP, FINGER_4_UP, FINGER_5_UP];

    _animate;
    _scene;
    hand;

    constructor(side, x, y, animate, scene, rotated = false) {
        this.side = side;
        this.x = x;
        this.y = y;
        this._animate = animate;
        this._scene = scene;
        this.rotated = rotated;

        loader.load('../models/hand/left.glb', this.loadModel.bind(this));
    }

    loadModel(gltf) {
        this.hand = gltf.scene;
        this.hand.rotation.y = -Math.PI / 2;
        this.hand.position.x = this.x;
        this.hand.position.z = this.y;

        if (this.rotated) {
            this.hand.rotation.y = Math.PI / 2;
        }

        if (this.side === "RIGHT") {
            this.hand.scale.z = -1;
        }

        this._scene.add(this.hand);

        this.skeleton = new THREE.SkeletonHelper(this.hand);
        this.skeleton.visible = false;
        this._scene.add(this.skeleton);

        this.animations = gltf.animations;
        this._mixer = new THREE.AnimationMixer(this.hand);

        this._animate();
    }

    setFingersPosition(fingers) {
        //if (fingers[0] !== this.fingersUp[0] || fingers[1] !== this.fingersUp[1] || fingers[2] !== this.fingersUp[2] || fingers[3] !== this.fingersUp[3] || fingers[4] !== this.fingersUp[4]) {
            console.log(fingers);
            console.log(this.fingersUp);
            console.log('FINGERS CHANGED')
            console.log('========================')
        //}
        for (let i = 0; i < fingers.length; i++) {
            if (fingers[i] && !this.fingersUp[i]) {
                this.fingerUp(i);
                console.log("finger up");
            } else if (!fingers[i] && this.fingersUp[i]) {
                this.fingerDown(i);
                console.log("finger down");
            }
        }
        this.fingersUp = fingers;
    }

    fingerDown(finger) {
        let clip = this.animations[this._animationsDown[finger]];

        let oppositeClip = this.animations[this._animationsUp[finger]];
        let oppositeAction = this._mixer.clipAction(oppositeClip);
        oppositeAction.weight = 0;
        oppositeAction.stop();

        this.renderAction(clip, this._animationsUp[finger]);
    }

    fingerUp(finger) {
        let clip = this.animations[this._animationsUp[finger]];

        let oppositeClip = this.animations[this._animationsDown[finger]];
        let oppositeAction = this._mixer.clipAction(oppositeClip);
        oppositeAction.weight = 0;
        oppositeAction.stop();

        this.renderAction(clip, this._animationsUp[finger]);
    }

    update(mixerUpdateDelta, name) {
        if (this._mixer) {
            this._mixer.update(mixerUpdateDelta);
        }
    }

    renderAction(clip) {
        if (clip) {
            let action = this._mixer.clipAction(clip);
            action.weight = 1;
            action.clampWhenFinished = true;
            action.loop = THREE.LoopOnce;
            action.play();
        }
    }

    setPosition(x, y) {
        this.hand.position.x = this.x = 1 - x;
        this.hand.position.z = this.y = y;
    }
}