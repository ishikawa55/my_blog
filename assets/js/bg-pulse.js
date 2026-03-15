// assets/js/bg-pulse.js
// import * as THREE from 'https://unpkg.com/three@0.150.0/build/three.module.js';
import * as THREE from 'https://cdn.skypack.dev/three@0.150.0';

let camera, scene, renderer, particles;
let mouseX = 0, mouseY = 0;

init();
animate();

function init() {
    const container = document.getElementById('three-bg');
    if (!container) return; // コンテナがないページでは動作させない

    // カメラ設定（エディトリアルな奥行きを出す）
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 1000;

    scene = new THREE.Scene();

    // パーティクル（データの粒）の作成
    const numParticles = 1000;
    const positions = new Float32Array(numParticles * 3);
    const colors = new Float32Array(numParticles * 3);
    const color = new THREE.Color(0x6a1b9a); // アクセントカラーの紫色

    for (let i = 0; i < numParticles; i++) {
        // XY平面に広がる波のような配置
        positions[i * 3] = Math.random() * 2000 - 1000;
        positions[i * 3 + 1] = Math.random() * 2000 - 1000;
        positions[i * 3 + 2] = Math.random() * 2000 - 1000;

        color.toArray(colors, i * 3);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // マテリアル設定（小さく、繊細な点に）
    const material = new THREE.PointsMaterial({ size: 3, vertexColors: true, depthTest: false, transparent: true, opacity: 0.6 });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // レンダラー設定
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // alpha: true で白背景に馴染ませる
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // イベントリスナー
    document.addEventListener('mousemove', onDocumentMouseMove);
    window.addEventListener('resize', onWindowResize);
}

// マウスの動きに反応させる
function onDocumentMouseMove(event) {
    mouseX = event.clientX - window.innerWidth / 2;
    mouseY = event.clientY - window.innerHeight / 2;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// アニメーション（データの鼓動）
function animate() {
    requestAnimationFrame(animate);

    // パーティクルを少しずつ回転させる
    particles.rotation.x += 0.0001;
    particles.rotation.y += 0.0002;

    // マウスの動きに合わせてカメラを動かす
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}
