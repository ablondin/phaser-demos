// Variables globales
var scene; 
var camera; 
var distance = 1;

// Initialisation de la scène
initializeScene(); 

// Animation de la scène
animateScene(); 

function initializeScene(){ 
    // Initialisation du canvas
    renderer = new THREE.WebGLRenderer({antialias: true}); 
    renderer.setClearColor(0x000000, 1); 
    canvasWidth = 800; 
    canvasHeight = 600; 
    renderer.setSize(canvasWidth, canvasHeight); 
    document.getElementById("canvas").appendChild(renderer.domElement); 

    // Initialisation de la scène et de la caméra
    scene = new THREE.Scene(); 
    camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 0.1, 100); 
    camera.position.set(0, 0.5, 0); 
    camera.up = new THREE.Vector3(0, 2, 0);
    scene.add(camera); 

    // De la lumière
    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 100, 0);
    scene.add(directionalLight);
    var ambientLight = new THREE.AmbientLight(0xF0F0F0);
    scene.add(ambientLight); 


    // Chargement du plancher
    var loader = new THREE.JSONLoader();
    loader.load('assets/floor.json', function(geometry, materials) {
        var meshMaterial = new THREE.MeshFaceMaterial(materials);
        for (var i = 0; i < materials.length; ++i) {
            materials[i].side = THREE.DoubleSide;
        }
        var mesh = new THREE.Mesh(geometry, meshMaterial);
        scene.add(mesh);
    });

    // Chargement des murs
    loader = new THREE.JSONLoader();
    loader.load('assets/walls.json', function(geometry, materials) {
        var meshMaterial = new THREE.MeshFaceMaterial(materials);
        for (var i = 0; i < materials.length; ++i) {
            materials[i].side = THREE.DoubleSide;
        }
        var mesh = new THREE.Mesh(geometry, meshMaterial);
        scene.add(mesh);
    });
} 

// Keyboard interaction
document.onkeydown = function(e) {
    console.log(camera.position);
    switch (e.keyCode) {
        case 37: // Left arrow
            camera.rotation.y += 0.1;
            break;
        case 39: // Right arrow
            camera.rotation.y -= 0.1;
            break;
        case 38: // Up arrow
            camera.translateZ(-0.5);
            break;
        case 40: // Down arrow
            camera.translateZ(0.5);
            break;
        case 85: // U key
            camera.position.y += 0.5;
            break;
        case 68: // D key
            camera.position.y -= 0.5;
            break;
    }
};

function animateScene() { 
    var timer = new Date().getTime() * 0.0002;
    requestAnimationFrame(animateScene); 
    renderScene(); 
} 

function renderScene(){ 
    renderer.render(scene, camera); 
} 
