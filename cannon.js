import * as THREE from 'three';
import * as CANNON from 'cannon';

export function loadCannon(scene, intersectionPoint) {

    let meshes = [];
    let bodies = [];

    // Setup our world
    var world = new CANNON.World();
    world.gravity.set(0, 0, -10);

    const planeGeo = new THREE.PlaneGeometry(10, 10);
    const planeMat = new THREE.MeshStandardMaterial({
        color: 0xFFFFFF,
        side: THREE.DoubleSide
    })
    const planeMesh = new THREE.Mesh(planeGeo, planeMat);
    scene.add(planeMesh);

    const planeBody = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: new CANNON.Box(new CANNON.Vec3(5, 5, 0.001))
    });

    planeBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    world.addBody(planeBody);


    window.addEventListener('click', function (event) {
        const sphereGeo = new THREE.SphereGeometry(0.125, 30, 30);
        const sphereMat = new THREE.MeshStandardMaterial({ color: 0xFFEA00, metalness: 0, roughness: 0 });

        const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
        scene.add(sphereMesh);
        // sphereMesh.position.copy(intersectionPoint);

        const sphereBody = new CANNON.Body({
            mass: 0.3,
            shape: new CANNON.Sphere(0.125),
            position: new CANNON.Vec3(intersectionPoint.x, intersectionPoint.y, intersectionPoint.z)
        })
        world.addBody(sphereBody);

        meshes.push(sphereMesh)
        bodies.push(sphereBody)

    })

    return { world, planeMesh, planeBody, meshes, bodies }
}


