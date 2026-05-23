'use client';
import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  alpha: number;
}

function drawVessel(ctx: CanvasRenderingContext2D, cx: number) {
  // Outer vessel glow
  const glow = ctx.createRadialGradient(cx, 28, 2, cx, 28, 32);
  glow.addColorStop(0, 'rgba(240,192,80,0.18)');
  glow.addColorStop(1, 'rgba(240,192,80,0)');
  ctx.beginPath();
  ctx.ellipse(cx, 28, 32, 18, 0, 0, Math.PI * 2);
  ctx.fillStyle = glow;
  ctx.fill();

  // Vessel body (rounded bottom pot)
  ctx.save();
  const bodyGrd = ctx.createLinearGradient(cx - 24, 14, cx + 24, 50);
  bodyGrd.addColorStop(0, '#e8c06a');
  bodyGrd.addColorStop(0.4, '#f5d07a');
  bodyGrd.addColorStop(0.7, '#c8973f');
  bodyGrd.addColorStop(1, '#a0720e');
  ctx.fillStyle = bodyGrd;
  ctx.beginPath();
  ctx.moveTo(cx - 24, 22);
  ctx.bezierCurveTo(cx - 24, 14, cx + 24, 14, cx + 24, 22);
  ctx.bezierCurveTo(cx + 20, 40, cx + 10, 48, cx, 50);
  ctx.bezierCurveTo(cx - 10, 48, cx - 20, 40, cx - 24, 22);
  ctx.closePath();
  ctx.fill();

  // Vessel rim/lip highlight
  const rimGrd = ctx.createLinearGradient(cx - 26, 14, cx + 26, 22);
  rimGrd.addColorStop(0, '#f5e0a0');
  rimGrd.addColorStop(0.5, '#dbb060');
  rimGrd.addColorStop(1, '#b8870e');
  ctx.strokeStyle = rimGrd;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(cx - 26, 20);
  ctx.bezierCurveTo(cx - 14, 14, cx + 14, 14, cx + 26, 20);
  ctx.stroke();

  // Top opening ellipse
  const topGrd = ctx.createLinearGradient(cx - 20, 13, cx + 20, 21);
  topGrd.addColorStop(0, 'rgba(245,222,140,0.9)');
  topGrd.addColorStop(1, 'rgba(180,128,32,0.6)');
  ctx.beginPath();
  ctx.ellipse(cx, 17, 22, 8, 0, 0, Math.PI * 2);
  ctx.fillStyle = topGrd;
  ctx.fill();
  ctx.strokeStyle = 'rgba(200,150,50,0.7)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Inner oil surface shimmer
  const innerGrd = ctx.createRadialGradient(cx, 17, 0, cx, 17, 18);
  innerGrd.addColorStop(0, 'rgba(255,228,120,0.7)');
  innerGrd.addColorStop(1, 'rgba(200,150,60,0.1)');
  ctx.beginPath();
  ctx.ellipse(cx, 17, 16, 5.5, 0, 0, Math.PI * 2);
  ctx.fillStyle = innerGrd;
  ctx.fill();

  ctx.restore();
}

export default function ShirodharaPourAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rawCtx = canvas.getContext('2d');
    if (!rawCtx) return;
    const ctx: CanvasRenderingContext2D = rawCtx;

    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const pourY = 52;

    function spawnParticle() {
      const sway = Math.sin(timeRef.current * 0.025) * 3;
      particlesRef.current.push({
        x: cx + sway + (Math.random() - 0.5) * 2.5,
        y: pourY + 2,
        vx: (Math.random() - 0.5) * 0.3,
        vy: 1.8 + Math.random() * 1.2,
        life: 0,
        maxLife: 55 + Math.random() * 35,
        size: 1.8 + Math.random() * 2.8,
        alpha: 0.75 + Math.random() * 0.25,
      });
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      // Draw golden vessel
      drawVessel(ctx, cx);

      // Swaying oil stream
      const t = timeRef.current;
      ctx.save();
      const streamGrd = ctx.createLinearGradient(0, pourY, 0, H - 25);
      streamGrd.addColorStop(0, 'rgba(220,168,72,0.92)');
      streamGrd.addColorStop(0.35, 'rgba(200,150,60,0.68)');
      streamGrd.addColorStop(0.75, 'rgba(184,134,12,0.35)');
      streamGrd.addColorStop(1, 'rgba(170,120,0,0.08)');
      ctx.strokeStyle = streamGrd;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(cx, pourY);
      for (let y = pourY; y < H - 25; y += 4) {
        const progress = (y - pourY) / (H - 25 - pourY);
        const sw = Math.sin(t * 0.025 + y * 0.045) * (1.5 + progress * 2.5);
        ctx.lineTo(cx + sw, y);
      }
      ctx.stroke();

      // Stream core highlight
      const streamCore = ctx.createLinearGradient(0, pourY, 0, H - 60);
      streamCore.addColorStop(0, 'rgba(255,230,140,0.7)');
      streamCore.addColorStop(1, 'rgba(255,210,100,0.0)');
      ctx.strokeStyle = streamCore;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(cx, pourY);
      for (let y = pourY; y < H - 60; y += 4) {
        const progress = (y - pourY) / (H - 60 - pourY);
        const sw = Math.sin(t * 0.025 + y * 0.045) * (1.5 + progress * 2.5);
        ctx.lineTo(cx + sw * 0.6, y);
      }
      ctx.stroke();
      ctx.restore();

      // Pool glow at bottom
      const ripplePhase = Math.sin(t * 0.04) * 0.5 + 0.5;
      const poolW = 30 + ripplePhase * 6;
      const poolH = 7 + ripplePhase * 2;
      const poolGrd = ctx.createRadialGradient(cx, H - 18, 0, cx, H - 18, poolW);
      poolGrd.addColorStop(0, 'rgba(220,175,80,0.55)');
      poolGrd.addColorStop(0.5, 'rgba(200,155,60,0.22)');
      poolGrd.addColorStop(1, 'rgba(184,134,11,0)');
      ctx.beginPath();
      ctx.ellipse(cx, H - 18, poolW, poolH, 0, 0, Math.PI * 2);
      ctx.fillStyle = poolGrd;
      ctx.fill();

      // Ripple rings
      for (let r = 0; r < 3; r++) {
        const phase = ((t * 0.03 + r * 0.8) % 1);
        const rippleR = phase * 28 + 4;
        const rippleAlpha = (1 - phase) * 0.25;
        ctx.beginPath();
        ctx.ellipse(cx, H - 18, rippleR, rippleR * 0.28, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(200,155,60,${rippleAlpha})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // Particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.06;
        p.vx += (Math.random() - 0.5) * 0.04;
        p.life++;

        if (p.life >= p.maxLife || p.y > H - 5) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        const lifeRatio = p.life / p.maxLife;
        const alpha = p.alpha * (1 - lifeRatio * lifeRatio);
        const dropGrd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        dropGrd.addColorStop(0, `rgba(250,205,100,${alpha})`);
        dropGrd.addColorStop(0.6, `rgba(210,165,60,${alpha * 0.6})`);
        dropGrd.addColorStop(1, `rgba(180,130,10,0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = dropGrd;
        ctx.fill();
      }

      timeRef.current++;
      if (timeRef.current % 2 === 0) spawnParticle();
      animRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={120}
      height={220}
      style={{
        display: 'block',
        marginBottom: 8,
        filter: 'drop-shadow(0 4px 12px rgba(184,134,11,0.25))',
      }}
      aria-label="Animated Shirodhara oil pouring ritual"
    />
  );
}
