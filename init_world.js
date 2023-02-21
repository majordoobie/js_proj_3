/**
 * Function will create the initial objects of the world
 */
function createWorld() {

    // Create and add the transparent cube to the scene
    let cube = new THREE.Mesh(
        new THREE.BoxGeometry(20, 20, 20),
        new THREE.MeshPhongMaterial({
            polygonOffset: true,  // will make sure the edges are visible.
            polygonOffsetUnits: 1,
            polygonOffsetFactor: 1,
            color: "white",
            specular: 0x202020,
            transparent: true,
            opacity: 0.3
        })
    );
    scene.add(cube);

    /* Create and add a wireframe cube to the scene, to show the edges of the cube. */
    let edgeGeometry = new THREE.EdgesGeometry(cube.geometry);  // contains edges of cube without diagonal edges
    cube.add(new THREE.LineSegments(edgeGeometry, new THREE.LineBasicMaterial({color: 0xffffff})));

    /* Create some balls and add them to the scene */
    let geom = new THREE.SphereGeometry(1, 20, 12);  // Geometry will be reused for all the balls.
    for (let i = 0; i < BALL_COUNT; i++) {
        let ball = {};  // object will contain a sphere plus its position and velocity info
        balls.push(ball);

        ball.obj = new THREE.Mesh(
            geom,
            new THREE.MeshPhongMaterial({
                color: Math.floor(Math.random() * 0x1000000), // random color
                specular: 0x080808,
                shininess: 32
            })
        );

        ball.x = 18 * Math.random() - 9;   // set random ball position
        ball.y = 18 * Math.random() - 9;
        ball.z = 18 * Math.random() - 9;
        ball.dx = Math.random() * 6 + 2;  // set random ball velocity, in units per second
        ball.dy = Math.random() * 6 + 2;
        ball.dz = Math.random() * 6 + 2;
        if (Math.random() < 0.5)
            ball.dx = -ball.dx;
        if (Math.random() < 0.5)
            ball.dy = -ball.dy;
        if (Math.random() < 0.5)
            ball.dz = -ball.dz;

        ball.obj.position.set(ball.x, ball.y, ball.z);
        scene.add(ball.obj);
    }

    controls = new THREE.TrackballControls(camera, canvasObj);  // note: TrackballControls require animation.
    controls.noPan = true;   // Don't do panning with the right mouse button.
    controls.noZoom = true;  // Don't do zooming with middle mouse button.
    return controls;

}

/**
 * Function is called by the `doFrame` function which is registered to be called at every frame. This is where
 * the actual animation manipulation will be placed
 */
function updateForFrame() {
    let dt = clock.getDelta();  // time since last update
    for (let ball of balls) {

        /* update ball position based on ball velocity and elapsed time */
        ball.x += ball.dx * dt;
        ball.y += ball.dy * dt;
        ball.z += ball.dz * dt;

        /* if ball has moved outside the cube, reflect it back into the cube */
        if (ball.x > 9) {
            ball.x -= 2 * (ball.x - 9);
            ball.dx = -Math.abs(ball.dx);
        } else if (ball.x < -9) {
            ball.x += 2 * (-9 - ball.x);
            ball.dx = Math.abs(ball.dx);
        }
        if (ball.y > 9) {
            ball.y -= 2 * (ball.y - 9);
            ball.dy = -Math.abs(ball.dy);
        } else if (ball.y < -9) {
            ball.y += 2 * (-9 - ball.y);
            ball.dy = Math.abs(ball.dy);
        }
        if (ball.z > 9) {
            ball.z -= 2 * (ball.z - 9);
            ball.dz = -Math.abs(ball.dz);
        } else if (ball.z < -9) {
            ball.z += 2 * (-9 - ball.z);
            ball.dz = Math.abs(ball.dz);
        }

        ball.obj.position.set(ball.x, ball.y, ball.z);
    }
}
