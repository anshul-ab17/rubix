'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { FaceName, StandardMove, COLOR_HEX_MAP, FACE_NAMES } from '@/types/cube';
import { useCubeStore } from '@/stores/cube-store';
import { RotateCcw, Compass } from 'lucide-react';

interface Cube3DProps {
  interactive?: boolean;
  onStickerClick?: (face: FaceName, index: number) => void;
  className?: string;
  autoRotate?: boolean;
  highlightMove?: StandardMove | null;
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
    { x: -1, y: 1, z: 1 }, { x: 0, y: 1, z: 1 }, { x: 1, y: 1, z: 1 },
    { x: -1, y: 0, z: 1 }, { x: 0, y: 0, z: 1 }, { x: 1, y: 0, z: 1 },
    { x: -1, y: -1, z: 1 }, { x: 0, y: -1, z: 1 }, { x: 1, y: -1, z: 1 },
  ],
  B: [
    { x: 1, y: 1, z: -1 }, { x: 0, y: 1, z: -1 }, { x: -1, y: 1, z: -1 },
    { x: 1, y: 0, z: -1 }, { x: 0, y: 0, z: -1 }, { x: -1, y: 0, z: -1 },
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
  R: 0,
  L: 1,
  U: 2,
  D: 3,
  F: 4,
  B: 5,
};

const BLACK_COLOR = 0x18181b;

