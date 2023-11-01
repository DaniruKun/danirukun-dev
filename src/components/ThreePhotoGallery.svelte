<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';
	import { TEXTURES } from '../consts';

	import Lucy from '../../src/images/cosplay/COMICSSALON23-12.jpg';

	function createScene(canvas: HTMLCanvasElement) {
		const renderer = new THREE.WebGLRenderer({ canvas });
		const scene = new THREE.Scene();
		const aspect = canvas.clientWidth / canvas.clientHeight;
		renderer.setPixelRatio(window.devicePixelRatio);
		const camera = new THREE.PerspectiveCamera(96, aspect, 0.1, 1000);

		const wallGeometry = new THREE.BoxGeometry(2, 2, 0.1);
		const wallMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });

		const specialMaterial = new THREE.MeshBasicMaterial({ color: 0xddddff });

		const wall1 = new THREE.Mesh(wallGeometry, specialMaterial);
		const wall2 = new THREE.Mesh(wallGeometry, wallMaterial);
		const wall3 = new THREE.Mesh(wallGeometry, wallMaterial);
		const wall4 = new THREE.Mesh(wallGeometry, wallMaterial);

		wall1.position.set(0, 0.5, -1);
		wall2.position.set(0, 0.5, 1);
		wall3.position.set(-1, 0.5, 0);
		wall3.rotation.y = Math.PI / 2;
		wall4.position.set(1, 0.5, 0);
		wall4.rotation.y = Math.PI / 2;

		const canvasAspect = Lucy.height / Lucy.width;
		const canvasWidth = 1;
		const canvasHeight = canvasWidth * canvasAspect;
		const canvasGeometry = new THREE.PlaneGeometry(canvasWidth, canvasHeight);
		const canvasTexture = new THREE.TextureLoader().load(Lucy.src);
		const canvasMaterial = new THREE.MeshBasicMaterial({ map: canvasTexture });
		const canvasMesh = new THREE.Mesh(canvasGeometry, canvasMaterial);
		canvasMesh.position.set(0, 0.5, -0.9);
		scene.add(canvasMesh);

		const ceiling = new THREE.Mesh(wallGeometry, wallMaterial);
		ceiling.position.set(0, 1.5, 0);
		ceiling.rotation.x = Math.PI / 2;
		scene.add(ceiling);

		scene.add(wall1, wall2, wall3, wall4);

		const light = new THREE.PointLight(0xffffff, 1, 100);
		light.position.set(0, 1.5, 0);
		scene.add(light);

		// helpers
		const gridHelper = new THREE.GridHelper(10, 10);
		const axesHelper = new THREE.AxesHelper(5);
		const lightHelper = new THREE.PointLightHelper(light);
		// scene.add(gridHelper, axesHelper, lightHelper);

		const controls = new FirstPersonControls(camera, renderer.domElement);
		controls.movementSpeed = 1;
		controls.lookSpeed = 0.25;

		const clock = new THREE.Clock();

		// floor
		const floorTexture = new THREE.TextureLoader().load(TEXTURES['light-wood-laminate']);
		floorTexture.wrapS = THREE.RepeatWrapping;
		floorTexture.wrapT = THREE.RepeatWrapping;
		floorTexture.repeat.set(5, 5);
		const floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture });
		const floorGeometry = new THREE.PlaneGeometry(5, 5);
		const floor = new THREE.Mesh(floorGeometry, floorMaterial);
		floor.rotation.x = -Math.PI / 2;
		floor.position.y = -0.5;
		scene.add(floor);

		return { renderer, scene, camera, controls, clock };
	}

	function resizeRendererToDisplaySize(renderer: THREE.WebGLRenderer) {
		const canvas = renderer.domElement;
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;
		const needResize = canvas.width !== width || canvas.height !== height;
		if (needResize) {
			renderer.setSize(width, height, false);
		}
		return needResize;
	}

	// main animation loop
	function animate(
		renderer: THREE.WebGLRenderer,
		scene: THREE.Scene,
		camera: THREE.PerspectiveCamera,
		controls: FirstPersonControls,
		clock: THREE.Clock
	) {
		requestAnimationFrame(() => animate(renderer, scene, camera, controls, clock));
		controls.update(clock.getDelta());
		if (resizeRendererToDisplaySize(renderer)) {
			const canvas = renderer.domElement;
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();
		}
		renderer.render(scene, camera);
	}

	onMount(() => {
		const canvas = document.querySelector('#photo-gallery') as HTMLCanvasElement;
		const { renderer, scene, camera, controls, clock } = createScene(canvas);
		animate(renderer, scene, camera, controls, clock);
	});
</script>

<canvas id="photo-gallery" class="block h-full w-full"></canvas>
