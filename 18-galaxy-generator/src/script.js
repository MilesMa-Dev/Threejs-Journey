import './style.css'
import * as THREE from 'three'
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// loader
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/textures/particles/1.png')

// Scene
const scene = new THREE.Scene()

/**
 * Galaxy
 */
const parameters = {}
parameters.count = 50000 // 粒子数量
parameters.size = 0.012 // 粒子尺寸
parameters.radius = 5 // 旋臂半径
parameters.branches = 4 // 旋臂数
parameters.spin = 1 // 旋转参数
parameters.randomness = 0.2 // 粒子分散随机
parameters.randomnessPower = 3 // 随机指数值，越大中间得粒子越密集
parameters.insideColor = '#ff6030' // 中心颜色
parameters.outsideColor = '#1b3984' // 外部颜色

parameters.spinPower = 0 // 弯曲指数测试
parameters.zPower = 1 // z轴指数测试

parameters.flow = false // 流动
parameters.transform = false // 变换

let geometry = null
let material = null
let galaxy = null

let insideColor = new THREE.Color(parameters.insideColor)
let outsideColor = new THREE.Color(parameters.outsideColor)

const positions = new Float32Array(parameters.count * 3)
const colors = new Float32Array(parameters.count * 3)

const genarateGalaxy = () => {
    if (galaxy != null) {
        geometry.dispose()
        material.dispose()
        scene.remove(galaxy)
    }

    geometry = new THREE.BufferGeometry()
    material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        alphaMap: particleTexture,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    })

    for (let i = 0; i < parameters.count; i++) {
        setParticle(positions, colors, i, insideColor, outsideColor)
    }

    insideColor = new THREE.Color(parameters.insideColor)
    outsideColor = new THREE.Color(parameters.outsideColor)

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    galaxy = new THREE.Points(geometry, material)
    scene.add(galaxy)
}

const setParticle = (positions, colors, i, insideColor, outsideColor) => {
    const i3 = i * 3
    // 粒子距圆心的距离
    const radius = Math.random() * parameters.radius
    // 旋臂上的粒子旋转角度，与距圆心距离成正比
    // const spinRadius = radius * parameters.spin
    const spinRadius = radius * parameters.spin * Math.pow(Math.sin(radius), parameters.spinPower)
    // const spinRadius = radius * parameters.spin * Math.cos(Math.sin(radius)*parameters.spinPower) 
    // 旋臂的角度
    const branchRadius = (i % parameters.branches) / parameters.branches * Math.PI * 2

    /**
     * 粒子由旋臂中心向外扩散
     * 根据小数的指数越大，数值越接近于零的特性，制造出旋臂中心粒子多外部粒子少的效果
     */
    const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? -1 : 1) * parameters.randomness * radius
    const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? -1 : 1) * parameters.randomness * radius
    const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? -1 : 1) * parameters.randomness * radius

    positions[i3] = radius * Math.cos(branchRadius + spinRadius) + randomX
    positions[i3 + 1] = randomY
    positions[i3 + 2] = radius * Math.sin(branchRadius * parameters.zPower + spinRadius) + randomZ

    // 旋臂上的颜色过渡
    const mixColor = insideColor.clone()
    mixColor.lerp(outsideColor, radius / parameters.radius)
    colors[i3] = mixColor.r
    colors[i3 + 1] = mixColor.g
    colors[i3 + 2] = mixColor.b
}

genarateGalaxy()

gui.add(parameters, 'count').min(100).max(500000).step(100).onFinishChange(genarateGalaxy)
gui.add(parameters, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(genarateGalaxy)
gui.add(parameters, 'radius').min(1).max(20).step(1).onFinishChange(genarateGalaxy)
gui.add(parameters, 'branches').min(2).max(20).step(1).onChange(genarateGalaxy)
gui.add(parameters, 'spin').min(-5).max(5).step(0.001).onFinishChange(genarateGalaxy)
gui.add(parameters, 'randomness').min(0).max(1).step(0.001).onFinishChange(genarateGalaxy)
gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(genarateGalaxy)
gui.add(parameters, 'spinPower').min(0).max(100).step(1).onChange(genarateGalaxy)
gui.add(parameters, 'zPower').min(1).max(99).step(1).onChange(genarateGalaxy)
gui.add(parameters, 'flow')
gui.add(parameters, 'transform')


gui.addColor(parameters, 'insideColor').onFinishChange(genarateGalaxy)
gui.addColor(parameters, 'outsideColor').onFinishChange(genarateGalaxy)

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
camera.position.x = 3
camera.position.y = 3
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

let spinPowerFix = 1;
const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    //Update galaxy
    if (parameters.flow) {
        for (let i = 0; i < parameters.count; i++) {
            const i3 = i * 3

            const x = galaxy.geometry.attributes.position.array[i3]
            galaxy.geometry.attributes.position.array[i3 + 1] += Math.sin(elapsedTime * 2 + x) * 0.3 * 0.02
        }
        galaxy.geometry.attributes.position.needsUpdate = true
    }

    if (parameters.transform) {
        parameters.spinPower += spinPowerFix;
        if (parameters.spinPower == 100 || parameters.spinPower == 0) {
            spinPowerFix *= -1
        }
        console.log(parameters.spinPower)
        for (let i = 0; i < parameters.count; i++) {
            setParticle(positions, colors, i, insideColor, outsideColor)
        }
        galaxy.geometry.attributes.position.needsUpdate = true
        galaxy.geometry.attributes.color.needsUpdate = true
    }
    // galaxy.rotation.y = elapsedTime * 0.5

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()