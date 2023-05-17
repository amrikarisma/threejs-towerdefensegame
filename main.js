import * as THREE from 'three';
import * as YUKA from 'yuka';
import { MapControls } from 'three/examples/jsm/controls/MapControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { map0_data, loadMap } from './map.js';
import { TowerManager } from './towermanager.js'
import { createTowerGui_open, createTowerGui_close, infoTowerGui_open, infoTowerGui_close } from './gui.js';

// variables
var scene;
var camera;
var renderer;
var controls;
var entityManager;
var time;

// var cube;

var cursor_cube = undefined;

var tower_mesh = undefined;
var cursorValid = false;

//raycaster
var raycaster;
var mouse = new THREE.Vector2();
var clickableObjs = new Array();

var towerMngr = new TowerManager();


function init() {
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

    // loadObject
    const loader = new GLTFLoader();
    loader.load('./static/SUV.glb', function (glb) {
        const model = glb.scene;
        console.log('model:', model);
        model.scale.set(0.5, 0.5, 0.5);
        scene.add(model)
    })

    const vechicleGeometry = new THREE.ConeGeometry(0.1, 0.5, 8);
    const vechicleMaterial = new THREE.MeshNormalMaterial();
    const vechicleMesh = new THREE.Mesh(vechicleGeometry, vechicleMaterial);
    vechicleMesh.matrixAutoUpdate = false;
    scene.add(vechicleMesh);

    const vehicle = new YUKA.Vehicle();
    vehicle.setRenderComponent(vechicleMesh, sync);

    function sync(entity, renderComponent) {
        renderComponent.matrix.copy(entity.worldMatrix);
    }

    const path = new YUKA.Path();
    path.add(new YUKA.Vector3(-4, 0, 4));

    vehicle.position.copy(path.current());

    const followPathBehavior = new YUKA.FollowPathBehavior(path, 0.5);
    vehicle.steering.add(followPathBehavior);

    entityManager = new YUKA.EntityManager();
    entityManager.add(vehicle);

    time = new YUKA.Time();

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
    renderer.domElement.addEventListener('pointerdown', onMouseDown, false);
    renderer.domElement.addEventListener('pointerup', onMouseUp, false);


    // React Button
    document.getElementById("buttonyes").addEventListener('click', function (event) {
        event.stopPropagation();

        var tmpTower = towerMngr.newTowerMeshToCreate;
        console.log('tmpTower:', tmpTower)
        scene.add(tmpTower);
        towerMngr.addTower(tmpTower);

        towerMngr.newTowerMeshToCreate = undefined;
        createTowerGui_close();
    })

    document.getElementById("buttonno").addEventListener('click', function (event) {
        event.stopPropagation();
        towerMngr.newTowerMeshToCreate = undefined;
        createTowerGui_close();
    })

    document.getElementById("buttondelete").addEventListener('click', function (event) {
        event.stopPropagation();
        towerMngr.deleteTower(towerMngr.selectedTower);
        scene.remove(towerMngr.selectedTower.mesh);

        infoTowerGui_close();
        towerMngr.selectedTower = undefined;
    })

    document.getElementById("buttonclose").addEventListener('click', function (event) {
        event.stopPropagation();
        infoTowerGui_close();
    })



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

    // Tower Mesh
    const material = new THREE.MeshLambertMaterial({ color: 0x0392b });
    const tower_geometry = new THREE.BoxGeometry(1, 3, 1);
    tower_mesh = new THREE.Mesh(tower_geometry, material);

    // ---------------- CALLING LOADING AND INIT FUNCTIONS ----------------
    loadMap(map0_data, scene, clickableObjs);

    // ---------------- STARTING THE GAME MAIN LOOP ----------------

    // loop
    render();
}

function render() {
    const delta = time.update().getDelta();
    console.log(entityManager)
    entityManager.update(delta)

    controls.update();
    renderer.render(scene, camera);

    requestAnimationFrame(render);
}

function onMouseUp(event) {
    cursor_cube.material.emissive.g = 0;
    towerMngr.newTowerMeshToCreate = undefined;
    towerMngr.selectedTower = undefined;



    if (cursorValid) {
        var checkTower = towerMngr.getTowerAtPosition(cursor_cube.position.x, cursor_cube.position.z);
        if (checkTower == null) {
            var newtower = tower_mesh.clone();
            newtower.position.set(cursor_cube.position.x, 1, cursor_cube.position.z)
            towerMngr.newTowerMeshToCreate = newtower;

            infoTowerGui_close();
            createTowerGui_open();
        } else {
            towerMngr.selectedTower = checkTower;
            createTowerGui_close();
            infoTowerGui_open(checkTower.mesh.position.x, checkTower.mesh.position.z)
        }
        console.log('checkTower:', checkTower)
    }

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
        cursorValid = true;
    } else // no valid block is targeted
    {
        cursor_cube.material.opacity = 0;
        cursorValid = false;
    }
}

init();