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
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({
        color: '#ff0000'
    })
)
object1.position.x = -2

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({
        color: '#ff0000'
    })
)

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({
        color: '#ff0000'
    })
)
object3.position.x = 2

scene.add(object1, object2, object3)

/**
 * raycaster
 */
const raycaster = new THREE.Raycaster()

// const rayOrigin = new THREE.Vector3(-3, 0, 0)
// const rayDirection = new THREE.Vector3(10, 0, 0)
// rayDirection.normalize()
// raycaster.set(rayOrigin, rayDirection)

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
 * mouse
 */
const mouse = new THREE.Vector2(-1, -1)
window.addEventListener('mousemove', e => {
    mouse.x = (e.clientX / sizes.width - 0.5) * 2
    mouse.y = -(e.clientY / sizes.height - 0.5) * 2
})

window.addEventListener('click', e => {
    if (currentIntersect) {
        switch (currentIntersect.object) {
            case object1:
                console.log('click object1')
                break;
            case object2:
                console.log('click object2')
                break;
            case object3:
                console.log('click object3')
                break;
        }
    }
})

/**
 * Animate
 */
const clock = new THREE.Clock()

const intersectTest = [object1, object2, object3]
let currentIntersect = null

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5
    object2.position.y = Math.sin(elapsedTime * 0.5) * 1.5
    object3.position.y = Math.sin(elapsedTime * 0.7) * 1.5

    raycaster.setFromCamera(mouse, camera)

    const intersects = raycaster.intersectObjects(intersectTest)

    for (let object of intersectTest) {
        object.material.color.set('#ff0000')
    }

    for (let intersect of intersects) {
        intersect.object.material.color.set('#0000ff')
    }

    if (intersects.length > 0) {
        if (currentIntersect === null) {
            intersects[0].object.scale.set(0.9, 0.9, 0.9)
        }
        currentIntersect = intersects[0]
    } else {
        if (currentIntersect) {
            currentIntersect.object.scale.set(1, 1, 1)
        }
        currentIntersect = null
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()