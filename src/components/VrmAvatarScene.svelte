<script lang="ts">
	import { ANIMATIONS, MODELS } from '../consts';
	import { loadMixamoAnimation } from '../3d/mixamo';

	import * as THREE from 'three';

	import { GLTFLoader, type GLTF } from 'three/addons/loaders/GLTFLoader.js';
	import { VRM, VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import { onMount } from 'svelte';

	import animeNYCImg from '../../src/images/animenyc-small.jpg';
	import apexLegendsImg from '../../src/images/apex-legends.jpg';
	import inaRainyImg from '../../src/images/ina-wallpaper.jpg';

	// Props
	export const initialCameraPosition = new THREE.Vector3(8, 4, 8);
	export const animationPlaybackRate = 0.7;
	export const avatarModel = MODELS['danirukun-vrm-arkit'];

	// gltf and vrm
	let currentVrm: VRM;
	let currentAnimationUrl: string = ANIMATIONS['breathing-idle'];
	let currentMixer: THREE.AnimationMixer;
	let loadingProgressPercentage = 0;

	function createPoster(imgSrc: string, width: number, height: number, scale = 1) {
		const canvasAspect = height >= width ? height / width : width / height;
		const canvasWidth = scale;
		const canvasHeight = width >= height ? canvasWidth / canvasAspect : canvasWidth * canvasAspect;
		const canvasGeometry = new THREE.PlaneGeometry(canvasWidth, canvasHeight);
		const canvasTexture = new THREE.TextureLoader().load(imgSrc);
		const canvasMaterial = new THREE.MeshPhongMaterial({ map: canvasTexture });
		const canvasMesh = new THREE.Mesh(canvasGeometry, canvasMaterial);
		return canvasMesh;
	}

	onMount(() => {
		const canvas = document.getElementById('avatar-canvas') as HTMLCanvasElement;
		const renderer = createRenderer(canvas);
		const camera = createCamera(canvas);
		const scene = createScene();
		const light = createLight();
		const lookAtTarget = createLookAtTarget(camera);
		const loader = createLoader();
		const clock = new THREE.Clock();
		const controls = new OrbitControls(camera, canvas);

		controls.target.set(0, 0, 0);
		// Restrict controls to 90 degrees on each axis
		controls.minDistance = 1;
		controls.maxDistance = 5;
		controls.minAzimuthAngle = 0;
		controls.maxAzimuthAngle = Math.PI / 2;
		controls.minPolarAngle = 0;
		controls.maxPolarAngle = Math.PI / 2;
		controls.panSpeed = 0.5;
		controls.enableZoom = false;
		controls.update();

		// Add grid helper
		const gridHelper = new THREE.GridHelper(10, 10);
		// scene.add(gridHelper);

		// Add axis helper
		const axisHelper = new THREE.AxesHelper(5);
		// scene.add(axisHelper);

		// walls and floor

		const wallSize = 3;
		const wallColor = 0xd3d3d3;

		const walls = [
			{
				position: new THREE.Vector3(-wallSize / 2, 0, 0),
				rotation: new THREE.Euler(0, Math.PI / 2, 0)
			},
			{
				position: new THREE.Vector3(0, 0, -wallSize / 2),
				rotation: new THREE.Euler(0, 0, 0)
			}
		];

		const wallGeometry = new THREE.BoxGeometry(wallSize, wallSize, 0.1);
		const wallMaterial = new THREE.MeshPhongMaterial({ color: wallColor });

		const wallMeshes = walls.map((wall) => {
			const mesh = new THREE.Mesh(wallGeometry, wallMaterial);
			mesh.position.copy(wall.position);
			mesh.rotation.copy(wall.rotation);
			return mesh;
		});

		wallMeshes.forEach((wall) => {
			scene.add(wall);
		});

		const floorGeometry = new THREE.BoxGeometry(wallSize, 0.1, wallSize);
		const floorMaterial = new THREE.MeshPhongMaterial({ color: 0x6e6d6d });
		const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
		floorMesh.position.set(0, -(wallSize / 2), 0);
		scene.add(floorMesh);

		// lights

		light.position.set(0, 1.5, 0);
		scene.add(light);

		camera.add(lookAtTarget);

		const lightHelper = new THREE.PointLightHelper(light);
		// scene.add(lightHelper);

		// wall posters

		const animeNYCPoster = createPoster(
			animeNYCImg.src,
			animeNYCImg.width,
			animeNYCImg.height,
			0.5
		);
		animeNYCPoster.position.set(-0.75, 0.5, walls[1].position.z + 0.06);
		scene.add(animeNYCPoster);

		const apexPoster = createPoster(
			apexLegendsImg.src,
			apexLegendsImg.width,
			apexLegendsImg.height,
			0.7
		);
		apexPoster.position.set(walls[0].position.x + 0.06, 0.5, -0.6);
		apexPoster.rotation.set(0, Math.PI / 2, 0);
		scene.add(apexPoster);

		const inaPoster = createPoster(inaRainyImg.src, inaRainyImg.width, inaRainyImg.height, 0.8);
		inaPoster.position.set(0.9, 0.5, walls[1].position.z + 0.06);
		scene.add(inaPoster);

		// external gltf models

		loader.load(MODELS['painting-cow'], (gltf: GLTF) => {
			const painting = gltf.scene;
			painting.position.set(walls[0].position.x + 0.05, 0, 0.5);
			painting.rotation.set(0.05, -0.2, 0);
			scene.add(painting);
		});

		loader.load(MODELS['painting-mountains'], (gltf: GLTF) => {
			const painting = gltf.scene;
			painting.position.set(0, 0, walls[1].position.z + 0.05);
			painting.rotation.set(0, -Math.PI / 2, 0);
			painting.scale.set(0.08, 0.08, 0.08);
			scene.add(painting);
		});

		loader.load(MODELS['bed-single'], (gltf: GLTF) => {
			const bed = gltf.scene;
			bed.position.set(-(wallSize / 2) - 0.5, -wallSize / 2, 0.5);
			bed.rotation.set(0, Math.PI, 0);
			bed.scale.set(1.7, 1.7, 1.7);
			scene.add(bed);
		});

		loader.load(MODELS['katana'], (gltf: GLTF) => {
			const katana = gltf.scene;
			katana.position.set(walls[0].position.x + 0.15, -(wallSize / 2) - 0.05, 1);
			katana.rotation.set(0, 0, 0.1);
			katana.scale.set(0.1, 0.1, 0.1);
			scene.add(katana);
		});

		loader.load(MODELS['neco-arc-dakimakura'], (gltf: GLTF) => {
			const dakimakura = gltf.scene;
			dakimakura.position.set(-1, -1, 0);
			dakimakura.rotation.set(Math.PI / 2, Math.PI, Math.PI);
			dakimakura.scale.set(0.2, 0.2, 0.2);
			scene.add(dakimakura);
		});

		loader.load(MODELS['desk'], (gltf: GLTF) => {
			const desk = gltf.scene;
			const [{ children }] = desk.children;
			children[5].clear();
			children[6].clear();
			children[12].clear();

			desk.position.set(5.5, -wallSize / 2 + 0.05, -1.7);
			desk.rotation.set(0, Math.PI / 2, 0);
			desk.scale.set(1, 1, 1);
			scene.add(desk);
		});

		loader.load(MODELS['camera'], (gltf: GLTF) => {
			const camera = gltf.scene;
			camera.position.set(0, -0.54, -0.6);
			camera.rotation.set(0, Math.PI / 4, 0);
			camera.scale.set(0.03, 0.03, 0.03);
			scene.add(camera);
		});

		loader.load(MODELS['smol-ame-low-poly'], (gltf: GLTF) => {
			const ame = gltf.scene;
			ame.position.set(0, -0.55, -1);
			ame.rotation.set(0, 0, 0);
			ame.scale.set(0.2, 0.2, 0.2);
			scene.add(ame);
		});

		// VRM avatar

		loader.load(
			avatarModel,

			(gltf: GLTF) => {
				const vrm: VRM = gltf.userData.vrm;

				VRMUtils.removeUnnecessaryVertices(gltf.scene);
				VRMUtils.removeUnnecessaryJoints(gltf.scene);

				vrm.scene.traverse((obj) => {
					obj.frustumCulled = false;
				});
				vrm.scene.castShadow = true;

				vrm.scene.position.setY(-wallSize / 2 + 0.05);
				vrm.scene.rotation.set(0, Math.PI, 0);

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
			camera.rotation.set(0, 0, 0);
			return camera;
		}

		function createScene(): THREE.Scene {
			const scene = new THREE.Scene();
			return scene;
		}

		function createLight(): THREE.PointLight {
			const light = new THREE.PointLight(0xfdf6e1, 0.8);
			return light;
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
