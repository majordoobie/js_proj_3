/*
This file is a modified version of the full-window.html example.
 */



/**
 * Function will create the initial objects of the world
 */
function createDemo() {

    // Create and add the transparent cube to the scene
    let cube = new THREE.Mesh(
        new THREE.BoxGeometry(20, 20, 20),
        new THREE.MeshPhongMaterial({
            polygonOffset: true, 
            polygonOffsetUnits: 1,
            polygonOffsetFactor: 1,
            color: "white",
            specular: 0x202020,
            transparent: true,
            opacity: 0.3
        })
    );
    scene.add(cube);
    let edgeGeometry = new THREE.EdgesGeometry(cube.geometry);
    cube.add(new THREE.LineSegments(edgeGeometry, new THREE.LineBasicMaterial({color: 0xffffff})));

    let geom = GeometryArray[Number(document.getElementById("shapeDiv").value)];
    currentSpeed = shapeSpeed[Number(document.getElementById("speedDiv").value)];

    // create the geo and material for each
    for (let i = 0; i < SHAPE_COUNT; i++) {
        let shape = {};
        shapes.push(shape);

        shape.obj = new THREE.Mesh(
            geom.clone(),
            new THREE.MeshPhongMaterial({
                color: Math.floor(Math.random() * 0x1000000), 
                specular: 0x080808,
                shininess: 32
            })
        );
        
        shape.x = 18 * Math.random() - 9;
        shape.y = 18 * Math.random() - 9;
        shape.z = 18 * Math.random() - 9;
        shape.dx = Math.random() * 6 + 2;
        shape.dy = Math.random() * 6 + 2;
        shape.dz = Math.random() * 6 + 2;
        if (Math.random() < 0.5)
            shape.dx = -shape.dx;
        if (Math.random() < 0.5)
            shape.dy = -shape.dy;
        if (Math.random() < 0.5)
            shape.dz = -shape.dz;

        shape.obj.position.set(shape.x, shape.y, shape.z);
        scene.add(shape.obj);
    }

}

/**
 * Function is called by the `doFrame` function which is registered to be called at every frame. This is where
 * the actual animation manipulation will be placed
 */
function updateForFrame() {
    
    // Grab the first item from the "queue" to see if there is anything in there
    let geoms = shapeQueue.shift();
    let speedMod = speedQueue.shift();
    let updateShapes = false;

    if (undefined !== geoms)
    {
        // If there is a new update, then perform
        currentShape = geoms;
        updateShapes = true;
    }
    
    if (undefined !== speedMod)
    {
        currentSpeed = speedMod;
    }
    
    let dt = clock.getDelta() * currentSpeed;
    
    for (let shape of shapes) {

        if (updateShapes)
        {
            shape.obj.geometry.dispose();
            shape.obj.geometry = currentShape.clone();
        }

        /* update ball position based on ball velocity and elapsed time */
        shape.x += shape.dx * dt;
        shape.y += shape.dy * dt;
        shape.z += shape.dz * dt;

        /* if ball has moved outside the cube, reflect it back into the cube */
        if (shape.x > 9) {
            shape.x -= 2 * (shape.x - 9);
            shape.dx = -Math.abs(shape.dx);
        } else if (shape.x < -9) {
            shape.x += 2 * (-9 - shape.x);
            shape.dx = Math.abs(shape.dx);
        }
        if (shape.y > 9) {
            shape.y -= 2 * (shape.y - 9);
            shape.dy = -Math.abs(shape.dy);
        } else if (shape.y < -9) {
            shape.y += 2 * (-9 - shape.y);
            shape.dy = Math.abs(shape.dy);
        }
        if (shape.z > 9) {
            shape.z -= 2 * (shape.z - 9);
            shape.dz = -Math.abs(shape.dz);
        } else if (shape.z < -9) {
            shape.z += 2 * (-9 - shape.z);
            shape.dz = Math.abs(shape.dz);
        }

        shape.obj.position.set(shape.x, shape.y, shape.z);
    }
}

function onShapeSelect() {
    shapeQueue.push(GeometryArray[Number(document.getElementById("shapeDiv").value)]);
    
}

function onSpeedSelect() {
    console.log("Ami here?");
    speedQueue.push(shapeSpeed[Number(document.getElementById("speedDiv").value)]);
}