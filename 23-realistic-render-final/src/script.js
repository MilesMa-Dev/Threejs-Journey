import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'

/**
 * Loaders
 */
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')
const gltfLoader = new GLTFLoader()
// gltfLoader.setDRACOLoader(dracoLoader)
const cubeTextureLoader = new THREE.CubeTextureLoader()

const fbxLoader = new FBXLoader()

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Update all materials
 */
const updateAllMaterials = () =>
{
    scene.traverse((child) =>
    {
        if(child instanceof THREE.Mesh && child.material)
        {
            // child.material.envMap = environmentMap
            child.material.envMapIntensity && (child.material.envMapIntensity = debugObject.envMapIntensity)
            child.material.needsUpdate = true
            child.castShadow = true
            child.receiveShadow = true
        }
    })
}

/**
 * Environment map
 */
const environmentMap = cubeTextureLoader.load([
    '/textures/environmentMaps/4/px.png',
    '/textures/environmentMaps/4/nx.png',
    '/textures/environmentMaps/4/py.png',
    '/textures/environmentMaps/4/ny.png',
    '/textures/environmentMaps/4/pz.png',
    '/textures/environmentMaps/4/nz.png'
])

environmentMap.encoding = THREE.sRGBEncoding

scene.background = environmentMap
scene.environment = environmentMap

debugObject.envMapIntensity = 5
gui.add(debugObject, 'envMapIntensity').min(0).max(10).step(0.001).name("环境贴图强度").onChange(updateAllMaterials)

/**
 * Models
 */
gltfLoader.load(
    '/models/FlightHelmet/glTF/FlightHelmet.gltf',
    (gltf) =>
    {
        gltf.scene.scale.setScalar(5)
        // gltf.scene.position.set(0, - 4, 0)
        gltf.scene.rotation.y = -Math.PI * 0.25
        scene.add(gltf.scene)

        gui.add(gltf.scene.rotation, 'y').min(- Math.PI).max(Math.PI).step(0.001).name('rotation')

        updateAllMaterials()
    }
)

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#ffffff',
    })
)
floor.position.y = -2.3;
floor.castShadow = false
floor.receiveShadow = true
floor.rotation.x = -Math.PI * 0.5
scene.add(floor) 

// fbxLoader.load(
//     'models/cake/cake.fbx',
//     obj => {
//         console.log(obj)
//         obj.castShadow = true
//         obj.receiveShadow = true
//         obj.scale.setScalar(0.02)
//         scene.add(obj)

//         updateAllMaterials()
//     }
// )

/**
 * Lights
 */
const parameter = {
    directionalColor: '#ffffff',
    ambientColor: '#ffffff'
}

const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.castShadow = true
directionalLight.shadow.camera.near = 0
directionalLight.shadow.camera.far = 15
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(-5, 3, 5)
scene.add(directionalLight)

const directionLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
scene.add(directionLightCameraHelper)

gui.addColor(parameter, 'directionalColor').name('平行光颜色').onChange(() => {
    directionalLight.color.set(parameter.directionalColor);
})
gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('平行光强度')
gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001).name('平行光X坐标')
gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001).name('平行光Y坐标')
gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001).name('平行光Z坐标')

const ambientLight = new THREE.AmbientLight('#ffffff', 0.15)
gui.addColor(parameter, 'ambientColor').name('环境光颜色').onChange(() => {
    ambientLight.color.set(parameter.ambientColor);
})
gui.add(ambientLight, 'intensity').min(0).max(2).step(0.0001).name('环境光强度')
scene.add(ambientLight)

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
camera.position.set(-5, 3, 5)
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
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.LinearToneMapping
renderer.toneMappingExposure = 1
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

gui
    .add(renderer, 'toneMapping', {
        No: THREE.NoToneMapping,
        Linear: THREE.LinearToneMapping,
        Reinhard: THREE.ReinhardToneMapping,
        Cineon: THREE.CineonToneMapping,
        ACESFilmic: THREE.ACESFilmicToneMapping
    })
    .onFinishChange(() =>
    {
        renderer.toneMapping = Number(renderer.toneMapping)
        updateAllMaterials()
    })
gui.add(renderer, 'toneMappingExposure').min(0).max(5).step(0.001)

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