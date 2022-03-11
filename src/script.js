import './style.css'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";
import {MTLLoader} from "three/examples/jsm/loaders/MTLLoader";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import tmi from 'tmi.js'

//APP INIT
const canvas = document.querySelector('canvas.webgl')
let visible = false;

// TWITCH INIT
const apikey = "yb25a2jekkkyq4ap4do53z3lfrsqgn";

// Define configuration options
const opts = {
	identity: {
		username: "shorty_d",
		password: "oauth:vfvfsom5n219ho7lcmv1yeztl8355k"
	},
	channels: [
		"shorty_d"
	]
};

// Create a client with our options
const client = new tmi.client(opts);

client.on('message', onMessageHandler);

client.connect().then(r => {
	console.log(`* Connected to ${r[0]}:${r[1]}`);
});

function onMessageHandler(target, context, msg, self) {
	if (self) {
		return;
	}
	const commandName = msg.trim();
	if (commandName === '!crea') {
		if (visible === true) {
			client.say(target, `Une prévisualisation de l'objet est deja afficher dans le coin bas droite de l'écran. Merci de ne pas spammer la commande`);

		} else {
			visible = true;
			canvas.classList.toggle('active');
			window.setTimeout(() => {
				canvas.classList.toggle('active');
			}, 20000);

			client.say(target, `Une prévisualisation de l'objet va s'afficher dans un coin en bas à droite de l'écran pendant 15s. Merci de ne pas spammer la commande`);
		}
	}
}

// THREEJS INIT
// const gui = new dat.GUI()
const scene = new THREE.Scene()
const loader = new OBJLoader();
const mtlLoader = new MTLLoader();

const axesHelper = new THREE.AxesHelper(150);
// scene.add( axesHelper );

let objectToRender = null;

await mtlLoader.load("gravity3.mtl", async function (materials) {
	materials.preload();
	loader.setMaterials(materials);

	// load a resource
	await loader.load('gravity3.obj',
		async (object) => {
			// const el = scene.getObjectByName("pCube36");
			// el.position.set(0, 0, 0);
			// el.rotation.x = 0;
			// el.material.color.set(0x50C878);
			object.position.set(0, 0, 0);

			object.rotation.x = -0.1;
			object.rotation.y = 0.1;
			object.rotation.z = 0.4;

			objectToRender = object;
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
lights[0] = new THREE.PointLight(0xffffff, 0.8, 0);
// lights[1] = new THREE.SpotLight(0xffffff, 0.8, 0);
// lights[2] = new THREE.SpotLight(0xffffff, 0.8, 0);
lights[0].position.set(0, 150, 0);
// lights[1].position.set(-150, 300, -150);
// lights[2].position.set(-1000, -2000, -1000);
scene.add(lights[0]);
// scene.add(lights[1]);
// scene.add(lights[2]);

/**
 * Sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight
}

window.addEventListener('resize', () => {
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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.01, 100)
camera.position.x = -31;
camera.position.y = 27;
camera.position.z = 44;
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

const tick = () => {

	const elapsedTime = clock.getElapsedTime();
	if (objectToRender !== null) {
		objectToRender.rotation.y = .4 * elapsedTime;
	}

	// Update objects

	// Update Orbital Controls
	// controls.update()

	// Render
	renderer.render(scene, camera)

	// Call tick again on the next frame
	window.requestAnimationFrame(tick)
}

tick()

canvas.addEventListener('click', () => {
	console.log(camera.position);
})
