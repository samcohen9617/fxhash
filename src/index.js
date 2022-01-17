// these are the variables you can use as inputs to your algorithms
console.log(fxhash)   // the 64 chars hex number fed to your algorithm
console.log(fxrand()) // deterministic PRNG function, use it instead of Math.random()
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls} from "three/examples/jsm/controls/OrbitControls.js"
import { Camera } from 'three';

// note about the fxrand() function 
// when the "fxhash" is always the same, it will generate the same sequence of
// pseudo random numbers, always

//----------------------
// defining features
//----------------------
// You can define some token features by populating the $fxhashFeatures property
// of the window object.
// More about it in the guide, section features:
// [https://fxhash.xyz/articles/guide-mint-generative-token#features]
//
// window.$fxhashFeatures = {
//   "Background": "Black",
//   "Number of lines": 10,
//   "Inverted": true
// }

// this code writes the values to the DOM as an example
// const container = document.createElement("div")
// container.innerText = `
// WBSLT Creations\n
//   random hash: ${fxhash}\n
//   some pseudo random values: [ ${fxrand()}, ${fxrand()}, ${fxrand()}, ${fxrand()}, ${fxrand()},... ]\n
// `

var scene = new THREE.Scene();

const setupCamera = () => {
  var camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000)
  camera.position.z = 12;
  camera.position.y = 2;
  
  camera.lookAt(0,0,0);
  return camera;
}

const camera = setupCamera();

var setupRenderer = () => {
  const renderer = new THREE.WebGLRenderer({antialias: true});

  renderer.shadowMap.enabled = true;
  renderer.setPixelRatio(window.devicePixelRatio); 
  renderer.setClearColor("#e5e5e5");
  renderer.setSize(window.innerWidth,window.innerHeight);
  var controls = new OrbitControls(camera, renderer.domElement);
  document.body.appendChild(renderer.domElement);
  return renderer;
}

const renderer = setupRenderer();


// Lighting
const setupLighting  = () => {
  var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.61 );
  hemiLight.position.set( 0, 50, 0 );
  // Add hemisphere light to scene   
  scene.add( hemiLight );

var dirLight = new THREE.DirectionalLight( 0xffffff, 0.54 );
  dirLight.position.set( 0, 12, 8 );
  dirLight.castShadow = true;
  dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
  // Add directional Light to scene    
  scene.add( dirLight );

}

setupLighting();

const setupFloor = () => {
  var floorGeometry = new THREE.PlaneGeometry(5000, 5000, 1, 1);
  var floorMaterial = new THREE.MeshPhongMaterial({
    color: 0xff0000,
    shininess: 0
  });

  var floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -0.5 * Math.PI;
  floor.receiveShadow = true;
  floor.position.y = 0;
  scene.add(floor);
}

setupFloor();


var loadModels = function(){
  const loader = new GLTFLoader();

  loader.load("./Parrot.glb", function(gltf){
    const mesh = gltf.scene;
    mesh.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
    mesh.scale.set(0.1,0.1,0.1);
    mesh.position.set(-4, 6,0) 
    scene.add(mesh);
  });

  loader.load("./Soldier.glb", function(gltf){
    const mesh = gltf.scene;
    mesh.rotation.y = Math.PI;
    mesh.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
    
    mesh.scale.set(2,2,2);
    scene.add(mesh);
  });

}

loadModels();


function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  var width = window.innerWidth;
  var height = window.innerHeight;
  var canvasPixelWidth = canvas.width / window.devicePixelRatio;
  var canvasPixelHeight = canvas.height / window.devicePixelRatio;

  const needResize = canvasPixelWidth !== width || canvasPixelHeight !== height;
  if (needResize) {
    
    renderer.setSize(width, height, false);
  }
  return needResize;
}

var render = function() {
    requestAnimationFrame(render);

    
    renderer.render(scene, camera);

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
}


render();





// Listeners
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth,window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();
})
