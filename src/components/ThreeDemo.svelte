<script lang="ts">
	import { MODELS } from '../consts';

	import * as THREE from 'three';

	import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import { VRM, VRMHumanoid, VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';
	import { onMount } from 'svelte';

	export const debug = false;
	let vrmModelRotationSpeed = 0.001; // radians per frame

	onMount(() => {
		// renderer
		const renderer = new THREE.WebGLRenderer();
		let width = window.innerWidth;
		let height = window.innerHeight;
		renderer.setSize(width, height);
		renderer.setPixelRatio(window.devicePixelRatio);

		const viewer = document.getElementById('three-demo') as HTMLElement;
		viewer.appendChild(renderer.domElement);

		// camera
		const camera = new THREE.PerspectiveCamera(
			30.0,
			window.innerWidth / window.innerHeight,
			0.1,
			20.0
		);

		// camera controls
		const controls = new OrbitControls(camera, renderer.domElement);
		controls.screenSpacePanning = true;
		controls.target.set(0.0, 1.0, 0.0);
		controls.update();

		// scene
		const scene = new THREE.Scene();
		scene.background = new THREE.Color(0xd3d3d3);

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

		// gltf and vrm
		let currentVrm: VRM;
		const loader = new GLTFLoader();
		loader.crossOrigin = 'anonymous';

		loader.register((parser) => {
			return new VRMLoaderPlugin(parser);
		});

		camera.position.set(-0.0015098996409651743, 1.5165222858646006, -1.869318976427722);
		camera.rotation.set(-3.0902286282432727, -0.001713949683298972, -3.141504540776254);

		loader.load(
			MODELS['danirukun-vrm-arkit'],

			(gltf) => {
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

				let humanoid = currentVrm.humanoid as VRMHumanoid;

				// Get rid of T-Pose
				humanoid.getNormalizedBoneNode('leftUpperArm')!.rotation.z = 0.4 * Math.PI;
				humanoid.getNormalizedBoneNode('rightUpperArm')!.rotation.z = -0.4 * Math.PI;
				humanoid.getNormalizedBoneNode('leftLowerArm')!.rotation.z = 0.05 * Math.PI;
				humanoid.getNormalizedBoneNode('rightLowerArm')!.rotation.z = -0.05 * Math.PI;
			},

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

		// animate
		const clock = new THREE.Clock();

		function animate() {
			requestAnimationFrame(animate);

			const deltaTime = clock.getDelta();

			if (currentVrm) {
				// update vrm
				currentVrm.scene.rotateY(vrmModelRotationSpeed);
				currentVrm.update(deltaTime);
			}

			renderer.render(scene, camera);
		}

		animate();

		// mouse listener
		window.addEventListener('mousemove', (event) => {
			lookAtTarget.position.x =
				10.0 * ((event.clientX - 0.5 * window.innerWidth) / window.innerHeight);
			lookAtTarget.position.y =
				-10.0 * ((event.clientY - 0.5 * window.innerHeight) / window.innerHeight);
		});

		window.addEventListener('resize', () => {
			width = window.innerWidth;
			height = window.innerHeight;
			renderer.setSize(width, height);
			camera.aspect = width / height;
			camera.updateProjectionMatrix();
		});
	});
</script>

<div id="three-demo" class="min-h-screen"></div>
