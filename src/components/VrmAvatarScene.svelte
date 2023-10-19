<script lang="ts">
	import { ANIMATIONS, MODELS } from '../consts';
	import { loadMixamoAnimation } from '../3d/mixamo';

	import * as THREE from 'three';

	import { GLTFLoader, type GLTF } from 'three/addons/loaders/GLTFLoader.js';
	import { VRM, VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';
	import { onMount } from 'svelte';

	// Props
	export let debug = false;
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

			window.currentVrm = currentVrm;

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
		renderer.setSize(canvas.clientWidth, canvas.clientHeight);
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setClearAlpha(0.0);
		renderer.setClearColor(0x000000, 0.0);

		// camera
		const aspect = canvas.clientWidth / canvas.clientHeight;
		const camera = new THREE.PerspectiveCamera(30.0, aspect, 0.1, 20.0);

		// scene
		const scene = new THREE.Scene();

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
			let x = (event.clientX - 0.5 * canvas.clientWidth) / canvas.clientHeight;
			let y = (event.clientY - 0.5 * canvas.clientHeight) / canvas.clientHeight;

			// shift the camera with parallax
			camera.position.x = initialCameraPosition.x + 0.1 * x;
			camera.position.y = initialCameraPosition.y + -0.1 * y;

			lookAtTarget.position.x = 5.0 * x;
			lookAtTarget.position.y = -5.0 * y;
		});

		window.addEventListener('resize', () => {
			let width = canvas.clientWidth;
			let height = canvas.clientHeight;
			renderer.setSize(width, height);
			camera.aspect = width / height;
			camera.updateProjectionMatrix();
		});
	});
</script>

<h2
	class="relative top-20 animate-pulse text-center text-2xl font-semibold text-inherit sm:top-72 sm:text-6xl"
	class:hidden={currentVrm}
>
	Loading...
</h2>
<canvas id="avatar-canvas" class="block h-full w-full"></canvas>
