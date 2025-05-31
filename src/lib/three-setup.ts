import * as THREE from 'three';

// Create a scene
export function createScene(): THREE.Scene {
  const scene = new THREE.Scene();
  scene.background = null; // Black background
  return scene;
}

// Create a camera
export function createCamera(width: number, height: number): THREE.PerspectiveCamera {
  const camera = new THREE.PerspectiveCamera(
    45, // Field of view - reduced for less distortion
    width / height, // Aspect ratio
    0.1, // Near clipping plane
    1000 // Far clipping plane
  );
  
  // Set initial camera position
  camera.position.set(2, 4, 6);
  
  return camera;
}

// Create a renderer
export function createRenderer(width: number, height: number): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    alpha: true // Makes background transparent
  });
  
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
  // Enable shadows
  renderer.shadowMap.enabled = false;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  
  return renderer;
}

// Create enhanced lighting
export function setupLights(scene: THREE.Scene): void {
  // Ambient light - soft overall illumination
  const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
  scene.add(ambientLight);
  
  // Main directional light with shadows (like sunlight)
  const mainLight = new THREE.DirectionalLight(0xffffff, 10);
  mainLight.position.set(5, 5, 5);
  mainLight.castShadow = false;
  
  // Set shadow camera frustum
  const d = 15;
  mainLight.shadow.camera.left = -d;
  mainLight.shadow.camera.right = d;
  mainLight.shadow.camera.top = d;
  mainLight.shadow.camera.bottom = -d;
  
  scene.add(mainLight);
  
  // Add a rim light (from behind)
  const rimLight = new THREE.DirectionalLight(0x00d4ff, 1);
  rimLight.position.set(-5, 3, -5);
  scene.add(rimLight);
  
  // Add a subtle top light
  const topLight = new THREE.PointLight(0xffd700, 0.5);
  topLight.position.set(0, 10, 0);
  scene.add(topLight);
}

// Handle window resize
export function handleWindowResize(
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer
): void {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}