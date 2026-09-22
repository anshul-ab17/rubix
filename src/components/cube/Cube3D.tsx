'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { FaceName, StandardMove, COLOR_HEX_MAP, FACE_NAMES } from '@/types/cube';
import { useCubeStore } from '@/stores/cube-store';
import { RotateCcw } from 'lucide-react';

interface Cube3DProps {
  interactive?: boolean;
  onStickerClick?: (face: FaceName, index: number) => void;
  className?: string;
  autoRotate?: boolean;
  highlightMove?: StandardMove | null;
  cameraPreset?: 'iso' | 'front' | 'top' | 'right';
}

// 6 material indices in Three.js BoxGeometry:
// 0: +X (Right)
// 1: -X (Left)
// 2: +Y (Up)
// 3: -Y (Down)
// 4: +Z (Front)
// 5: -Z (Back)

const FACELET_POSITIONS: Record<FaceName, { x: number; y: number; z: number }[]> = {
  U: [
    { x: -1, y: 1, z: -1 }, { x: 0, y: 1, z: -1 }, { x: 1, y: 1, z: -1 },
    { x: -1, y: 1, z: 0 },  { x: 0, y: 1, z: 0 },  { x: 1, y: 1, z: 0 },
    { x: -1, y: 1, z: 1 },  { x: 0, y: 1, z: 1 },  { x: 1, y: 1, z: 1 },
  ],
  D: [
    { x: -1, y: -1, z: 1 },  { x: 0, y: -1, z: 1 },  { x: 1, y: -1, z: 1 },
    { x: -1, y: -1, z: 0 },  { x: 0, y: -1, z: 0 },  { x: 1, y: -1, z: 0 },
    { x: -1, y: -1, z: -1 }, { x: 0, y: -1, z: -1 }, { x: 1, y: -1, z: -1 },
  ],
  F: [
    { x: -1, y: 1, z: 1 },  { x: 0, y: 1, z: 1 },  { x: 1, y: 1, z: 1 },
    { x: -1, y: 0, z: 1 },  { x: 0, y: 0, z: 1 },  { x: 1, y: 0, z: 1 },
    { x: -1, y: -1, z: 1 }, { x: 0, y: -1, z: 1 }, { x: 1, y: -1, z: 1 },
  ],
  B: [
    { x: 1, y: 1, z: -1 },  { x: 0, y: 1, z: -1 },  { x: -1, y: 1, z: -1 },
    { x: 1, y: 0, z: -1 },  { x: 0, y: 0, z: -1 },  { x: -1, y: 0, z: -1 },
    { x: 1, y: -1, z: -1 }, { x: 0, y: -1, z: -1 }, { x: -1, y: -1, z: -1 },
  ],
  L: [
    { x: -1, y: 1, z: -1 }, { x: -1, y: 1, z: 0 }, { x: -1, y: 1, z: 1 },
    { x: -1, y: 0, z: -1 }, { x: -1, y: 0, z: 0 }, { x: -1, y: 0, z: 1 },
    { x: -1, y: -1, z: -1 }, { x: -1, y: -1, z: 0 }, { x: -1, y: -1, z: 1 },
  ],
  R: [
    { x: 1, y: 1, z: 1 }, { x: 1, y: 1, z: 0 }, { x: 1, y: 1, z: -1 },
    { x: 1, y: 0, z: 1 }, { x: 1, y: 0, z: 0 }, { x: 1, y: 0, z: -1 },
    { x: 1, y: -1, z: 1 }, { x: 1, y: -1, z: 0 }, { x: 1, y: -1, z: -1 },
  ],
};

const FACE_NORMAL_INDEX: Record<FaceName, number> = {
  R: 0, // +X
  L: 1, // -X
  U: 2, // +Y
  D: 3, // -Y
  F: 4, // +Z
  B: 5, // -Z
};

const INTERNAL_BLACK = '#0f172a';
const CUBIE_SIZE = 0.96;
const CUBIE_SPACING = 1.0;

