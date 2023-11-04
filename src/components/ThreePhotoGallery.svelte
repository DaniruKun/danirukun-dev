<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
	import { TEXTURES } from '../consts';

	import LoveLive from '../../src/images/cosplay/COMICSSALON23-12.jpg';
	import Lucy from '../../src/images/cosplay/COMICSSALON23-14.jpg';
	import Reg from '../../src/images/cosplay/ANIMAGIC23-REG.jpeg';
	import EmanumArknights from '../../src/images/cosplay/ANINITE23-EMANUM.jpeg';

	let moveForward = false;
	let moveBackward = false;
	let moveLeft = false;
	let moveRight = false;
	let canJump = false;
	const velocity = new THREE.Vector3();
	const direction = new THREE.Vector3();
	let raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10);
	let prevTime = performance.now();

	function create2DExhibit(imgSrc: string, width: number, height: number, scale = 1) {
		const canvasAspect = height >= width ? height / width : width / height;
		const canvasWidth = scale;
		const canvasHeight = canvasWidth * canvasAspect;
		const canvasGeometry = new THREE.PlaneGeometry(canvasWidth, canvasHeight);
		const canvasTexture = new THREE.TextureLoader().load(imgSrc);
		const canvasMaterial = new THREE.MeshPhongMaterial({ map: canvasTexture });
		const canvasMesh = new THREE.Mesh(canvasGeometry, canvasMaterial);
		return canvasMesh;
	}

	function createFloor(texture = TEXTURES['light-wood-laminate']) {
		const floorTexture = new THREE.TextureLoader().load(texture);
		floorTexture.wrapS = THREE.RepeatWrapping;
		floorTexture.wrapT = THREE.RepeatWrapping;
		floorTexture.repeat.set(15, 15);
		const floorMaterial = new THREE.MeshPhongMaterial({ map: floorTexture });
		const floorGeometry = new THREE.PlaneGeometry(15, 15);
		const floor = new THREE.Mesh(floorGeometry, floorMaterial);
		floor.rotation.x = -Math.PI / 2;
		floor.position.y = -0.5;
		return floor;
	}

	function createWall(
		width: number,
		height: number,
		depth: number,
		position: { x: number; y: number; z: number }
	) {
		const wallMaterial = new THREE.MeshPhongMaterial({ color: 0x808080, side: THREE.DoubleSide });
		const geometry = new THREE.BoxGeometry(width, height, depth);
		const wall = new THREE.Mesh(geometry, wallMaterial);
		wall.position.set(position.x, position.y, position.z);
		return wall;
	}

	function createScene(canvas: HTMLCanvasElement) {
		const renderer = new THREE.WebGLRenderer({ canvas });
		const scene = new THREE.Scene();
		const aspect = canvas.clientWidth / canvas.clientHeight;
		renderer.setPixelRatio(window.devicePixelRatio);
		const camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 100);

		const wallHeight = 3;
		const wallThickness = 0.2; // Assume a thickness for the walls
		const wallY = wallHeight - 2.5;

		function createSpotlight(
			position: THREE.Vector3,
			target: THREE.Object3D,
			intensity = 1,
			color = 0xf2f2f2
		) {
			const spotLight = new THREE.SpotLight(color, intensity, 0, Math.PI / 6);
			spotLight.position.set(position.x, position.y, position.z);
			spotLight.target = target;

			const cylinderGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.1, 32);
			const cylinderMaterial = new THREE.MeshBasicMaterial({ color: 0x111111 });
			const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
			cylinder.position.set(position.x, position.y, position.z);
			cylinder.lookAt(target.position);
			cylinder.rotateX(Math.PI / 2);

			const spotLightHelper = new THREE.SpotLightHelper(spotLight);
			scene.add(spotLightHelper);
			scene.add(spotLight, cylinder);
		}

		const onKeyDown = function (event: KeyboardEvent) {
			switch (event.code) {
				case 'ArrowUp':
				case 'KeyW':
					moveForward = true;
					break;

				case 'ArrowLeft':
				case 'KeyA':
					moveLeft = true;
					break;

				case 'ArrowDown':
				case 'KeyS':
					moveBackward = true;
					break;

				case 'ArrowRight':
				case 'KeyD':
					moveRight = true;
					break;

				case 'Space':
					if (canJump === true) velocity.y += 350;
					canJump = false;
					break;
			}
		};

		const onKeyUp = function (event: KeyboardEvent) {
			switch (event.code) {
				case 'ArrowUp':
				case 'KeyW':
					moveForward = false;
					break;

				case 'ArrowLeft':
				case 'KeyA':
					moveLeft = false;
					break;

				case 'ArrowDown':
				case 'KeyS':
					moveBackward = false;
					break;

				case 'ArrowRight':
				case 'KeyD':
					moveRight = false;
					break;
			}
		};

		// Main Room Walls
		const wall1 = createWall(10, wallHeight, wallThickness, {
			x: 0,
			y: wallY,
			z: -5 + wallThickness / 2
		}); // Top
		const wall2 = createWall(10, wallHeight, wallThickness, {
			x: 0,
			y: wallY,
			z: 5 - wallThickness / 2
		}); // Bottom
		const wall3 = createWall(wallThickness, wallHeight, 10, {
			x: -5 + wallThickness / 2,
			y: wallY,
			z: 0
		}); // Left
		const wall4 = createWall(wallThickness, wallHeight, 10, {
			x: 5 - wallThickness / 2,
			y: wallY,
			z: 0
		}); // Right

		scene.add(wall1, wall2, wall3, wall4);

		// ceiling
		const ceilingTexture = new THREE.TextureLoader().load(TEXTURES['grunge-concrete-cement']);
		const ceilingMaterial = new THREE.MeshPhongMaterial({ map: ceilingTexture });
		const ceilingGeometry = new THREE.PlaneGeometry(10, 10);
		const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
		ceiling.position.set(0, 1.5, 0);
		ceiling.rotation.x = Math.PI / 2;

		scene.add(ceiling);

		// floor
		const floor = createFloor();
		scene.add(floor);

		// exhibits
		const loveLivePhoto = create2DExhibit(LoveLive.src, LoveLive.width, LoveLive.height, 0.5);
		loveLivePhoto.position.set(0, 0.25, -4.78);

		const lucyPhoto = create2DExhibit(Lucy.src, Lucy.width, Lucy.height, 0.5);
		lucyPhoto.position.set(1, 0.25, -4.78);

		const regPhoto = create2DExhibit(Reg.src, Reg.width, Reg.height, 0.5);
		regPhoto.position.set(-1, 0.25, -4.78);

		const mostimaPhoto = create2DExhibit(
			EmanumArknights.src,
			EmanumArknights.width,
			EmanumArknights.height,
			0.5
		);
		mostimaPhoto.position.set(-2, 0.25, -4.78);

		scene.add(loveLivePhoto, lucyPhoto, regPhoto, mostimaPhoto);

		// lights
		createSpotlight(new THREE.Vector3(-2, 1.5, -4.2), mostimaPhoto, 0.6);
		createSpotlight(new THREE.Vector3(-1, 1.5, -4.2), regPhoto, 0.6);
		createSpotlight(new THREE.Vector3(0, 1.5, -4.2), loveLivePhoto, 0.6);
		createSpotlight(new THREE.Vector3(1, 1.5, -4.2), lucyPhoto, 0.6);

		const ambientLight = new THREE.AmbientLight(0xe6e5e3, 0.5);
		ambientLight.position.set(0, 1.5, 0);
		scene.add(ambientLight);

		// helpers
		const gridHelper = new THREE.GridHelper(10, 10);
		const axesHelper = new THREE.AxesHelper(5);
		scene.add(gridHelper, axesHelper);

		const controls = new PointerLockControls(camera, renderer.domElement);
		controls.addEventListener('lock', function () {
			console.log('locked');
		});

		controls.addEventListener('unlock', function () {
			console.log('unlocked');
		});

		renderer.domElement.addEventListener('click', function () {
			if (controls.isLocked) controls.unlock();
			else controls.lock();
		});

		document.addEventListener('keydown', onKeyDown);
		document.addEventListener('keyup', onKeyUp);

		const clock = new THREE.Clock();

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
		controls: PointerLockControls,
		clock: THREE.Clock
	) {
		requestAnimationFrame(() => animate(renderer, scene, camera, controls, clock));
		if (resizeRendererToDisplaySize(renderer)) {
			const canvas = renderer.domElement;
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();
		}

		const time = performance.now();

		if (controls.isLocked === true) {
			raycaster.ray.origin.copy(controls.getObject().position);
			raycaster.ray.origin.y -= 10;

			const delta = (time - prevTime) / 1000;

			velocity.x -= velocity.x * 10.0 * delta;
			velocity.z -= velocity.z * 10.0 * delta;

			velocity.y -= 9.8 * 150.0 * delta; // 100.0 = mass

			direction.z = Number(moveForward) - Number(moveBackward);
			direction.x = Number(moveRight) - Number(moveLeft);
			direction.normalize(); // this ensures consistent movements in all directions

			if (moveForward || moveBackward) velocity.z -= direction.z * 40.0 * delta;
			if (moveLeft || moveRight) velocity.x -= direction.x * 40.0 * delta;

			controls.moveRight(-velocity.x * delta);
			controls.moveForward(-velocity.z * delta);

			controls.getObject().position.y += velocity.y * delta; // new behavior

			if (controls.getObject().position.y < 1) {
				velocity.y = 0;
				controls.getObject().position.y = 0;

				canJump = true;
			}
			// prevent camera from going out of bounds
			// TODO: Replace with something like a bounding box check in the future
			const position = controls.getObject().position;
			if (position.x > 4.5) position.x = 4.5;
			if (position.x < -4.5) position.x = -4.5;
			if (position.z > 4.5) position.z = 4.5;
			if (position.z < -4.5) position.z = -4.5;
		}

		prevTime = time;
		renderer.render(scene, camera);
	}

	onMount(() => {
		const canvas = document.querySelector('#photo-gallery') as HTMLCanvasElement;
		const { renderer, scene, camera, controls, clock } = createScene(canvas);
		animate(renderer, scene, camera, controls, clock);
	});
</script>

<canvas id="photo-gallery" class="block h-full w-full"></canvas>
