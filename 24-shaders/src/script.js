import './style.css'
import * as THREE from 'three'
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import vertexShader from './shaders/vertexShader.glsl'
import fragmentShader from './shaders/fragmentShader.glsl'
import vertexShader2 from './shaders/vertexShader2.glsl'
import fragmentShader2 from './shaders/fragmentShader2.glsl'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
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
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
// const flagTexture = textureLoader.load('textures/flag-french.jpg')
const flagTexture = textureLoader.load('textures/boom.jpg')

/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneGeometry(1, 1, 32, 32)

const count = geometry.attributes.position.count
const randoms = new Float32Array(count)

for (let i = 0; i < count; i++) {
    randoms[i] = Math.random()
}
geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))

// Material
// const material = new THREE.RawShaderMaterial({
//     vertexShader: vertexShader,
//     fragmentShader: fragmentShader,
//     side: THREE.DoubleSide,
//     uniforms: {
//         uFrequency: {value: new THREE.Vector2(10.0, 5.0)},
//         uTime: {value: 0.0},
//         uColor: {value: new THREE.Color('orange')},
//         uTexture: {value: flagTexture}
//     }
// })

// const material = new THREE.RawShaderMaterial({
//     vertexShader: vertexShader,
//     fragmentShader: fragmentShader,
//     side: THREE.DoubleSide,
//     uniforms: {
//         uAlpha: {
//             value: 1
//         },
//         uAngle: {
//             value: .05
//         },
//         uProgress: {
//             value: 0
//         },
//         uTime: {
//             value: 0
//         },
//         tMap: {
//             value: flagTexture
//         }
//     },
//     transparent: true,
//     cullFace: false
// })

// const i = renderer.isWebgl2 || renderer.extensions[`OES_texture_${r === THREE.FLOAT ? "" : "half_"}float_linear`] ? THREE.LINEAR : THREE.NEAREST;
let mouse = new THREE.Vector2(0, 0)
let velocity = new THREE.Vector2(0.0, 0.0)
const material = new THREE.RawShaderMaterial({
    vertexShader: vertexShader2,
    fragmentShader: fragmentShader2,
    side: THREE.DoubleSide,
    uniforms: {
        tMap: {
            value: flagTexture
        },
        uFalloff: {
            value: .5 * .3
        },
        uAlpha: {
            value: 1
        },
        uDissipation: {
            value: .9
        },
        uAspect: {
            value: sizes.width / sizes.height
        },
        uMouse: {
            value: mouse
        },
        uVelocity: {
            value: velocity
        },
        uTime: {
            value: 0
        }
    },
    transparent: true,
    depthTest: !1
})

gui.add(material.uniforms.uMouse.value, 'x').min(-1).max(1).name('uMouseX')
gui.add(material.uniforms.uMouse.value, 'y').min(-1).max(1).name('uMouseY')
gui.add(material.uniforms.uDissipation, 'value').min(0.0).max(1).name('uMouseuDissipationY')

let lastTime;
let mouseLast = new THREE.Vector2(0, 0);
const ontouchmove = e => {
    mouse.set(e.clientX / sizes.width, 1 - e.clientY / sizes.height)

    lastTime || (lastTime = performance.now(),
    mouseLast.set(e.clientX, e.clientY));
    const o = e.clientX - mouseLast.x
      , a = e.clientY - mouseLast.y;
    mouseLast.set(e.clientX, e.clientY);
    const h = performance.now()
      , c = Math.max(14, h - lastTime);
    lastTime = h;
    velocity.x = o / c;
    velocity.y = a / c;
    velocity.needsUpdate = !0;
}

window.addEventListener('mousemove', ontouchmove)
// Mesh
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height

    velocity.lerp(velocity, .1)

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
camera.position.set(0.25, -0.25, 1)
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
 * postprocessing
 */
const composer = new EffectComposer( renderer );
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass)
/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    material.uniforms.uFalloff.value = .1
    material.uniforms.uTime.value = elapsedTime

    // material.uniforms.uVelocity.lerp(material.uniforms.uVelocity, .1),
    composer.render(clock.getDelta())
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()