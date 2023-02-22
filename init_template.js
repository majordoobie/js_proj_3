/**
 * This file has been taken and repurposed from the reading material from source code: full window demo along with
 * demo.html with the cube. I mainly restructured the code to allow me to modify the shapes and its speed without
 * any memory leaks.
 */

"use strict";

// Scene object is the root node of the graphic graphd. When animating, this is the object that is used
// to modify the transformation of the objects per frame
let scene;

// Camera is the object that enables the "view" of the scene
let camera;

// Renderer object is what creates an image from the scene graph
let renderer;

//Canvas object is added to the body of the page is what hooks the three.js to the page
let canvasObj;

// Keeps track of elapsed time of animation.
let clock;

// array of total shapes created
let shapes = [];

// Control the shape changes
let shapeQueue = [];
let currentShape;
const Geometries = {
    sphere: 0,
    cube: 1,
    cone: 2,
    cylinder: 3,
    dodecahedron: 4,
    torusKnot: 5,
};
const GeometryArray = [
    new THREE.SphereGeometry(1, 20, 12),
    new THREE.BoxGeometry(3, 3, 3),
    new THREE.ConeGeometry(1, 2),
    new THREE.CylinderGeometry(1, 1, 1.3, 32),
    new THREE.DodecahedronGeometry(),
    new THREE.TorusKnotGeometry(.8, 0.2, 128, 8, 5, 8),
];

// Control the speed of the shapes
let currentSpeed;
let speedQueue = [];
const shapeSpeed = [
    .5,
    1,
    1.5,
    3
];


/**
 * Callback to the redraw loop for each frame
 */
function doFrame() {
    updateForFrame();
    renderer.render(scene, camera);
    requestAnimationFrame(doFrame);
}


/** When the window is resized, we need to adjust the aspect ratio of the camera.
 * We also need to reset the size of the canvas that used by the renderer to
 * match the new size of the window.
 */
function doResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix(); 
    renderer.setSize(window.innerWidth, window.innerHeight);
}

/**
 *  This init() function is called when by the onload event when the document has loaded.
 */
function initTemplate() {
    try {

        scene = new THREE.Scene();
        canvasObj = document.getElementById("mainCanvas");
        camera = new THREE.PerspectiveCamera(28, window.innerWidth / window.innerHeight, 0.1, 100);
        try {
            renderer = new THREE.WebGLRenderer({
                antialias: true,
                canvas: canvasObj,
            });
        } catch (e) {
            document.body.innerHTML = "<h3><b>Sorry, WebGL is required but is not available.</b><h3>";
            return;
        }

        renderer.setSize(window.innerWidth, window.innerHeight);
        window.addEventListener("resize", doResize, false);
        // document.body.appendChild(canvasObj);
        clock = new THREE.Clock();
        renderer.setClearColor(0);

        // Add the camera and a light to the scene, linked into one object.
        let light = new THREE.DirectionalLight();
        light.position.set(0, 0, 1);
        camera.position.set(25, 40, 50);
        camera.lookAt(scene.position);
        camera.add(light);
        scene.add(camera);

        createDemo()
        
        // Set the default values for the page
        document.getElementById("shapeDiv").value = "0";
        document.getElementById("shapeDiv").onchange = onShapeSelect;
        
        document.getElementById("speedDiv").value = "0";
        document.getElementById("speedDiv").onchange = onSpeedSelect;


        // Register callback for each frame
        requestAnimationFrame(doFrame);
    } catch (e) {
        document.body.innerHTML = "<h3><b>Sorry, an error occurred:<br>" + e + "</b></h3>";
    }

}

