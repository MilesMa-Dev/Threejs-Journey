import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader'

import fireFliesVertex from './shaders/fireflies/vertex.glsl'
import fireFliesFragment from './shaders/fireflies/fragment.glsl'

import portalVertex from './shaders/portal/vertex.glsl'
import portalFragment from './shaders/portal/fragment.glsl'

/**
 * Loaders
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/matcap_1.png')

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const debugObject = {
    clearColor: '#ff0000',
    portalColorStart: '#f5f5f5',
    portalColorEnd: '#747489'
}

gui.addColor(debugObject, 'clearColor').onChange(() => { renderer.setClearColor(debugObject.clearColor) })


gui
    .addColor(debugObject, 'portalColorStart')
    .onChange(() =>
    {
        portalLightMaterial.uniforms.uColorStart.value.set(debugObject.portalColorStart)
    })

gui
    .addColor(debugObject, 'portalColorEnd')
    .onChange(() =>
    {
        portalLightMaterial.uniforms.uColorEnd.value.set(debugObject.portalColorEnd)
    })

/**
 * model
 */
// textures
const bakedTexture = textureLoader.load('baked-night.jpg')
bakedTexture.flipY = false
bakedTexture.encoding = THREE.sRGBEncoding

const bakedMaterial = new THREE.MeshBasicMaterial({
    map: bakedTexture
})
const poleLightMaterial = new THREE.MeshBasicMaterial({color: 0xffffe5})
const portalLightMaterial = new THREE.ShaderMaterial({
    vertexShader: portalVertex,
    fragmentShader: portalFragment,
    uniforms: {
        uTime: {value: 0},
        uColorStart: { value: new THREE.Color(debugObject.portalColorStart) },
        uColorEnd: { value: new THREE.Color(debugObject.portalColorEnd) }
    },
    side: THREE.DoubleSide
})

gltfLoader.load(
    'portal-compressed.glb',
    gltf => {
        gltf.scene.traverse(_child => {
            _child.material = bakedMaterial;
            // _child.material = new THREE.ShadowMaterial();
            // _child.receiveShadow = true;
        })

        const portalLightMesh = gltf.scene.children.find(_child => _child.name === 'PortalLight')
        const poleLightAMesh = gltf.scene.children.find(_child => _child.name === 'poleLightA')
        const poleLightBMesh = gltf.scene.children.find(_child => _child.name === 'poleLightB')

        portalLightMesh.material = portalLightMaterial
        poleLightAMesh.material = poleLightMaterial
        poleLightBMesh.material = poleLightMaterial
        
        scene.add(gltf.scene)
    }
)

const sphere = new THREE.Mesh(
    new THREE.TorusBufferGeometry(0.3, 0.02, 16, 32),
    new THREE.MeshMatcapMaterial({
        matcap: matcapTexture
    })
)
sphere.castShadow = true;
sphere.receiveShadow = true;
sphere.position.y = 0.5
sphere.rotation.x = -Math.PI * 0.5
scene.add(sphere)

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    new THREE.MeshStandardMaterial({
        color: '#ffffff',
    })
)
floor.position.y = 0.1;
floor.castShadow = false
floor.receiveShadow = true
floor.rotation.x = -Math.PI * 0.5
scene.add(floor) 

const directionalLight = new THREE.DirectionalLight('#ffffff', 2)
directionalLight.castShadow = true
directionalLight.shadow.camera.near = 0
directionalLight.shadow.camera.far = 10
directionalLight.shadow.camera.left = -1
directionalLight.shadow.camera.right = 1
directionalLight.shadow.camera.top = 1
directionalLight.shadow.camera.bottom = -1
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0, 3, 5)
console.log(directionalLight.shadow.camera)
scene.add(directionalLight)

const directionLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
scene.add(directionLightCameraHelper)

/**
 * FireFlies
 */
const fireFliesGeometry = new THREE.BufferGeometry();
const fireFliesMaterial = new THREE.ShaderMaterial({
    vertexShader: fireFliesVertex,
    fragmentShader: fireFliesFragment,
    uniforms: {
        uPixelRatio: { value: Math.min(window.devicePixelRatio * 2) },
        uTime: { value: 0 }
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
})

const fireFliesCount = 30
const positionArray = new Float32Array(fireFliesCount * 3)
const scaleArray = new Float32Array(fireFliesCount)

for (let i=0; i<fireFliesCount; i++) {
    const i3 = i*3

    positionArray[i3] = (Math.random() - 0.5) * 4
    positionArray[i3 + 1] = Math.random() * 1.5 + 0.2
    positionArray[i3 + 2] = (Math.random() - 0.5) * 4

    scaleArray[i3] = Math.random()
}
fireFliesGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3))
fireFliesGeometry.setAttribute('aScale', new THREE.BufferAttribute(scaleArray, 1))

const fireFlies = new THREE.Points(fireFliesGeometry, fireFliesMaterial)
scene.add(fireFlies)

/**d
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
camera.position.set(5, 3, -5)
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
renderer.setClearColor('#05000a')
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    fireFliesMaterial.uniforms.uTime.value = elapsedTime
    portalLightMaterial.uniforms.uTime.value = elapsedTime

    sphere.rotation.z = elapsedTime * 0.6
    sphere.material.needsUpdate = true;
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()