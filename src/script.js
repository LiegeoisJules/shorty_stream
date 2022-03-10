import './style.css'
import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";
import {MTLLoader} from "three/examples/jsm/loaders/MTLLoader";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// // Objects
// const geometry = new THREE.TorusGeometry( .7, .2, 16, 100 );
//
// // Materials
//
// const material = new THREE.MeshBasicMaterial()
// material.color = new THREE.Color(0xff0000)
//
// // Mesh
// const sphere = new THREE.Mesh(geometry,material)
//


const loader = new OBJLoader();
const mtlLoader = new MTLLoader();

let objectToRender = null;

await mtlLoader.load("gravity3.mtl", async function (materials) {
    materials.preload();

    loader.setMaterials(materials);

    // load a resource
    await loader.load('gravity3.obj',
        async (object) => {
            // const el = scene.getObjectByName("pCube36");
            //
            // el.position.set(0, 0, 0);
            // el.rotation.x = 0;
            // el.material.color.set(0x50C878);
            objectToRender = object;

            objectToRender.position.set(0, 0, 0);

            objectToRender.rotation.x = -0.1;
            objectToRender.rotation.y = 0.1;
            objectToRender.rotation.z = 0.4;

            scene.add(objectToRender);

        }, (xhr) => {
            console.log('xhr');
        }, (error) => {
            console.log('An error happened:' + error);
        }
    );

});

// Lights

const lights = [];

// set color and intensity of lights
lights[0] = new THREE.PointLight(0xffffff,0.8, 0);
// lights[1] = new THREE.SpotLight(0x0000ff, 1, 0);
// lights[2] = new THREE.SpotLight(0xffffff, 1, 0);

// place some lights around the scene for best looks and feel
lights[0].position.set(0, 300, 0);
// lights[1].position.set(1000, 2000, 1000);
// lights[2].position.set(-1000, -2000, -1000);

scene.add(lights[0]);
// scene.add(lights[1]);
// scene.add(lights[2]);

gui.addFolder('light0')

gui.add(lights[0].position, 'x', -1000, 1000, 1);
gui.add(lights[0].position, 'y', -1000, 1000, 1);
gui.add(lights[0].position, 'z', -1000, 1000, 1);
// gui.addFolder('light1')
//
// gui.add(lights[1].position, 'x', -1000, 1000, 1);
// gui.add(lights[1].position, 'y', -1000, 1000, 1);
// gui.add(lights[1].position, 'z', -1000, 1000, 1);
// gui.addFolder('light2')
//
// gui.add(lights[2].position, 'x', -1000, 1000, 1);
// gui.add(lights[2].position, 'y', -1000, 1000, 1);
// gui.add(lights[2].position, 'z', -1000, 1000, 1);


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = -31;
camera.position.y = 41;
camera.position.z = 42;
scene.add(camera)


// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    // objectToRender.rotation.y = .5 * elapsedTime

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

canvas.addEventListener('click', () =>
{
    console.log(camera.position);
})
