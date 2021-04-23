import './style.css'
import * as THREE from 'three'

console.log('hello')
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
const group = new THREE.Group();
group.position.y = 1;
group.scale.x = 2;
scene.add(group);

const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({color: 0xff0000})
)
cube1.position.x = -1;
group.add(cube1);

const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({color: 0xff0000})
)
cube2.position.x = 1;
group.add(cube2);
 

/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
}

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 5
camera.position.x = 1
camera.position.y = 1
camera.lookAt(0, 0, 0)
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)