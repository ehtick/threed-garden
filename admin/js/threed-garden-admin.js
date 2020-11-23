/** ThreeDGarden - Custom Admin JavaScript */

(function( $ ) {
'use strict';

function init() {
	let scene = new THREE.Scene();
	scene.background = new THREE.Color(0x333333);
	//scene.fog = new THREE.Fog(0xFFFFFF, 0, 500);

	/** GEOMETRY ************************************************************************* */
	
	let plane = getPlane(100, 100, 0xFFFFFF);
	plane.name = "plane-1";
	plane.rotation.x = -Math.PI / 2; //-90 degrees in radians
	//plane.position.y = 0;
	plane.material.roughness = 0.0;

	let cube = getCube(32, 16, 5, 0x772200);
	cube.position.z = cube.geometry.parameters.depth / 2;
	cube.material.roughness = 0.9;
	console.log("-------------------------");
	console.log(cube);
	console.log("-------------------------");

	/** TEXTURES ************************************************************************* */

	let loader = new THREE.TextureLoader();
	plane.material.map = loader.load('/wp-content/plugins/threed-garden/admin/media/textures/grasslight-big.jpg');
	//plane.material.bumpMap = loader.load('/wp-content/plugins/threed-garden/admin/media/textures/grasslight-big-nm.jpg');
	//plane.material.bumpScale = 0.05;

	cube.material.map = loader.load('/wp-content/plugins/threed-garden/admin/media/textures/fence-lattice-redwood-100x100-white.png');
	//cube.material.bumpMap = loader.load('/wp-content/plugins/threed-garden/admin/media/textures/fence-lattice-redwood-100x100-white.png');
	//cube.material.bumpScale = 0.05;

	let texturePlane = plane.material.map;
	texturePlane.wrapS = THREE.RepeatWrapping;
	texturePlane.wrapT = THREE.RepeatWrapping;
	texturePlane.repeat.set(4, 4);

	let textureCube = cube.material.map;
	textureCube.wrapS = THREE.RepeatWrapping;
	textureCube.wrapT = THREE.RepeatWrapping;
	textureCube.repeat.set(4, 4);

	// manipulate materials
	// load the cube map
	var path = '/wp-content/plugins/threed-garden/admin/media/textures/cubemap/';
	var format = '.jpg';
	var urls = [
		path + 'px' + format, path + 'nx' + format,
		path + 'py' + format, path + 'ny' + format,
		path + 'pz' + format, path + 'nz' + format
	];
	var reflectionCube = new THREE.CubeTextureLoader().load(urls);
	reflectionCube.format = THREE.RGBFormat;

	scene.background = reflectionCube;

	/** LIGHTS *************************************************************************** */

	let pointLight = getPointLight(0xFFFFFF, 4.0);
	pointLight.position.set( -20, -60, 20 );
	//pointLight.intensity = 3.0;
	console.log("-------------------------");
	console.log(pointLight);
	console.log("-------------------------");

	let spotLight = getSpotLight(0xFFFFFF, 4.0);
	spotLight.position.set( -20, -60, 20 );
	//spotLight.intensity = 3.0;
	console.log("-------------------------");
	console.log(spotLight);
	console.log("-------------------------");

	let directionalLight = getDirectionalLight(0xFFFFFF, 3.5);
	directionalLight.position.set( -100, -100, 55 );
	//directionalLight.intensity = 3.0;
	console.log("-------------------------");
	console.log(directionalLight);
	console.log("-------------------------");

	//let helper = new THREE.CameraHelper(directionalLight.shadow.camera);

	let ambientLight = getAmbientLight(0xFFFFFF, 0.2);
	//ambientLight.position.set( -100, -100, 25 );
	//ambientLight.intensity = 3.0;
	console.log("-------------------------");
	console.log(ambientLight);
	console.log("-------------------------");
	
	/** SCENE ***************************************************************************** */

	// add objects to scene
	plane.add(cube);
	//plane.add(pointLight);
	//plane.add(spotLight);
	plane.add(directionalLight);
	plane.add(ambientLight);
	//plane.add(helper);
	scene.add(plane);
	console.log("-------------------------");
	console.log(plane);
	console.log("-------------------------");

	/** CAMERA **************************************************************************** */

	var camera = new THREE.PerspectiveCamera(
		45,
		window.innerWidth/window.innerHeight,
		0.1,
		1000
	);
	camera.position.set( -55, 40, 100 );
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	console.log("-------------------------");
	console.log(camera);
	console.log("-------------------------");

	/** RENDERER ************************************************************************** */
	
	let renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
	renderer.shadowMap.enabled = true;
	renderer.setSize(window.innerWidth - 240, window.innerHeight - 100);
	//renderer.setClearColor(0xFFFFFF);
	console.log("-------------------------");
	console.log(renderer);
	console.log("-------------------------");

	/** CONTROLS ************************************************************************** */

	let controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;
	controls.dampingFactor = 0.25;
	controls.enableZoom = true;
	controls.autoRotate = false;
	console.log("-------------------------");
	console.log(controls);
	console.log("-------------------------");

	/** DAT.GUI *************************************************************************** */

	let gui = new dat.GUI({ autoPlace: true, closeOnTop: true });
	gui.close();
	gui.domElement.id = 'gui';
	let folder1 = gui.addFolder("Camera Position");
	folder1.add(camera.position, "x", -100, 100).listen();
	folder1.add(camera.position, "y", -100, 100).listen();
	folder1.add(camera.position, "z", -100, 100).listen();
	let folder2 = gui.addFolder("Directional Light");
	folder2.add(directionalLight, "intensity", 0, 20);
	folder2.add(directionalLight.position, "x", -100, 100);
	folder2.add(directionalLight.position, "y", -100, 100);
	folder2.add(directionalLight.position, "z", -100, 100);
	let folder3 = gui.addFolder("Roughness");
	folder3.add(plane.material, "roughness", 0, 1);
	folder3.add(cube.material, "roughness", 0, 1);
	//gui.add(cube.position, "z", -100, 100);
	//gui.add(plane, "name");
	console.log("-------------------------");
	console.log(gui);
	console.log("-------------------------");

	/** WEBGL CANVAS *********************************************************************** */

	//document.getElementById('webgl').appendChild(renderer.domElement);
	//$( "#webgl" ).append(renderer.domElement);
	let canvas = $("#webgl");
	canvas.css("border","0px solid black")
		.append(gui.domElement)
		.append(renderer.domElement);
	console.log("-------------------------");
	console.log(canvas);
	console.log("-------------------------");


	/** ANIMATE + RENDER (continuous rendering) ******************************************** */

	//update(renderer, scene, camera);
	let animate = function () {
		controls.update();
		requestAnimationFrame( animate );
		// cube.rotation.x += 0.005;
		// cube.rotation.y += 0.005;
		// plane.rotation.x += 0.002;
		// plane.rotation.y += 0.002;
		renderer.render( scene, camera );
	};
	animate();

	/** RETURN SCENE *********************************************************************** */
	return scene;
}

function getCube(x, y, z, color){
	let geometry = new THREE.BoxGeometry(x, y, z);
	let material = new THREE.MeshStandardMaterial({
		color: color,
		side: THREE.DoubleSide
	});
	let mesh = new THREE.Mesh(geometry, material);
	mesh.castShadow = true;
	return mesh;
}

function getPlane(x, y, color, side){
	let geometry = new THREE.PlaneGeometry(x, y);
	let material = new THREE.MeshStandardMaterial({
		color: color,
		side: THREE.DoubleSide
	});
	let mesh = new THREE.Mesh(geometry, material);
	mesh.receiveShadow = true;
	return mesh;
}

function getPointLight(color, intensity){
	let light = new THREE.PointLight(color, intensity);
	light.castShadow = true;
	light.shadow.bias = 0.001;
	light.shadow.mapSize.width = 2048; //default = 1024
	light.shadow.mapSize.height = 2048; //default = 1024
	return light;
}

function getSpotLight(color, intensity){
	let light = new THREE.SpotLight(color, intensity);
	light.castShadow = true;
	light.shadow.bias = 0.001;
	light.shadow.mapSize.width = 2048; //default = 1024
	light.shadow.mapSize.height = 2048; //default = 1024
	return light;
}

function getDirectionalLight(color, intensity){
	let light = new THREE.DirectionalLight(color, intensity);
	light.castShadow = true;
	light.shadow.bias 			= 0.001;
	light.shadow.mapSize.width 	= 2048; //default = 1024
	light.shadow.mapSize.height = 2048; //default = 1024
	light.shadow.camera.left 	= -50; //default = -5
	light.shadow.camera.bottom 	= -50; //default = -5
	light.shadow.camera.right 	= 50; //default = 5
	light.shadow.camera.top 	= 50; //default = 5
	return light;
}

function getAmbientLight(color, intensity){
	let light = new THREE.AmbientLight(color, intensity);
	return light;
}

// maybe
function update(renderer, scene, camera){
	renderer.render( scene, camera );
	// recursive function loading
	requestAnimationFrame( function(){
		update(renderer, scene, camera);
	} );
}

/**
 * run app on window load, when everything is ready
 */
$(window).on("load",function(){
	// init
	let garden = init();
	console.log("-------------------------");
	console.log(garden);
	console.log("-------------------------");

});
/** ************************************************************************************* */
})( jQuery );
/** ************************************************************************************* */

/**
 * query wordpress rest api for garden post types + taxonomies
 */



/** 
 * END FILE
 * ************************************************************************************** 
 */