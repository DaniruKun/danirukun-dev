<script lang="ts">
	import { ANIMATIONS, MODELS } from '../consts';
	import { loadMixamoAnimation } from '../3d/mixamo';

	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
	import Stats from 'three/addons/libs/stats.module.js';

	import { GLTFLoader, type GLTF } from 'three/addons/loaders/GLTFLoader.js';
	import { VRM, VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';
	import { onMount } from 'svelte';

	import { Label } from '../components/ui/label';
	import * as Select from '../components/ui/select';

	// Props
	export const animationPlaybackRate = 0.7;
	export const model = MODELS['danirukun-vrm-arkit'];
	const animationsArray = Object.entries(ANIMATIONS);

	// gltf and vrm
	let currentVrm: VRM;
	let currentAnimationUrl = animationsArray[0][1];
	let vrmMeta: Object = {};
	$: vrmMetaArray = Object.entries(vrmMeta);

	let currentMixer: THREE.AnimationMixer;
	let loadingProgressPercentage = 0;
	let fbxLoader = () => {};
	let stats: Stats;

	$: if (currentAnimationUrl && currentVrm) {
		fbxLoader();
	}

	onMount(() => {
		const canvas = document.getElementById('avatar-canvas') as HTMLCanvasElement;
		const renderer = createRenderer(canvas);
		const camera = createCamera(canvas);
		camera.position.set(0, 0, -3);
		const scene = createScene();
		const light = createLight();
		const lookAtTarget = createLookAtTarget(camera);
		const loader = createLoader();
		const clock = new THREE.Clock();

		scene.add(light);

		const helperRoot = new THREE.Group();
		helperRoot.renderOrder = 10000;
		scene.add(helperRoot);

		// Add axes helper
		const axesHelper = new THREE.AxesHelper(5);
		scene.add(axesHelper);

		// Add grid helper
		const gridHelper = new THREE.GridHelper(10, 10);
		scene.add(gridHelper);

		const controls = new OrbitControls(camera, canvas);
		controls.target.set(0, 1, 0);
		controls.enableDamping = true;
		controls.dampingFactor = 0.5;
		controls.screenSpacePanning = true;
		controls.minDistance = 1;
		controls.maxDistance = 20;
		controls.maxPolarAngle = Math.PI / 2;
		controls.update();

		stats = new Stats();
		document.body.appendChild(stats.dom);

		loader.load(
			model,

			(gltf: GLTF) => {
				const vrm: VRM = gltf.userData.vrm;
				vrmMeta = gltf.userData.vrmMeta;

				if (currentVrm) {
					scene.remove(currentVrm.scene);

					VRMUtils.deepDispose(currentVrm.scene);
				}

				VRMUtils.removeUnnecessaryVertices(gltf.scene);
				VRMUtils.removeUnnecessaryJoints(gltf.scene);

				vrm.scene.traverse((obj) => {
					obj.frustumCulled = false;
				});

				window.currentVRM = currentVrm = vrm;
				scene.add(vrm.scene);

				if (vrm.lookAt) vrm.lookAt.target = lookAtTarget;

				fbxLoader = loadFBX;
			},

			(progress) => {
				loadingProgressPercentage = 100.0 * (progress.loaded / progress.total);
				console.log('Loading model...', loadingProgressPercentage, '%');
			},

			(error) => console.error(error)
		);

		loader.load(MODELS['airship'], (gltf: GLTF) => {
			const airship = gltf.scene;
			airship.position.set(0, -3.32, 19);
			airship.rotation.set(0, Math.PI, 0);
			airship.scale.set(0.02, 0.02, 0.02);
			scene.add(airship);
		});

		// animation loop
		function animate() {
			requestAnimationFrame(animate);

			const deltaTime = clock.getDelta();

			if (currentMixer) {
				currentMixer.update(deltaTime);
			}

			if (currentVrm) {
				currentVrm.update(deltaTime);
			}

			stats.begin();
			renderer.render(scene, camera);
			stats.end();
		}

		animate();

		window.addEventListener('resize', () => {
			let width = canvas.clientWidth;
			let height = canvas.clientHeight;
			renderer.setSize(width, height);
			camera.aspect = width / height;
			camera.updateProjectionMatrix();
		});

		async function loadFBX(): Promise<void> {
			console.log('Loading animation...', currentAnimationUrl);
			currentMixer = new THREE.AnimationMixer(currentVrm.scene);

			const clip = await loadMixamoAnimation(currentAnimationUrl, currentVrm);
			currentMixer.clipAction(clip).play();
			currentMixer.timeScale = animationPlaybackRate;
		}

		function createRenderer(canvas: HTMLCanvasElement): THREE.WebGLRenderer {
			const renderer = new THREE.WebGLRenderer({ canvas });
			renderer.setSize(canvas.clientWidth, canvas.clientHeight);
			renderer.setPixelRatio(window.devicePixelRatio);
			renderer.setClearColor(0xcccccc);
			return renderer;
		}

		function createCamera(canvas: HTMLCanvasElement): THREE.PerspectiveCamera {
			const aspect = canvas.clientWidth / canvas.clientHeight;
			const camera = new THREE.PerspectiveCamera(30.0, aspect, 0.1, 40.0);
			return camera;
		}

		function createScene(): THREE.Scene {
			const scene = new THREE.Scene();
			return scene;
		}

		function createLight(): THREE.AmbientLight {
			const light = new THREE.AmbientLight(0xffffff, 1);
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
				return new VRMLoaderPlugin(parser, { autoUpdateHumanBones: true });
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

<section class="relative h-[70vh] shadow-sm" id="container">
	<canvas id="avatar-canvas" class="block h-full w-full"></canvas>
</section>

<section class="mx-auto max-w-6xl bg-background py-8">
	<div class="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
		<div>
			<h1
				class="scroll-m-20 py-8 pb-8 text-center text-4xl font-extrabold tracking-tight lg:text-5xl"
			>
				ViennaJS November 2023 Demo
			</h1>
			<p class="leading-7 [&:not(:first-child)]:mt-6">
				This is a demo of a VRM model rendered with Three.js. The model is loaded using a VRM loader
				by Pixiv. Other assets are loaded using the built-in gLTF loader.
				Animations are loaded from Mixamo.
				If you experience performance issues, use a Chromium-based browser like Chrome or Edge.
			</p>
			<p class="leading-7 [&:not(:first-child)]:mt-6 mb-2">
				Airship by Poly by Google [CC-BY] via Poly Pizza
			</p>
			<Label for="animation">Animation</Label>
			<Select.Root onSelectedChange={({ value }) => (currentAnimationUrl = value)}>
				<Select.Trigger class="w-[180px]">
					<Select.Value placeholder={animationsArray[0][0]} />
				</Select.Trigger>
				<Select.Content id="animation">
					{#each animationsArray as animation}
						<Select.Item value={animation[1]}>{animation[0]}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>

		<div>
			<h1
				class="scroll-m-20 py-8 pb-8 text-center text-4xl font-extrabold tracking-tight lg:text-5xl"
			>
				Metadata
			</h1>
			<div class="mx-8 grid grid-cols-1 gap-4">
				<ul class="my-6 ml-6 list-disc [&>li]:mt-2">
					{#each vrmMetaArray as metadata}
						<li>
							<span class="font-semibold">{metadata[0]}:</span>
							{metadata[1]}
						</li>
					{/each}
				</ul>

				<!-- <Button href="/photography" class="rounded-sm text-center">Preview</Button> -->
			</div>
		</div>
	</div>
</section>
