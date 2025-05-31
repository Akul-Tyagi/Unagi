'use client';

import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { createScene, createCamera, createRenderer, setupLights } from '@/lib/three-setup';

export default function ThreeModel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  // Store the original rotation
  const originalRotation = useRef<{ x: number, y: number, z: number }>({ x: 0, y: 0, z: 0 });
  // Store references to model and controls for animation
  const modelRef = useRef<THREE.Group | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  // For the floating animation
  const clock = useRef<THREE.Clock | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Initialize clock for animations
    clock.current = new THREE.Clock();

    // Setup
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Create three.js elements
    const scene = createScene();
    const camera = createCamera(width, height);
    const renderer = createRenderer(width, height);
    
    // Enable shadows
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Add renderer to DOM
    container.appendChild(renderer.domElement);
    
    // Add lights with shadows
    setupLights(scene);
    
    // Add a plane to receive shadows
    const planeGeometry = new THREE.PlaneGeometry(100, 100);
    const planeMaterial = new THREE.ShadowMaterial({ 
      opacity: 0.2 
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -3;
    plane.receiveShadow = true;
    scene.add(plane);
    
    // Add OrbitControls with restrictions
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.rotateSpeed = 0.8;
    
    // Store controls in ref
    controlsRef.current = controls;
    
    // Set up event listeners for interaction state
    container.addEventListener('mousedown', () => setIsInteracting(true));
    container.addEventListener('touchstart', () => setIsInteracting(true));
    window.addEventListener('mouseup', () => setIsInteracting(false));
    window.addEventListener('touchend', () => setIsInteracting(false));
    
    // Load 3D model
    const loader = new GLTFLoader();
    loader.load(
      '/models/crystal_stone_rock.glb',
      (gltf) => {
        // Successfully loaded model
        const model = gltf.scene;
        
        // Store model reference
        modelRef.current = model;
        
        // Enable shadows for the model
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            
            // Enhance materials if needed
            if (child.material) {
              child.material.roughness = 0.7;
            }
          }
        });
        
        // Center the model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.x = -center.x;
        model.position.y = -center.y - 1; // Lower it slightly
        model.position.z = -center.z;
        
        // Custom positioning - adjust these values
        model.position.x = 0;
        model.position.y = 0;
        model.position.z = 0;
        
        // Initial rotation - adjust as needed
        model.rotation.x = 0;
        model.rotation.y = 4;
        model.rotation.z = 0.5;
        
        // Save the original rotation
        originalRotation.current = {
          x: model.rotation.x,
          y: model.rotation.y,
          z: model.rotation.z
        };
        
        // Scale model as needed
        model.scale.set(2.5, 2.5, 2.5);
        
        // Add model to scene
        scene.add(model);
        
        // Position camera
        camera.position.set(5, 3, 5);
        camera.lookAt(0, 0, 0);
      },
      (progress) => {
        console.log(`Model loading: ${(progress.loaded / progress.total * 100).toFixed(2)}%`);
      },
      (error) => {
        console.error('Error loading model:', error);
      }
    );
    
    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      
      const elapsedTime = clock.current?.getElapsedTime() || 0;
      
      if (modelRef.current) {
        // Continuous rotation regardless of interaction state
        modelRef.current.rotation.x += 0.0001;
        modelRef.current.rotation.y += 0.002;
        
        // Floating animation using sine wave
        const floatOffset = Math.sin(elapsedTime) * 0.4;
        modelRef.current.position.y = floatOffset;
        
        // Add a subtle spinning effect
        const spinOffset = Math.sin(elapsedTime * 0.5) * 0.05;
        modelRef.current.rotation.z = originalRotation.current.z + spinOffset;
      }
      
      // Update controls
      controls.update();
      
      // Render
      renderer.render(scene, camera);
    }
    
    // Start animation loop
    animate();
    
    // Handle window resizing
    const handleResize = () => {
      if (!containerRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mouseup', () => setIsInteracting(false));
      window.removeEventListener('touchend', () => setIsInteracting(false));
      container.removeEventListener('mousedown', () => setIsInteracting(true));
      container.removeEventListener('touchstart', () => setIsInteracting(true));
      
      // Clean up resources
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      
      // Dispose of resources
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full" />
  );
}