<script lang="ts">
	import { ANIMATIONS, MODELS } from '../consts';
	import { loadMixamoAnimation } from '../3d/mixamo';

	import * as THREE from 'three';

	import { GLTFLoader, type GLTF } from 'three/addons/loaders/GLTFLoader.js';
	import { VRM, VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';
	import { onMount } from 'svelte';

	// Props
	export const debug = false;
	export const initialCameraPosition = new THREE.Vector3(0, 1.5, -2);
	export const sceneBg = new THREE.Color(0xd3d3d3);
	export const animationPlaybackRate = 0.7;

	// gltf and vrm
	let currentVrm: VRM;
	let currentAnimationUrl: string = ANIMATIONS['breathing-idle'];
	let currentMixer: THREE.AnimationMixer;

	onMount(() => {
		// callbacks
		function gltfLoaded(gltf: GLTF) {
			const vrm: VRM = gltf.userData.vrm;

			// calling these functions greatly improves the performance
			VRMUtils.removeUnnecessaryVertices(gltf.scene);
			VRMUtils.removeUnnecessaryJoints(gltf.scene);

			// Disable frustum culling
			vrm.scene.traverse((obj) => {
				obj.frustumCulled = false;
			});

			scene.add(vrm.scene);
			currentVrm = vrm;

			if (vrm.lookAt) vrm.lookAt.target = lookAtTarget;

			if (currentAnimationUrl) {
				loadFBX(currentAnimationUrl);
			}
			// VRMUtils.rotateVRM0(vrm);
		}

		// mixamo animation
		async function loadFBX(animationUrl: string): Promise<void> {
			currentAnimationUrl = animationUrl;

			// create AnimationMixer for VRM
			currentMixer = new THREE.AnimationMixer(currentVrm.scene);

			// Load animation
			const clip = await loadMixamoAnimation(animationUrl, currentVrm);
			// Apply the loaded animation to mixer and play
			currentMixer.clipAction(clip).play();
			currentMixer.timeScale = animationPlaybackRate;
		}

		// renderer
		const canvas = document.getElementById('avatar-canvas') as HTMLCanvasElement;
		const renderer = new THREE.WebGLRenderer({ canvas });
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setClearAlpha(0.0);
		renderer.setClearColor(0x000000, 0.0);

		const viewer = document.getElementById('avatar-container') as HTMLElement;

		// camera
		const camera = new THREE.PerspectiveCamera(
			30.0,
			window.innerWidth / window.innerHeight,
			0.1,
			20.0
		);

		// scene
		const scene = new THREE.Scene();
		// scene.background = sceneBg;

		// light
		const light = new THREE.DirectionalLight(0xffffff, 1);
		light.position.set(1.0, 1.0, -1.0).normalize();
		scene.add(light);

		// platform for the model
		const platformGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.05, 32);
		const platformMaterial = new THREE.MeshBasicMaterial({ color: 0x2f2f2f });
		const platform = new THREE.Mesh(platformGeometry, platformMaterial);
		platform.position.y = -0.025;
		scene.add(platform);

		// lookat target
		const lookAtTarget = new THREE.Object3D();
		camera.add(lookAtTarget);

		const loader = new GLTFLoader();
		loader.crossOrigin = 'anonymous';

		loader.register((parser) => {
			return new VRMLoaderPlugin(parser);
		});

		// Portrait look
		camera.position.setX(initialCameraPosition.x);
		camera.position.setY(initialCameraPosition.y);
		camera.position.setZ(initialCameraPosition.z);
		camera.rotation.set(-3.0902286282432727, -0.001713949683298972, -3.141504540776254);

		loader.load(
			MODELS['danirukun-vrm-arkit'],

			gltfLoaded,

			(progress) =>
				console.log('Loading model...', 100.0 * (progress.loaded / progress.total), '%'),

			(error) => console.error(error)
		);

		// helpers
		const gridHelper = new THREE.GridHelper(10, 10);
		const axesHelper = new THREE.AxesHelper(5);

		if (debug) {
			scene.add(gridHelper);
			scene.add(axesHelper);
		}

		const clock = new THREE.Clock();

		function animate() {
			requestAnimationFrame(animate);

			const deltaTime = clock.getDelta();

			if (currentMixer) {
				// update the animation
				currentMixer.update(deltaTime);
			}

			if (currentVrm) {
				// update vrm
				// currentVrm.scene.rotateY(vrmModelRotationSpeed);
				currentVrm.update(deltaTime);
			}

			renderer.render(scene, camera);
		}

		animate();

		// window listeners
		window.addEventListener('mousemove', (event) => {
			// shift the camera with parallax
			camera.position.x =
				initialCameraPosition.x +
				0.1 * ((event.clientX - 0.5 * window.innerWidth) / window.innerHeight);
			camera.position.y =
				initialCameraPosition.y +
				-0.1 * ((event.clientY - 0.5 * window.innerHeight) / window.innerHeight);
		});

		window.addEventListener('resize', () => {
			let width = window.innerWidth;
			let height = window.innerHeight;
			renderer.setSize(width, height);
			camera.aspect = width / height;
			camera.updateProjectionMatrix();
		});
	});
</script>

<h2
	class="relative top-72 animate-pulse text-center text-6xl font-semibold text-inherit"
	class:hidden={currentVrm}
>
	Loading...
</h2>
<canvas id="avatar-canvas"></canvas>
