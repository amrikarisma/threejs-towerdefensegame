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

var cursor_cube = undefined;


//raycaster
var raycaster;
var mouse = new THREE.Vector2();
var clickableObjs = new Array();

function init() {
    clock = new THREE.Clock();
    scene = new THREE.Scene();

    raycaster = new THREE.Raycaster();

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

    //cursor
    const corsor_material = new THREE.MeshLambertMaterial({ transparent: true, opacity: 0, color: 0xc0392b });
    const cursor_geometry = new THREE.BoxGeometry(0.5, 4, 0.5);
    cursor_cube = new THREE.Mesh(cursor_geometry, corsor_material);
    scene.add(cursor_cube);

    //event
    document.addEventListener('pointerdown', onMouseDown, false);
    document.addEventListener('pointerup', onMouseUp, false);

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
    loadMap(map0_data, scene, clickableObjs);

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

function onMouseUp(event) {
    cursor_cube.material.emissive.g = 0;
    console.log(cursor_cube)

}
function onMouseDown(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    // Checking if the mouse projection is targeting a valid block in the clickableObjs array
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(clickableObjs); // get the list of targetable objects currently intersecting with raycaster
    if (intersects.length > 0) // If there is a match mouse/block (if the array is not empty)
    {
        var SelectedBloc = intersects[0].object; // we choose the first targetable element
        cursor_cube.position.set(SelectedBloc.position.x, SelectedBloc.position.y, SelectedBloc.position.z);
        cursor_cube.material.opacity = 0.5;
        cursor_cube.material.emissive.g = 0.5;
    } else // no valid block is targeted
    {
        cursor_cube.material.opacity = 0;
    }
    console.log(cursor_cube)
}

init();