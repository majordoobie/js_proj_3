/**
 * This file has been taken and repurposed from the reading material from source code: full window demo
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

// an object of type TrackballControls, the handles rotation using the mouse.
let controls;  


/**
 * Callback to the redraw loop for each frame
 */
function doFrame() {
    updateForFrame();
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(doFrame);
}


/** When the window is resized, we need to adjust the aspect ratio of the camera.
 * We also need to reset the size of the canvas that used by the renderer to
 * match the new size of the window.
 */
function doResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix(); // Need to call this for the change in aspect to take effect.
    renderer.setSize(window.innerWidth, window.innerHeight);
}

/**
 *  This init() function is called when by the onload event when the document has loaded.
 */
function initTemplate() {
    try {

        // Set basic Three.js objects
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(28, window.innerWidth / window.innerHeight, 0.1, 100);
        try {
            renderer = new THREE.WebGLRenderer({
                antialias: true,
            });
        } catch (e) {
            document.body.innerHTML = "<h3><b>Sorry, WebGL is required but is not available.</b><h3>";
            return;
        }

        canvasObj = renderer.domElement;
        renderer.setSize(window.innerWidth, window.innerHeight);
        window.addEventListener("resize", doResize, false);
        document.body.appendChild(canvasObj);
        clock = new THREE.Clock();
        renderer.setClearColor(0);

        // Add the camera and a light to the scene, linked into one object.
        let light = new THREE.DirectionalLight();
        light.position.set(0, 0, 1);
        camera.position.set(25, 40, 50);
        camera.lookAt(scene.position);
        camera.add(light);
        scene.add(camera);

        controls = createWorld();

        // Register callback for each frame
        requestAnimationFrame(doFrame);
    } catch (e) {
        document.body.innerHTML = "<h3><b>Sorry, an error occurred:<br>" + e + "</b></h3>";
    }

}

