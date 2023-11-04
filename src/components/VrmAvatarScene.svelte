<script lang="ts">
	import { ANIMATIONS, MODELS } from '../consts';
	import { loadMixamoAnimation } from '../3d/mixamo';

	import * as THREE from 'three';

	import { GLTFLoader, type GLTF } from 'three/addons/loaders/GLTFLoader.js';
	import { VRM, VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';
	import { onMount } from 'svelte';

	// Props
	export const initialCameraPosition = new THREE.Vector3(0, 1.5, -2);
	export const animationPlaybackRate = 0.7;
	export const model = MODELS['danirukun-vrm-arkit'];

	// gltf and vrm
	let currentVrm: VRM;
	let currentAnimationUrl: string = ANIMATIONS['breathing-idle'];
	let currentMixer: THREE.AnimationMixer;
	let loadingProgressPercentage = 0;

	onMount(() => {
		const canvas = document.getElementById('avatar-canvas') as HTMLCanvasElement;
		const renderer = createRenderer(canvas);
		const camera = createCamera(canvas);
		const scene = createScene();
		const light = createLight();
		const platform = createPlatform();
		const lookAtTarget = createLookAtTarget(camera);
		const loader = createLoader();
		const clock = new THREE.Clock();

		scene.add(light);
		scene.add(platform);
		camera.add(lookAtTarget);

		loader.load(
			model,

			(gltf: GLTF) => {
				const vrm: VRM = gltf.userData.vrm;

				VRMUtils.removeUnnecessaryVertices(gltf.scene);
				VRMUtils.removeUnnecessaryJoints(gltf.scene);

				vrm.scene.traverse((obj) => {
					obj.frustumCulled = false;
				});

				scene.add(vrm.scene);
				currentVrm = vrm;

				if (vrm.lookAt) vrm.lookAt.target = lookAtTarget;

				if (currentAnimationUrl) {
					loadFBX(currentAnimationUrl);
				}
			},

			(progress) => {
				loadingProgressPercentage = 100.0 * (progress.loaded / progress.total);
				console.log('Loading model...', loadingProgressPercentage, '%');
			},

			(error) => console.error(error)
		);

		function animate() {
			requestAnimationFrame(animate);

			const deltaTime = clock.getDelta();

			if (currentMixer) {
				currentMixer.update(deltaTime);
			}

			if (currentVrm) {
				currentVrm.update(deltaTime);
			}

			renderer.render(scene, camera);
		}

		animate();

		window.addEventListener('mousemove', (event) => {
			let x = (event.clientX - 0.5 * canvas.clientWidth) / canvas.clientHeight;
			let y = (event.clientY - 0.5 * canvas.clientHeight) / canvas.clientHeight;

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

		async function loadFBX(animationUrl: string): Promise<void> {
			currentAnimationUrl = animationUrl;

			currentMixer = new THREE.AnimationMixer(currentVrm.scene);

			const clip = await loadMixamoAnimation(animationUrl, currentVrm);
			currentMixer.clipAction(clip).play();
			currentMixer.timeScale = animationPlaybackRate;
		}

		function createRenderer(canvas: HTMLCanvasElement): THREE.WebGLRenderer {
			const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
			renderer.setSize(canvas.clientWidth, canvas.clientHeight);
			renderer.setPixelRatio(window.devicePixelRatio);
			renderer.setClearColor(0x000000, 0.0);
			return renderer;
		}

		function createCamera(canvas: HTMLCanvasElement): THREE.PerspectiveCamera {
			const aspect = canvas.clientWidth / canvas.clientHeight;
			const camera = new THREE.PerspectiveCamera(30.0, aspect, 0.1, 20.0);
			camera.position.setX(initialCameraPosition.x);
			camera.position.setY(initialCameraPosition.y);
			camera.position.setZ(initialCameraPosition.z);
			camera.rotation.set(-3.0902286282432727, -0.001713949683298972, -3.141504540776254);
			return camera;
		}

		function createScene(): THREE.Scene {
			const scene = new THREE.Scene();
			return scene;
		}

		function createLight(): THREE.DirectionalLight {
			const light = new THREE.DirectionalLight(0xffffff, 1);
			light.position.set(1.0, 1.0, -1.0).normalize();
			return light;
		}

		function createPlatform(): THREE.Mesh {
			const platformGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.05, 32);
			const platformMaterial = new THREE.MeshBasicMaterial({ color: 0x2f2f2f });
			const platform = new THREE.Mesh(platformGeometry, platformMaterial);
			platform.position.y = -0.025;
			return platform;
		}

		function createLookAtTarget(camera: THREE.PerspectiveCamera): THREE.Object3D {
			const lookAtTarget = new THREE.Object3D();
			camera.add(lookAtTarget);
			return lookAtTarget;
		}

		function createLoader(): GLTFLoader {
			const loader = new GLTFLoader();
			loader.crossOrigin = 'anonymous';
			loader.register((parser) => {
				return new VRMLoaderPlugin(parser);
			});
			return loader;
		}
	});
</script>

<h2
	class="relative top-20 animate-pulse text-center text-2xl font-semibold text-inherit sm:top-72 sm:text-4xl"
	class:hidden={currentVrm}
>
	Loading... {loadingProgressPercentage.toFixed(0)} %
</h2>
<canvas id="avatar-canvas" class="block h-full w-full"></canvas>
