import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'
import VConsole from 'vconsole'

// var vConsole = new VConsole();
/**
 * Base
 */
// Loader
const gltfLoader = new GLTFLoader()

// Debug
const gui = new dat.GUI({ width: 340 })

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const debugObject = {
    surfaceColor: '#e11a7c',
    depthColor: '#5a56af'
}

const cubeTextureLoader = new THREE.CubeTextureLoader()

/**
 * Environment map
 */
const environmentMap = cubeTextureLoader.load([
    '/textures/environmentMaps/1/px.png',
    '/textures/environmentMaps/1/nx.png',
    '/textures/environmentMaps/1/py.png',
    '/textures/environmentMaps/1/ny.png',
    '/textures/environmentMaps/1/pz.png',
    '/textures/environmentMaps/1/nz.png'
])
environmentMap.mapping = THREE.CubeRefractionMapping;
environmentMap.encoding = THREE.sRGBEncoding

scene.background = environmentMap
scene.environment = environmentMap

debugObject.envMapIntensity = 5

/**
 * watertank
 */
// let waterTank = null;
// gltfLoader.load(
//     '/models/watertank.glb',
//     gltf => {
//         waterTank = gltf.scene
//         waterTank.scale.setScalar(1.01)
//         scene.add(waterTank)

//         updateTankMaterial()
//     }
// )

// const updateTankMaterial = () => {
//     if (waterTank) {
//         waterTank.traverse(child => {
//             if (child.material) {
//                 console.log('hahah')
//                 child.material.transparent = true;
//                 child.material.opacity = 0.1;
//                 child.material.side = THREE.DoubleSide;
//                 child.material.needsUpdate = true;
//                 child.material.depthWrite = false;
//                 child.material.refractionRatio = 0.9
//             }
//         })
//     }
// }

/**
 * cube
 */
// const cubeGeometry = new THREE.BoxGeometry(2.2, 2.2, 2.2)
// const cubeMaterial = new THREE.MeshBasicMaterial({
//     transparent: true,
//     opacity: 0.5,
//     // refractionRatio: 0.9,
//     // envMap: environmentMap
// })
// const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
// scene.add(cube)

/**
 * Light
 */
const ambientLight = new THREE.AmbientLight('#ffffff', 0.2)
scene.add(ambientLight)

/**
 * Water
 */
// Geometry
// const waterGeometry = new THREE.PlaneGeometry(2, 2, 512, 512)
const waterGeometry = new THREE.BoxGeometry(2, 2, 2, 256, 256, 256)
// Material
const waterMaterial = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: {
        uWaveFrequency: {value: new THREE.Vector2(2.372, 2.0)},
        uWaveElevation: {value: 0.065},
        uWaveSpeed: {value: 0.12},
        uTime: {value: 0},
        uSurfaceColor: {value: new THREE.Color(debugObject.surfaceColor)},
        uDepthColor: {value: new THREE.Color(debugObject.depthColor)},
        uColorStrength: {value: 1.012},
        uNoiseFrequency: {value: 1.295},
        uNoiseElevation: {value: 0.15},
        uNoiseSpeed: {value: 0.2},
        uNoiseRepeat: {value: 3}
    },
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false
})

gui.add(waterMaterial.uniforms.uWaveFrequency.value, 'x').min(0).max(10).step(0.001).name('uWaveFrequencyX');
gui.add(waterMaterial.uniforms.uWaveFrequency.value, 'y').min(0).max(10).step(0.001).name('uWaveFrequencyY');
gui.add(waterMaterial.uniforms.uWaveElevation, 'value').min(0).max(0.5).step(0.001).name('uWaveElevation');
gui.add(waterMaterial.uniforms.uWaveSpeed, 'value').min(0).max(10).step(0.001).name('uWaveSpeed');
gui.add(waterMaterial.uniforms.uColorStrength, 'value').min(0).max(3).step(0.001).name('uColorStrength');

gui.add(waterMaterial.uniforms.uNoiseFrequency, 'value').min(0).max(10).step(0.001).name('uNoiseFrequency');
gui.add(waterMaterial.uniforms.uNoiseElevation, 'value').min(0).max(1).step(0.001).name('uNoiseElevation');
gui.add(waterMaterial.uniforms.uNoiseSpeed, 'value').min(0).max(10).step(0.001).name('uNoiseSpeed');
gui.add(waterMaterial.uniforms.uNoiseRepeat, 'value').min(1).max(10).step(1).name('uNoiseRepeat');

gui.addColor(debugObject, 'surfaceColor').name('surfaceColor').onChange(() => {
    waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor);
});
gui.addColor(debugObject, 'depthColor').name('depthColor').onChange(() => {
    waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor);
});

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.y = Math.PI * 0.25
scene.add(water)

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
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, -1, 0)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
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

    waterMaterial.uniforms.uTime.value = elapsedTime;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()