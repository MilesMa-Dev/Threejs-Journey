import './style.css'
import * as THREE from 'three'
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js'
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
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/textures/particles/2.png')

/**
 * sphere geometry
 */
// const particleGeometry = new THREE.SphereGeometry(1, 32, 32)

/**
 * custom geometry
 */
const particleGeometry = new THREE.BufferGeometry()
const count = 5000

const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)

for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10
    colors[i] = Math.random()
}
particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

const particleMaterial = new THREE.PointsMaterial({
    color: 0xff88cc,
    size: 0.1,
    sizeAttenuation: true,
    transparent: true,
    alphaMap: particleTexture
})
// particleMaterial.alphaTest = 0.01
// particleMaterial.depthTest = false
particleMaterial.depthWrite = false
particleMaterial.blending = THREE.AdditiveBlending
particleMaterial.vertexColors = true

const particles = new THREE.Points(particleGeometry, particleMaterial)
scene.add(particles)

gui.remember(particleMaterial);
gui.add(particleMaterial, 'blending', ['normal', 'additive']).onChange(value => {
    if (value == 'normal') {
        particleMaterial.blending = THREE.NormalBlending
    } else if (value == 'additive') {
        particleMaterial.blending = THREE.AdditiveBlending
    }
    particleMaterial.needsUpdate = true
}).name('混合模式')

gui.addColor(particleMaterial, 'color').name('叠加色')
/**
 * Test cube
 */
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial()
// )
// scene.add(cube)

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
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

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update particles
    // particles.rotation.y = elapsedTime

    for (let i=0; i<count; i++) {
        const i3 = i * 3

        const x = particles.geometry.attributes.position.array[i3]
        particles.geometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x) * 0.3
    }
    particles.geometry.attributes.position.needsUpdate = true

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()