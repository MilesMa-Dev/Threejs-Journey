import './style.css'
import * as THREE from 'three'
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import {
    BasisTextureLoader
} from 'three/examples/jsm/loaders/BasisTextureLoader.js'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// fog
const fog = new THREE.Fog(0x262837, 1, 25)
scene.fog = fog

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
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
renderer.setClearColor(0x262837)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const basisTextureLoader = new BasisTextureLoader();
basisTextureLoader.setTranscoderPath( 'basis/' )
basisTextureLoader.detectSupport( renderer );

const doorColorTexture = textureLoader.load('/textures/door/color.jpg')

const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

const bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg')
const bricksAmbientOcclusionTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')
const bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg')
const bricksRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg')

const grassColorTexture = textureLoader.load('/textures/grass/color.jpg')
const grassAmbientOcclusionTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg')
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg')

/**
 * 草地贴图重复排列
 */
grassColorTexture.repeat.set(8, 8)
grassAmbientOcclusionTexture.repeat.set(8, 8)
grassNormalTexture.repeat.set(8, 8)
grassRoughnessTexture.repeat.set(8, 8)

grassColorTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapS = THREE.RepeatWrapping

grassColorTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping

/**
 * House
 */
const house = new THREE.Group()
scene.add(house)

const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({
        color: 0xac8e82,
        map: bricksColorTexture,
        aoMap: bricksAmbientOcclusionTexture,
        normalMap: bricksNormalTexture,
        roughnessMap: bricksRoughnessTexture
    })
)
walls.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2))
walls.position.y = 1.25

const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1, 4),
    new THREE.MeshStandardMaterial({
        color: 0xb35f45
    })
)
roof.position.y = 3
roof.rotation.y = Math.PI * 0.25

const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2, 100, 100),
    new THREE.MeshStandardMaterial({
        color: 0xaa7b7b,
        transparent: true,
        map: doorColorTexture,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.1,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture
    })
)
// aoMap 需要复制uv才能生效
door.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2))
door.position.y = 1
door.position.z = 2 + 0.01
house.add(walls, roof, door)

basisTextureLoader.load('/textures/door/color.basis', texture => {
    texture.encoding = THREE.sRGBEncoding;
    console.log(texture)
    door.material.map = texture;
    door.material.needsUpdate = true;
})

/**
 * bushes
 */
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({
    color: 0x89c854
})

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(0.8, 0.2, 2.2)

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.4, 0.1, 2.1)

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(-0.8, 0.1, 2.2)

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(-1, 0.05, 2.6)

house.add(bush1, bush2, bush3, bush4)

/**
 * graves
 */
const graves = new THREE.Group()
scene.add(graves)

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({
    color: 0xb2b6b1
})
for (let i = 0; i < 50; i++) {
    const grave = new THREE.Mesh(graveGeometry, graveMaterial)

    const randomAngle = Math.random() * Math.PI * 2
    const randomRadius = 3 + Math.random() * 6

    grave.position.x = Math.cos(randomAngle) * randomRadius
    grave.position.z = Math.sin(randomAngle) * randomRadius
    grave.position.y = 0.3

    grave.rotation.z = (Math.random() - 0.5) * 0.4
    grave.rotation.y = (Math.random() - 0.5) * 0.4

    grave.castShadow = true
    graves.add(grave)
}

// pointLight
const doorLight = new THREE.PointLight(0xff7d46, 1, 7)
doorLight.position.set(0, 2.2, 2.7)
scene.add(doorLight)

/**
 * Ghosts
 */
const ghost1 = new THREE.PointLight(0xff00ff, 2, 3)
const ghost2 = new THREE.PointLight(0xff00ff, 2, 3)
const ghost3 = new THREE.PointLight(0xff00ff, 2, 3)

scene.add(ghost1, ghost2, ghost3)

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        color: '#a9c388',
        map: grassColorTexture,
        aoMap: grassAmbientOcclusionTexture,
        normalMap: grassNormalTexture,
        roughnessMap: grassRoughnessTexture
    })
)
floor.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2))
floor.rotation.x = -Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12)
moonLight.position.set(4, 5, -2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(-5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(-5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(-5).max(5).step(0.001)
scene.add(moonLight)

/**
 * shadows
 */
walls.castShadow = true
moonLight.castShadow = true
doorLight.castShadow = true

ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

bush1.castShadow = true
bush2.castShadow = true
bush3.castShadow = true
bush4.castShadow = true

floor.receiveShadow = true

/**
 * 优化 shadow显示
 */
moonLight.shadow.mapSize.width = 256
moonLight.shadow.mapSize.height = 256
moonLight.shadow.camera.far = 15

doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.far = 7

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 7

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 7

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 7

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
 * Alpha video
 */
const video = document.getElementById('video');
video.src = "/meteor.mov";
// video.play();
video.onended = () => {
    video.play();
}
document.body.onclick = () => {
    video.play();
}
const videoTexture = new THREE.VideoTexture(video);
videoTexture.minFilter = THREE.LinearFilter;
videoTexture.magFilter = THREE.LinearFilter;
videoTexture.format = THREE.RGBAFormat;

// shader stuff
const uniforms = {
    time: {
        type: "f",
        value: 1.0
    },
    texture: {
        type: "sampler2D",
        value: videoTexture
    }
};
const videoMaterial = new THREE.RawShaderMaterial({
    uniforms: uniforms,
    vertexShader: `uniform mat4 projectionMatrix;
    uniform mat4 modelViewMatrix;
    attribute vec3 position;
    attribute vec2 uv;
    varying vec2 vUv;
    
    void main()
    {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,
    fragmentShader: `#ifdef GL_ES
        precision highp float;
        #endif

        uniform float time;
        uniform sampler2D texture;
        varying vec2 vUv;

        void main( void ) {
                gl_FragColor = vec4(
                    texture2D(texture, vec2(vUv.x/2., vUv.y)).rgb,
                    texture2D(texture, vec2(0.5+vUv.x/2., vUv.y)).r
                    );
        }`,
    transparent: true,
    side: THREE.DoubleSide
});

const videoGeometry = new THREE.PlaneBufferGeometry(2, 2);
const videoMesh = new THREE.Mesh(videoGeometry, videoMaterial);
videoMesh.position.y = 4.5;
videoMesh.scale.setScalar(0.8);
scene.add(videoMesh);

/**
 * Animate
 */
const clock = new THREE.Clock()
let deltaTime = 0;
const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    deltaTime = elapsedTime - deltaTime;
    deltaTime = elapsedTime;

    // Update Ghosts
    const ghostAngle1 = elapsedTime * 0.5
    ghost1.position.x = Math.cos(ghostAngle1) * 4
    ghost1.position.z = Math.sin(ghostAngle1) * 4
    ghost1.position.y = Math.sin(elapsedTime * 3)

    const ghostAngle2 = -elapsedTime * 0.32
    ghost2.position.x = Math.cos(ghostAngle2) * 5
    ghost2.position.z = Math.sin(ghostAngle2) * 5
    ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)

    const ghostAngle3 = -elapsedTime * 0.18
    ghost3.position.x = Math.cos(ghostAngle3) * (7 + Math.sin(elapsedTime * 0.32))
    ghost3.position.z = Math.sin(ghostAngle3) * (7 + Math.sin(elapsedTime * 0.5))
    ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)

    // update video
    uniforms.time.value += (deltaTime ? deltaTime / 1000 : 0.05);
    videoMesh.rotation.y = elapsedTime
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()