"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import * as THREE from "three";

export default function IntroPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const glowLineRef = useRef<HTMLDivElement>(null);
  const streakRef = useRef<HTMLDivElement>(null);
  const fadeOverlayRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
    script.async = true;
    document.body.appendChild(script);

    let frameId: number;
    let renderer: THREE.WebGLRenderer | null = null;

    script.onload = () => {
      const gsap = (window as any).gsap;

      // --- THREE.JS SETUP ---
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.z = 25;

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.toneMapping = THREE.ReinhardToneMapping;
      if (containerRef.current) {
        containerRef.current.appendChild(renderer.domElement);
      }

      const earthGroup = new THREE.Group();
      scene.add(earthGroup);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
      scene.add(ambientLight);

      const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
      sunLight.position.set(15, 5, 10);
      scene.add(sunLight);

      const movingLight = new THREE.PointLight(0xffeebb, 2.5, 50);
      movingLight.position.set(-10, 0, 10);
      scene.add(movingLight);

      // 1. Stars
      const starGeometry = new THREE.BufferGeometry();
      const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.04,
        transparent: true,
        opacity: 0.8,
      });
      const starVertices: number[] = [];
      for (let i = 0; i < 8000; i++) {
        starVertices.push(
          (Math.random() - 0.5) * 1500,
          (Math.random() - 0.5) * 1500,
          (Math.random() - 0.5) * 1500
        );
      }
      starGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(starVertices, 3)
      );
      const stars = new THREE.Points(starGeometry, starMaterial);
      scene.add(stars);

      // 2. Realistic Earth Texture Generation
      const earthRadius = 5;
      const canvas = document.createElement("canvas");
      canvas.width = 4096;
      canvas.height = 2048;
      const ctx = canvas.getContext("2d")!;
      const oceanGrad = ctx.createLinearGradient(0, 0, 0, 2048);
      oceanGrad.addColorStop(0, "#000814");
      oceanGrad.addColorStop(0.5, "#001b3a");
      oceanGrad.addColorStop(1, "#000814");
      ctx.fillStyle = oceanGrad;
      ctx.fillRect(0, 0, 4096, 2048);
      ctx.fillStyle = "#1a3311";
      for (let i = 0; i < 400; i++) {
        const x = Math.random() * 4096;
        const y = Math.random() * 2048;
        const r = Math.random() * 120 + 30;
        ctx.globalAlpha = Math.random() * 0.7 + 0.3;
        ctx.beginPath();
        ctx.ellipse(
          x,
          y,
          r * (Math.random() + 1),
          r,
          Math.random() * Math.PI,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
      const earthTexture = new THREE.CanvasTexture(canvas);

      // 3. Earth Meshes
      const earthGeo = new THREE.SphereGeometry(earthRadius, 128, 128);

      const realisticMat = new THREE.MeshPhongMaterial({
        map: earthTexture,
        specular: new THREE.Color(0x222222),
        shininess: 35,
        bumpMap: earthTexture,
        bumpScale: 0.15,
        transparent: true,
      });
      const realisticEarth = new THREE.Mesh(earthGeo, realisticMat);
      earthGroup.add(realisticEarth);

      const goldenMat = new THREE.MeshStandardMaterial({
        color: 0xffb800,
        metalness: 0.85,
        roughness: 0.2,
        bumpMap: earthTexture,
        bumpScale: 0.1,
        transparent: true,
        opacity: 0,
      });
      const goldenEarth = new THREE.Mesh(earthGeo, goldenMat);
      goldenEarth.scale.set(1.001, 1.001, 1.001);
      earthGroup.add(goldenEarth);

      // 4. Clouds
      const cloudCanvas = document.createElement("canvas");
      cloudCanvas.width = 2048;
      cloudCanvas.height = 1024;
      const cctx = cloudCanvas.getContext("2d")!;
      for (let i = 0; i < 120; i++) {
        const x = Math.random() * 2048;
        const y = Math.random() * 1024;
        const grad = cctx.createRadialGradient(
          x,
          y,
          0,
          x,
          y,
          Math.random() * 100 + 50
        );
        grad.addColorStop(0, "rgba(255, 255, 255, 0.5)");
        grad.addColorStop(1, "rgba(255, 255, 255, 0)");
        cctx.fillStyle = grad;
        cctx.fillRect(x - 150, y - 150, 300, 300);
      }
      const cloudTex = new THREE.CanvasTexture(cloudCanvas);
      const clouds = new THREE.Mesh(
        new THREE.SphereGeometry(earthRadius * 1.015, 96, 96),
        new THREE.MeshPhongMaterial({
          map: cloudTex,
          transparent: true,
          opacity: 0.7,
          depthWrite: false,
        })
      );
      earthGroup.add(clouds);

      // 5. Shaders for Atmosphere
      const atmosphereVertex = `
        varying vec3 vNormal; varying vec3 vEyeVector;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vEyeVector = -vec3(mvPosition.xyz);
          gl_Position = projectionMatrix * mvPosition;
        }
      `;
      const atmosphereFragment = `
        varying vec3 vNormal; varying vec3 vEyeVector;
        uniform vec3 glowColor; uniform float coefficient; uniform float power;
        void main() {
          float intensity = pow(coefficient - dot(vNormal, normalize(vEyeVector)), power);
          gl_FragColor = vec4(glowColor, intensity);
        }
      `;

      const atmosphere = new THREE.Mesh(
        new THREE.SphereGeometry(earthRadius * 1.005, 128, 128),
        new THREE.ShaderMaterial({
          vertexShader: atmosphereVertex,
          fragmentShader: atmosphereFragment,
          uniforms: {
            coefficient: { value: 0.8 },
            power: { value: 3.0 },
            glowColor: { value: new THREE.Color(0x3a86ff) },
          },
          transparent: true,
          side: THREE.BackSide,
        })
      );
      scene.add(atmosphere);

      const glow = new THREE.Mesh(
        new THREE.SphereGeometry(earthRadius * 1.15, 128, 128),
        new THREE.ShaderMaterial({
          vertexShader: atmosphereVertex,
          fragmentShader: atmosphereFragment,
          uniforms: {
            coefficient: { value: 0.1 },
            power: { value: 6.0 },
            glowColor: { value: new THREE.Color(0x1e90ff) },
          },
          transparent: true,
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending,
        })
      );
      scene.add(glow);

      const pulseMesh = new THREE.Mesh(
        new THREE.SphereGeometry(earthRadius * 1.02, 64, 64),
        new THREE.MeshBasicMaterial({
          color: 0xffd700,
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      );
      scene.add(pulseMesh);

      // --- ANIMATION TIMELINE ---
      const tl = gsap.timeline();
      const targetRY =
        (78.9629 + 90) * (Math.PI / 180) + Math.PI / 2;
      const targetRX = 20.5937 * (Math.PI / 180) * -0.5;

      tl.to(fadeOverlayRef.current, { duration: 1, opacity: 0, ease: "power2.inOut" }, 0);
      tl.to(camera.position, { duration: 2.5, z: 14, ease: "power2.out" }, 0);
      tl.to(earthGroup.rotation, { duration: 4, y: targetRY, x: targetRX, ease: "power1.inOut" }, 0);

      tl.to(realisticMat, { duration: 1, opacity: 0 }, 1.5);
      tl.to(clouds.material, { duration: 0.8, opacity: 0 }, 1.5);
      tl.to(goldenMat, { duration: 1, opacity: 1 }, 1.5);
      tl.to(atmosphere.material.uniforms.glowColor.value, { duration: 1, r: 1, g: 0.84, b: 0 }, 1.5);
      tl.to(glow.material.uniforms.glowColor.value, { duration: 1, r: 1, g: 0.6, b: 0 }, 1.5);

      tl.set(pulseMesh.material, { opacity: 0.8 }, 2.4);
      tl.to(pulseMesh.scale, { duration: 0.8, x: 2.5, y: 2.5, z: 2.5, ease: "power2.out" }, 2.4);
      tl.to(pulseMesh.material, { duration: 0.8, opacity: 0 }, 2.4);

      tl.to(logoRef.current, { duration: 1.2, opacity: 1, scale: 1, ease: "back.out(1.5)" }, 2.6);
      tl.to(glowLineRef.current, { duration: 0.6, opacity: 1, width: "160%" }, 2.8);
      tl.to(streakRef.current, { duration: 1, left: "150%", ease: "power2.inOut" }, 3);
      tl.to(glowLineRef.current, { duration: 0.5, opacity: 0 }, 3.4);

      tl.to(goldenMat, { duration: 1.8, opacity: 0.25 }, 3.2);
      tl.to(glow.material.uniforms.power, { duration: 1.8, value: 16 }, 3.2);
      tl.to(camera.position, { duration: 2, z: 15.5 }, 3.2);

      // After the animation, navigate to auth page
      tl.call(() => {
        router.push("/auth");
      }, [], 5.5);

      const animate = () => {
        frameId = requestAnimationFrame(animate);
        stars.rotation.y += 0.0001;
        earthGroup.rotation.y += 0.0008;
        clouds.rotation.y += 0.001;
        const time = Date.now() * 0.002;
        movingLight.position.x = Math.sin(time) * 15;
        movingLight.position.z = Math.cos(time) * 15;
        renderer!.render(scene, camera);
      };
      animate();

      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer!.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        cancelAnimationFrame(frameId);
        tl.kill();
        renderer?.dispose();
        if (containerRef.current) {
          containerRef.current.innerHTML = "";
        }
      };
    };

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
      if (renderer) renderer.dispose();
    };
  }, [router]);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-sans">
      <div
        ref={fadeOverlayRef}
        className="absolute inset-0 bg-black z-50 pointer-events-none"
      />

      <div ref={containerRef} className="w-full h-full" />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div
          ref={logoRef}
          className="relative opacity-0 scale-0 transition-shadow duration-1000"
          style={{ filter: "drop-shadow(0 0 30px rgba(255, 215, 0, 0.4))" }}
        >
          <div
            ref={glowLineRef}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[2px] w-0 opacity-0"
            style={{
              background:
                "linear-gradient(to right, transparent, #facc15, transparent)",
              boxShadow: "0 0 20px #ffd700",
            }}
          />
          <img
            className="max-w-[250px] max-h-[250px] object-contain"
            src="https://image2url.com/r2/default/images/1774258386636-e58b3cf4-24f1-466d-b82f-3f8a2624d165.png"
            alt="MOONIQ Logo"
          />
          <div
            ref={streakRef}
            className="absolute inset-0 w-[200%] h-full"
            style={{
              left: "-150%",
              background:
                "linear-gradient(to right, transparent, rgba(255,255,255,0.4), transparent)",
              transform: "skewX(20deg)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
