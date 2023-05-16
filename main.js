import * as THREE from 'three';
import { MapControls } from 'three/examples/jsm/controls/MapControls';
import { map0_data, loadMap } from './map.js';

// variables
var scene;
var camera;
var renderer;
var clock;
var controls;

// var cube;

function init() {
    clock = new THREE.Clock();
    scene = new THREE.Scene();


    //renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // camera
    const aspect = window.innerWidth / window.innerHeight;
    const frustumSize = 10;

    camera = new THREE.OrthographicCamera(frustumSize * aspect / -2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / -2, 1, 1000);
    camera.position.set(-15, 15, -15);
    scene.add(camera);

    // controls
    controls = new MapControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 2;
    controls.maxDistance = 20;
    controls.maxPolarAngle = Math.PI / 2;

    //light
    var ambientLight = new THREE.AmbientLight(0xcccccc, 0.2);
    scene.add(ambientLight);

    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(-1, 0.9, 0.4);
    scene.add(directionalLight);

    // //cube
    // const material = new THREE.MeshLambertMaterial();
    // const geometry = new THREE.BoxGeometry(2, 2, 2);
    // cube = new THREE.Mesh(geometry, material);
    // scene.add(cube);

    // ---------------- CALLING LOADING AND INIT FUNCTIONS ----------------
    loadMap(map0_data, scene);

    // ---------------- STARTING THE GAME MAIN LOOP ----------------

    // loop
    render();
}

function render() {
    var delta = clock.getDelta();
    var elapsed = clock.elapsedTime;

    controls.update();
    renderer.render(scene, camera);

    requestAnimationFrame(render);
}

init();