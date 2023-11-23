// Import the required Three.js modules
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { getGuiControls } from "./gui.js";

// Shaders

let uniforms = {
  u_time: {
    type: "f",
    value: 1.0,
  },
  u_resolution: {
    type: "v2",
    value: new THREE.Vector2(),
  },
  u_mouse: {
    type: "v2",
    value: new THREE.Vector2(),
  },
  //texture2: { type: "t", value: texture2 },
};

// IMPORTING SHADERS

let vertTest = await fetch("./shaders/test.vert");
let fragTest = await fetch("./shaders/test.frag");
vertTest = await vertTest.text();
fragTest = await fragTest.text();

// Globals
const guiControls = getGuiControls();
let t0 = new Date();

let scene, renderer;
let camera, controls;
let mapsx, mapsy;

// Start functions
init();
animate();

// Init function
function init() {
  // Main scene
  scene = new THREE.Scene();

  // Renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Cameras and Controls
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.set(0, 0, 5);
  scene.add(camera);

  // Create a controls object for the orbital camera
  controls = new OrbitControls(camera, renderer.domElement);

  const light = new THREE.AmbientLight();
  scene.add(light);
  //Textura mundo
  const tx1 = new THREE.TextureLoader().load(
    "https://cdn.glitch.global/8b114fdc-500a-4e05-b3c5-a4afa5246b07/earthmap1k.jpg?v=1666848392635"
  );
  //Mapa de elevación 1 fuente https://visibleearth.nasa.gov/images/73934/topography
  const dm1 = new THREE.TextureLoader().load(
    "https://cdn.glitch.global/8b114fdc-500a-4e05-b3c5-a4afa5246b07/gebco_08_rev_elev_5400x2700.png?v=1668158994801"
  );
  //Mapa de elevación 2 Fuente https://sbcode.net/threejs/displacmentmap/
  const dm2 = new THREE.TextureLoader().load(
    "https://cdn.glitch.global/8b114fdc-500a-4e05-b3c5-a4afa5246b07/gebco_bathy.5400x2700_8bit.jpg?v=1668108267910"
  );

  //Objeto
  mapsx = 21.6 / 2.5;
  mapsy = 10.8 / 2.5;
  Plane(0, 0, 0, mapsx, mapsy, tx1, dm2);

  onWindowResize();
  window.addEventListener("resize", onWindowResize, false);
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  // Shader
  uniforms.u_time.value += 0.05;

  // Update Cam Controls
  controls.update();
  let t1 = new Date();
  let secs = (t1 - t0) / 1000;

  renderer.render(scene, camera);
}

function onWindowResize(e) {
  renderer.setSize(window.innerWidth, window.innerHeight);
  uniforms.u_resolution.value.x = renderer.domElement.width;
  uniforms.u_resolution.value.y = renderer.domElement.height;
}

document.onmousemove = function (e) {
  uniforms.u_mouse.value.x = e.pageX / window.innerWidth;
  uniforms.u_mouse.value.y = e.pageY / window.innerHeight;
};

function Plane(px, py, pz, sx, sy, txt, dismap) {
  let geometry = new THREE.PlaneBufferGeometry(sx, sy, 200, 200);
  let material = new THREE.MeshPhongMaterial({
    wireframe: true,
  });

  //Texture
  if (txt != undefined) {
    material.map = txt;
  }

  if (dismap != undefined) {
    material.displacementMap = dismap;
    material.displacementScale = 0.3;
  }

  let mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(px, py, pz);
  scene.add(mesh);
}
