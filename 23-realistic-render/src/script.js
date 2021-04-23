import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import * as dat from 'dat.gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Light
 */
const directionLight = new THREE.DirectionalLight("#ffffff", 3)
directionLight.castShadow = true
directionLight.shadow.camera.far = 15
directionLight.shadow.mapSize.set(1024, 1024)
directionLight.shadow.bias = 0.001
directionLight.shadow.normalBias = 0.04
directionLight.position.set(0.25, 3, -2.25)
scene.add(directionLight)

const directionLightCameraHelper = new THREE.CameraHelper(directionLight.shadow.camera)
scene.add(directionLightCameraHelper)

gui.add(directionLight, 'intensity').min(0).max(10).step(0.001).name("lightIntensity")
gui.add(directionLight.position, 'x').min(-15).max(15).step(0.001).name("lightX")
gui.add(directionLight.position, 'y').min(-15).max(15).step(0.001).name("lightY")
gui.add(directionLight.position, 'z').min(-15).max(15).step(0.001).name("lightZ")

const debugParam = {
    envMapIntensity: 5
}


const updateAllMaterial = () => {
    scene.traverse(child => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            // child.material.envMap = environmentMap
            child.material.envMapIntensity = debugParam.envMapIntensity
            child.material.needsUpdate = true
            child.castShadow = true
            child.receiveShadow = true
        }
    })
}

gui.add(debugParam, 'envMapIntensity').min(0).max(10).step(0.001).name('envMapIntensity').onChange(updateAllMaterial)


/**
 * Model
 */
const dracoLoader = new DRACOLoader()
// dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

gltfLoader.load(
    // 'models/sheep.glb',
    'models/FlightHelmet/glTF/FlightHelmet.gltf',
    gltf => {
        gltf.scene.scale.setScalar(10)
        gltf.scene.position.set(0, - 4, 0)
        // gltf.scene.rotation.y = Math.PI * 0.5
        scene.add(gltf.scene)

        gui.add(gltf.scene.rotation, 'y').min(- Math.PI).max(Math.PI).step(0.001).name('rotation')

        updateAllMaterial()
    }
)

/**
 * env map
 */
const cubeTextureLoader = new THREE.CubeTextureLoader()
const environmentMap = cubeTextureLoader.load([
    'textures/environmentMaps/0/px.jpg',
    'textures/environmentMaps/0/nx.jpg',
    'textures/environmentMaps/0/py.jpg',
    'textures/environmentMaps/0/ny.jpg',
    'textures/environmentMaps/0/pz.jpg',
    'textures/environmentMaps/0/nz.jpg'
])
environmentMap.encoding = THREE.sRGBEncoding

scene.background = environmentMap
scene.environment = environmentMap

/**
 * Test sphere
 */
const testSphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshStandardMaterial()
)
// scene.add(testSphere)

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
camera.position.set(4, 1, - 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 3
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

gui.add(renderer, 'toneMapping', {
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping,
}).onFinishChange(() => {
    renderer.toneMapping = Number(renderer.toneMapping)
    updateAllMaterial()
})
gui.add(renderer, 'toneMappingExposure').min(1).max(10).step(0.001)

/**
 * Animate
 */
const tick = () =>
{
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()