export const Cube3D: React.FC<Cube3DProps> = ({
  interactive = true,
  onStickerClick,
  className = '',
  autoRotate = false,
  cameraPreset = 'iso',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cubeState = useCubeStore((s) => s.cubeState);
  const activeColor = useCubeStore((s) => s.activeColor);
  const setStickerColor = useCubeStore((s) => s.setStickerColor);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cubeGroupRef = useRef<THREE.Group | null>(null);
  const cubiesRef = useRef<THREE.Mesh[]>([]);
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const touchStartRef = useRef({ x: 0, y: 0 });
  const animatingMoveRef = useRef(false);

  // Helper to get sticker material
  const createStickerMaterial = (hex: string) => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(hex),
      roughness: 0.15,
      metalness: 0.05,
    });
  };

  // Update cubie face materials based on current CubeState
  const updateMaterials = useCallback(() => {
    if (!cubeGroupRef.current) return;

    // Reset default materials to black internal
    cubiesRef.current.forEach((cubie) => {
      const materials = cubie.material as THREE.MeshStandardMaterial[];
      for (let i = 0; i < 6; i++) {
        materials[i].color.set(INTERNAL_BLACK);
      }
    });

    // Map facelets to cubie materials
    for (const face of FACE_NAMES) {
      const positions = FACELET_POSITIONS[face];
      const matIndex = FACE_NORMAL_INDEX[face];

      for (let i = 0; i < 9; i++) {
        const pos = positions[i];
        const color = cubeState[face][i];
        const hex = COLOR_HEX_MAP[color] || '#334155';

        // Find matching cubie
        const cubie = cubiesRef.current.find((c) => {
          return (
            Math.round(c.position.x) === pos.x &&
            Math.round(c.position.y) === pos.y &&
            Math.round(c.position.z) === pos.z
          );
        });

        if (cubie) {
          const materials = cubie.material as THREE.MeshStandardMaterial[];
          materials[matIndex].color.set(hex);
          // Store face metadata on mesh for raycasting
          cubie.userData[`face_${matIndex}`] = { face, index: i };
        }
      }
    }
  }, [cubeState]);

  // Execute smooth animated layer rotation for any standard move
  const animateLayerRotation = useCallback((move: StandardMove, onComplete?: () => void) => {
    if (!cubeGroupRef.current || !sceneRef.current || animatingMoveRef.current) {
      if (onComplete) onComplete();
      return;
    }

    animatingMoveRef.current = true;
    const face = move[0] as FaceName;
    const isPrime = move.includes("'");
    const isDouble = move.includes('2');

    // Axis and target angle
    let axis = new THREE.Vector3(0, 1, 0);
    let targetAngle = -Math.PI / 2;
    let filterFn: (pos: THREE.Vector3) => boolean = () => false;

    if (face === 'U') {
      axis = new THREE.Vector3(0, 1, 0);
      targetAngle = -Math.PI / 2;
      filterFn = (pos) => pos.y > 0.5;
    } else if (face === 'D') {
      axis = new THREE.Vector3(0, 1, 0);
      targetAngle = Math.PI / 2;
      filterFn = (pos) => pos.y < -0.5;
    } else if (face === 'R') {
      axis = new THREE.Vector3(1, 0, 0);
      targetAngle = -Math.PI / 2;
      filterFn = (pos) => pos.x > 0.5;
    } else if (face === 'L') {
      axis = new THREE.Vector3(1, 0, 0);
      targetAngle = Math.PI / 2;
      filterFn = (pos) => pos.x < -0.5;
    } else if (face === 'F') {
      axis = new THREE.Vector3(0, 0, 1);
      targetAngle = -Math.PI / 2;
      filterFn = (pos) => pos.z > 0.5;
    } else if (face === 'B') {
      axis = new THREE.Vector3(0, 0, 1);
      targetAngle = Math.PI / 2;
      filterFn = (pos) => pos.z < -0.5;
    }

    if (isPrime) targetAngle = -targetAngle;
    if (isDouble) targetAngle = targetAngle * 2;

    const layerCubies = cubiesRef.current.filter((c) => filterFn(c.position));
    const pivot = new THREE.Group();
    cubeGroupRef.current.add(pivot);

    layerCubies.forEach((c) => {
      pivot.attach(c);
    });

    const duration = 220; // ms
    const startTime = performance.now();

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Smooth cubic ease out
      const ease = 1 - Math.pow(1 - progress, 3);
      
      pivot.setRotationFromAxisAngle(axis, targetAngle * ease);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        pivot.setRotationFromAxisAngle(axis, targetAngle);
        pivot.updateMatrixWorld();

        // Re-attach cubies back to root cube group with updated positions
        layerCubies.forEach((c) => {
          cubeGroupRef.current?.attach(c);
          c.position.x = Math.round(c.position.x);
          c.position.y = Math.round(c.position.y);
          c.position.z = Math.round(c.position.z);
          c.rotation.set(0, 0, 0);
        });

        cubeGroupRef.current?.remove(pivot);
        animatingMoveRef.current = false;
        updateMaterials();
        if (onComplete) onComplete();
      }
    };

    requestAnimationFrame(animate);
  }, [updateMaterials]);

  // Set Camera Preset
  const setCameraView = useCallback((preset: 'iso' | 'front' | 'top' | 'right') => {
    if (!cameraRef.current) return;
    const camera = cameraRef.current;
    
    if (preset === 'iso') {
      camera.position.set(4.5, 3.8, 5.5);
    } else if (preset === 'front') {
      camera.position.set(0, 0, 7.5);
    } else if (preset === 'top') {
      camera.position.set(0, 7.5, 0.01);
    } else if (preset === 'right') {
      camera.position.set(7.5, 0, 0);
    }
    camera.lookAt(0, 0, 0);
  }, []);

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 360;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(4.5, 3.6, 5.4);
    camera.lookAt(0, -0.1, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.replaceChildren(renderer.domElement);

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.2);
    mainLight.position.set(6, 10, 8);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xe0f2fe, 1.2);
    fillLight.position.set(-6, 6, -6);
    scene.add(fillLight);

    const bottomLight = new THREE.DirectionalLight(0xffffff, 0.5);
    bottomLight.position.set(0, -8, 0);
    scene.add(bottomLight);

    // Soft Studio Ground Shadow Plane
    const shadowGeo = new THREE.PlaneGeometry(10, 10);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.15 });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -2.2;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // Cube Group
    const cubeGroup = new THREE.Group();
    cubeGroup.position.set(0, 0, 0);
    cubeGroupRef.current = cubeGroup;
    scene.add(cubeGroup);

    // Create 27 cubies
    const geometry = new THREE.BoxGeometry(CUBIE_SIZE, CUBIE_SIZE, CUBIE_SIZE);
    const cubies: THREE.Mesh[] = [];

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          const materials: THREE.MeshStandardMaterial[] = [
            createStickerMaterial(INTERNAL_BLACK),
            createStickerMaterial(INTERNAL_BLACK),
            createStickerMaterial(INTERNAL_BLACK),
            createStickerMaterial(INTERNAL_BLACK),
            createStickerMaterial(INTERNAL_BLACK),
            createStickerMaterial(INTERNAL_BLACK),
          ];

          const cubie = new THREE.Mesh(geometry, materials);
          cubie.position.set(x * CUBIE_SPACING, y * CUBIE_SPACING, z * CUBIE_SPACING);
          cubie.castShadow = true;
          cubie.receiveShadow = true;
          cubeGroup.add(cubie);
          cubies.push(cubie);
        }
      }
    }

    cubiesRef.current = cubies;
    updateMaterials();

    // Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    // Animation Render Loop
    let animationFrameId: number;
    const render = () => {
      if (autoRotate && cubeGroupRef.current && !isDraggingRef.current && !animatingMoveRef.current) {
        cubeGroupRef.current.rotation.y += 0.005;
      }
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, [autoRotate, updateMaterials]);

  // Update materials when cubeState changes
  useEffect(() => {
    if (!animatingMoveRef.current) {
      updateMaterials();
    }
  }, [cubeState, updateMaterials]);

  // Animate layer rotation when highlightMove triggers
  useEffect(() => {
    if (highlightMove) {
      animateLayerRotation(highlightMove);
    }
  }, [highlightMove, animateLayerRotation]);

  // Update Camera Preset when prop changes
  useEffect(() => {
    setCameraView(cameraPreset);
  }, [cameraPreset, setCameraView]);

  // Raycaster click handler for painting stickers in 3D
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive) return;
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    touchStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !cubeGroupRef.current || animatingMoveRef.current) return;

    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    cubeGroupRef.current.rotation.y += deltaX * 0.009;
    cubeGroupRef.current.rotation.x += deltaY * 0.009;

    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    const dragDistance = Math.hypot(
      e.clientX - touchStartRef.current.x,
      e.clientY - touchStartRef.current.y
    );

    // If click (not drag), perform raycast sticker detection
    if (dragDistance < 5 && interactive && containerRef.current && cameraRef.current && sceneRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, cameraRef.current);

      const intersects = raycaster.intersectObjects(cubiesRef.current);
      if (intersects.length > 0) {
        const hit = intersects[0];
        const materialIndex = hit.face?.materialIndex;
        if (materialIndex !== undefined && materialIndex >= 0) {
          const faceData = hit.object.userData[`face_${materialIndex}`];
          if (faceData) {
            const { face, index } = faceData as { face: FaceName; index: number };
            if (onStickerClick) {
              onStickerClick(face, index);
            } else {
              setStickerColor(face, index, activeColor);
            }
          }
        }
      }
    }
  };

  const handleResetOrientation = () => {
    if (cubeGroupRef.current) {
      cubeGroupRef.current.rotation.set(0, 0, 0);
    }
    setCameraView('iso');
  };

  return (
    <div className={`relative w-full h-full flex items-center justify-center select-none ${className}`}>
      {/* 3D Canvas Mount Point */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="w-full h-full cursor-grab active:cursor-grabbing touch-none flex items-center justify-center"
      />

      {/* Interactive Controls Overlay */}
      {interactive && (
        <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10 pointer-events-auto">
          <button
            type="button"
            onClick={handleResetOrientation}
            className="p-1.5 bg-white/90 hover:bg-white text-slate-600 hover:text-blue-600 border border-slate-200/80 rounded-lg shadow-xs transition-all text-xs flex items-center gap-1 cursor-pointer"
            title="Reset 3D View orientation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="text-[11px] font-medium hidden sm:inline">Reset View</span>
          </button>
        </div>
      )}
    </div>
  );
};