export const Cube3D: React.FC<Cube3DProps> = ({
  interactive = true,
  onStickerClick,
  className = '',
  autoRotate = false,
  highlightMove = null,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cubeState = useCubeStore((s) => s.cubeState);
  const activeColor = useCubeStore((s) => s.activeColor);
  const inputMode = useCubeStore((s) => s.inputMode);
  const setStickerColor = useCubeStore((s) => s.setStickerColor);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cubeGroupRef = useRef<THREE.Group | null>(null);
  const cubiesRef = useRef<THREE.Mesh[]>([]);
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const touchStartRef = useRef({ x: 0, y: 0 });

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(4.5, 3.8, 5.5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight1.position.set(8, 12, 10);
    dirLight1.castShadow = true;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight2.position.set(-8, -10, -8);
    scene.add(dirLight2);

    // Create Cube Group & 27 Cubies
    const cubeGroup = new THREE.Group();
    scene.add(cubeGroup);
    cubeGroupRef.current = cubeGroup;

    const cubies: THREE.Mesh[] = [];
    const geometry = new THREE.BoxGeometry(0.95, 0.95, 0.95);

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          // 6 materials per cubie
          const materials: THREE.MeshStandardMaterial[] = [];
          for (let i = 0; i < 6; i++) {
            materials.push(
              new THREE.MeshStandardMaterial({
                color: BLACK_COLOR,
                roughness: 0.35,
                metalness: 0.1,
              })
            );
          }

          const mesh = new THREE.Mesh(geometry, materials);
          mesh.position.set(x, y, z);
          mesh.userData = { initialX: x, initialY: y, initialZ: z, currentX: x, currentY: y, currentZ: z };
          cubeGroup.add(mesh);
          cubies.push(mesh);
        }
      }
    }
    cubiesRef.current = cubies;

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (autoRotate && cubeGroupRef.current && !isDraggingRef.current) {
        cubeGroupRef.current.rotation.y += 0.005;
      }
      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
    };
  }, [autoRotate]);

  // Update sticker materials when cubeState changes
  const updateMaterials = useCallback(() => {
    if (!cubiesRef.current.length) return;

    // First reset all outer faces to dark
    for (const cubie of cubiesRef.current) {
      const mats = cubie.material as THREE.MeshStandardMaterial[];
      for (let i = 0; i < 6; i++) {
        mats[i].color.setHex(BLACK_COLOR);
      }
    }

    // Map each facelet in state to its respective cubie and material face
    for (const face of FACE_NAMES) {
      const positions = FACELET_POSITIONS[face];
      const matIndex = FACE_NORMAL_INDEX[face];

      positions.forEach((pos, index) => {
        const colorName = cubeState[face][index];
        const hex = COLOR_HEX_MAP[colorName] || '#ffffff';

        // Find cubie at position pos
        const cubie = cubiesRef.current.find((m) => {
          return (
            Math.round(m.position.x) === pos.x &&
            Math.round(m.position.y) === pos.y &&
            Math.round(m.position.z) === pos.z
          );
        });

        if (cubie) {
          const mats = cubie.material as THREE.MeshStandardMaterial[];
          mats[matIndex].color.set(hex);
          mats[matIndex].roughness = 0.2;
          mats[matIndex].metalness = 0.15;
          cubie.userData[`face_${matIndex}`] = { face, index };
        }
      });
    }
  }, [cubeState]);

  useEffect(() => {
    updateMaterials();
  }, [cubeState, updateMaterials]);

  // Handle Raycasting / Sticker Clicking
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !containerRef.current || !cameraRef.current || !sceneRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);

    const intersects = raycaster.intersectObjects(cubiesRef.current);
    if (intersects.length > 0) {
      const hit = intersects[0];
      const mesh = hit.object as THREE.Mesh;
      const faceIndex = hit.face?.materialIndex;

      if (faceIndex !== undefined) {
        const faceData = mesh.userData[`face_${faceIndex}`];
        if (faceData) {
          if (onStickerClick) {
            onStickerClick(faceData.face, faceData.index);
          } else if (inputMode === 'edit') {
            setStickerColor(faceData.face, faceData.index, activeColor);
          }
        }
      }
    }
  };

  // Mouse & Touch Drag Rotation Handling
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !cubeGroupRef.current) return;
    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    cubeGroupRef.current.rotation.y += deltaX * 0.008;
    cubeGroupRef.current.rotation.x += deltaY * 0.008;

    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || !cubeGroupRef.current || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - touchStartRef.current.x;
    const deltaY = e.touches[0].clientY - touchStartRef.current.y;

    cubeGroupRef.current.rotation.y += deltaX * 0.01;
    cubeGroupRef.current.rotation.x += deltaY * 0.01;

    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  const resetCameraView = (view: 'front' | 'top' | 'isometric' = 'isometric') => {
    if (!cubeGroupRef.current) return;
    if (view === 'isometric') {
      cubeGroupRef.current.rotation.set(0.4, 0.6, 0);
    } else if (view === 'front') {
      cubeGroupRef.current.rotation.set(0, 0, 0);
    } else if (view === 'top') {
      cubeGroupRef.current.rotation.set(Math.PI / 2, 0, 0);
    }
  };

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      {/* 3D WebGL Canvas */}
      <div
        ref={containerRef}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="w-full h-full min-h-[320px] cursor-grab active:cursor-grabbing rounded-2xl overflow-hidden touch-none"
      />

      {/* Floating 3D Control Overlay */}
      <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md border border-slate-700/60 p-1.5 rounded-xl shadow-lg z-10">
        <button
          onClick={() => resetCameraView('isometric')}
          title="Reset Isometric Angle"
          className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700/60 rounded-lg transition-colors text-xs flex items-center gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset View</span>
        </button>
        <button
          onClick={() => resetCameraView('front')}
          title="Front Face Focus"
          className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700/60 rounded-lg transition-colors text-xs"
        >
          Front (F)
        </button>
        <button
          onClick={() => resetCameraView('top')}
          title="Top Face Focus"
          className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700/60 rounded-lg transition-colors text-xs"
        >
          Top (U)
        </button>
      </div>

      {/* Highlight Move Pill if any */}
      {highlightMove && (
        <div className="absolute top-3 left-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 backdrop-blur-md px-3 py-1.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg animate-pulse">
          <Compass className="w-4 h-4 text-emerald-400" />
          <span>Move: {highlightMove}</span>
        </div>
      )}
    </div>
  );
};
