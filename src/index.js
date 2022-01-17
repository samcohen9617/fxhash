// these are the variables you can use as inputs to your algorithms
console.log(fxhash)   // the 64 chars hex number fed to your algorithm
console.log(fxrand()) // deterministic PRNG function, use it instead of Math.random()
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls} from "three/examples/jsm/controls/OrbitControls.js"

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

var camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000)
camera.position.z = 3;
camera.position.y = 2;

camera.lookAt(0,2,0);


const renderer = new THREE.WebGLRenderer({antialias: true});

renderer.shadowMap.enabled = true;
renderer.setPixelRatio(window.devicePixelRatio); 
renderer.setClearColor("#e5e5e5");
renderer.setSize(window.innerWidth,window.innerHeight);
var controls = new OrbitControls(camera, renderer.domElement);
document.body.appendChild(renderer.domElement);

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth,window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();
})


var light = new THREE.PointLight(0xFFFFFF, 5, 1000)
light.position.set(0,8,3);
scene.add(light);
var light = new THREE.PointLight(0xFFFFFF, 5, 1000)
light.position.set(0,8,-3);
scene.add(light);

var floorGeometry = new THREE.PlaneGeometry(5000, 5000, 1, 1);
var floorMaterial = new THREE.MeshPhongMaterial({
  color: 0xff0000,
  shininess: 0
});

var floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -0.5 * Math.PI;
floor.receiveShadow = true;
floor.position.y = -1;
scene.add(floor);


var loadModel = async function(){
  const loader = new GLTFLoader();

  const modelData = await loader.loadAsync("./Soldier.glb");
  const mesh = modelData.scene.children[0];
  mesh.rotation.z = Math.PI;

  scene.add(mesh);
}

const loadAsync = async () =>{
  await loadModel();
}
loadAsync();

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