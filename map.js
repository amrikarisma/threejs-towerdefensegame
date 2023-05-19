import * as THREE from 'three';
import * as YUKA from 'yuka';

import { MapControls } from 'three/examples/jsm/controls/MapControls';

// ATTENTION - For this game, map width and length will be the same !
export var map0_data = {
    "data": [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
        [0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0],
        [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]
};

export function loadMap(mapdata, scene, clickableObjs) {
    var size_Y = mapdata.data.length;
    var size_X = mapdata.data[0].length;
    const material = new THREE.MeshLambertMaterial({});
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    var basic_cube = new THREE.Mesh(geometry, material);
    const road_material = new THREE.MeshLambertMaterial({ color: 0x2c3e50 });
    var road_cube = new THREE.Mesh(geometry, road_material);

    const path = new YUKA.Path();
    const route = [-4, 0, 4, -6, 0, 0, -4, 0, -4, 0, 0, 0, 4, 0, -4, 6, 0, 0, 4, 0, 4, 0, 0, 6]

    for (var x = 0; x < size_X; x++) {
        for (var y = 0; y < size_Y; y++) {
            var posx = (x * 2) - (size_X / 2) * 2; // position x
            var posy = (y * 2) - (size_Y / 2) * 2; // position y ( ATTENTION, this is the Z axis in three.js universe)
            switch (mapdata.data[y][x]) {
                case 0: // If [x/y] value is 0 - We are creating a basic block
                    var tmpbloc = basic_cube.clone();
                    tmpbloc.position.set(posx, -1, posy);
                    scene.add(tmpbloc);
                    clickableObjs.push(tmpbloc);
                    break;
                case 1: // If [x/y] value is 0 - We are creating a road block
                    var tmpbloc = road_cube.clone();
                    tmpbloc.scale.y = 0.8;
                    tmpbloc.position.set(posx, -1.2, posy);
                    scene.add(tmpbloc);
                    path.add(new YUKA.Vector3(posx, 0, posy));

                    break;
            }
        }
    }

    // for (let x = 0; x < route.length; x++) {
    //     var tmpbloc = road_cube.clone();
    //     tmpbloc.scale.y = 0.8;
    //     tmpbloc.position.set(route[x][0], -1.2, route[x][2]);
    //     scene.add(tmpbloc);
    //     path.add(new YUKA.Vector3(route[x][0], 0, route[x][2]));

    // }

    path.loop = true;

    return path;
}