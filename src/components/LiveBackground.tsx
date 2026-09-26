import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Compass, Terminal, Sun, Moon, Pause, Play, Wand2 } from 'lucide-react';

export type BackgroundTheme = 'study-library' | 'cyber-work' | 'motivational-sunrise' | 'midnight-rain';

interface LiveBackgroundProps {
  theme: BackgroundTheme;
  onChangeTheme?: (newTheme: BackgroundTheme) => void;
}

export const MOTIVATIONAL_QUOTES = [
  'Every single algorithm you master brings your Day-1 offer closer.',
  'Consistency is the compound interest of placement success.',
  'Calm mind. Clear invariants. Unstoppable executive presence.',
  'Do not fear the hidden test cases — they build your engineering armor.',
  'Small daily problem sprints conquer the highest campus hiring bars.',
  'You are not just learning syntax; you are engineering your career.',
  'Break big problems down: brute force first, then optimize the bottleneck.'
];

export const LiveBackground: React.FC<LiveBackgroundProps> = ({ theme, onChangeTheme }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentQuoteIdx, setCurrentQuoteIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: -1000, y: -1000, active: false });

  // Rotate motivational quote gently
  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuoteIdx((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
    }, 7500);
    return () => clearInterval(quoteInterval);
  }, []);

  // Track mouse coordinates for interactive particle attraction
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
    };
    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle structures
    interface StarParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      baseAlpha: number;
      alpha: number;
      pulseSpeed: number;
      color: string;
    }

    interface CyberParticle {
      x: number;
      y: number;
      speed: number;
      char: string;
      size: number;
      alpha: number;
      color: string;
    }

    interface AuroraWave {
      yOffset: number;
      amplitude: number;
      frequency: number;
      speed: number;
      color: string;
    }

    interface RainDrop {
      x: number;
      y: number;
      length: number;
      speed: number;
      alpha: number;
    }

    interface Ripple {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      alpha: number;
    }

    // 1. Study Stars
    const stars: StarParticle[] = [];
    for (let i = 0; i < 70; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -0.2 - Math.random() * 0.3,
        size: Math.random() * 2.5 + 0.8,
        baseAlpha: Math.random() * 0.5 + 0.3,
        alpha: Math.random() * 0.5 + 0.3,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        color: ['#818cf8', '#a78bfa', '#c084fc', '#38bdf8', '#fbbf24'][Math.floor(Math.random() * 5)]
      });
    }

    // 2. Cyber Glyphs
    const glyphs = ['0', '1', '{ }', 'O(1)', 'O(N)', 'DFS', 'BFS', 'DP', '=>', 'API', 'DB', 'SQL', '&&', '||', 'const'];
    const cyberParticles: CyberParticle[] = [];
    for (let i = 0; i < 50; i++) {
      cyberParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speed: 1.2 + Math.random() * 2.2,
        char: glyphs[Math.floor(Math.random() * glyphs.length)],
        size: Math.floor(Math.random() * 4) + 10,
        alpha: Math.random() * 0.6 + 0.2,
        color: ['#38bdf8', '#34d399', '#818cf8', '#22d3ee'][Math.floor(Math.random() * 4)]
      });
    }

    // 3. Sunrise Sparks & Waves
    const sunriseSparks: StarParticle[] = [];
    for (let i = 0; i < 55; i++) {
      sunriseSparks.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -0.6 - Math.random() * 1.0,
        size: Math.random() * 3 + 1,
        baseAlpha: Math.random() * 0.6 + 0.2,
        alpha: Math.random() * 0.6 + 0.2,
        pulseSpeed: 0.03 + Math.random() * 0.04,
        color: ['#fbbf24', '#f59e0b', '#fb923c', '#f43f5e', '#fed7aa'][Math.floor(Math.random() * 5)]
      });
    }

    // 4. Rain & Ripples
    const rainDrops: RainDrop[] = [];
    const ripples: Ripple[] = [];
    for (let i = 0; i < 85; i++) {
      rainDrops.push({
        x: Math.random() * (width + 100),
        y: Math.random() * height,
        length: 12 + Math.random() * 20,
        speed: 7 + Math.random() * 8,
        alpha: 0.2 + Math.random() * 0.4
      });
    }

    let tick = 0;

    const render = () => {
      if (!ctx || !canvas) return;
      tick++;

      // Theme-specific clearing
      if (theme === 'cyber-work') {
        ctx.fillStyle = 'rgba(2, 6, 23, 0.25)'; // Smooth digital phosphorescent trails
        ctx.fillRect(0, 0, width, height);
      } else {
        ctx.clearRect(0, 0, width, height);
      }

      if (!isPaused) {
        const mouse = mouseRef.current;

        // ==========================================
        // THEME 1: CELESTIAL STUDY CONSTELLATION
        // ==========================================
        if (theme === 'study-library') {
          // Draw ambient connecting web
          for (let i = 0; i < stars.length; i++) {
            const s = stars[i];
            s.x += s.vx;
            s.y += s.vy;
            s.alpha = s.baseAlpha + Math.sin(tick * s.pulseSpeed) * 0.2;

            if (s.y < 0) s.y = height + 10;
            if (s.x < 0) s.x = width;
            if (s.x > width) s.x = 0;

            // Interactive attraction to mouse
            if (mouse.active) {
              const dx = mouse.x - s.x;
              const dy = mouse.y - s.y;
              const dist = Math.hypot(dx, dy);
              if (dist < 160) {
                s.x += (dx / dist) * 0.6;
                s.y += (dy / dist) * 0.6;
                // Connect star to mouse
                ctx.beginPath();
                ctx.moveTo(s.x, s.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.strokeStyle = `rgba(165, 180, 252, ${(1 - dist / 160) * 0.4})`;
                ctx.lineWidth = 0.8;
                ctx.stroke();
              }
            }

            // Draw glowing star node
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            ctx.fillStyle = s.color;
            ctx.shadowBlur = 12;
            ctx.shadowColor = s.color;
            ctx.globalAlpha = Math.max(0.1, Math.min(1, s.alpha));
            ctx.fill();

            // Connect nearby stars
            for (let j = i + 1; j < stars.length; j++) {
              const s2 = stars[j];
              const dist = Math.hypot(s.x - s2.x, s.y - s2.y);
              if (dist < 110) {
                ctx.beginPath();
                ctx.moveTo(s.x, s.y);
                ctx.lineTo(s2.x, s2.y);
                ctx.strokeStyle = `rgba(129, 140, 248, ${(1 - dist / 110) * 0.25})`;
                ctx.lineWidth = 0.6;
                ctx.stroke();
              }
            }
          }
          ctx.globalAlpha = 1.0;
          ctx.shadowBlur = 0;
        }

        // ==========================================
        // THEME 2: HOLOGRAPHIC CYBER GRID & TERMINAL
        // ==========================================
        else if (theme === 'cyber-work') {
          // Perspective grid lines at bottom
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
          ctx.lineWidth = 1;
          const horizonY = height * 0.7;

          // Vertical converging grid lines
          for (let x = -width; x < width * 2; x += 120) {
            ctx.beginPath();
            ctx.moveTo(width / 2 + (x - width / 2) * 0.1, horizonY);
            ctx.lineTo(x, height);
            ctx.stroke();
          }

          // Horizontal grid lines
          for (let y = horizonY; y < height; y += (height - y) * 0.25 + 10) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
          }

          // Streaming code glyphs
          ctx.font = '12px "JetBrains Mono", Menlo, monospace';
          for (let i = 0; i < cyberParticles.length; i++) {
            const p = cyberParticles[i];
            p.y += p.speed;

            if (p.y > height + 20) {
              p.y = -20;
              p.x = Math.random() * width;
              p.char = glyphs[Math.floor(Math.random() * glyphs.length)];
            }

            ctx.fillStyle = p.color;
            ctx.shadowBlur = 8;
            ctx.shadowColor = p.color;
            ctx.globalAlpha = p.alpha;
            ctx.fillText(p.char, p.x, p.y);
          }
          ctx.globalAlpha = 1.0;
          ctx.shadowBlur = 0;
        }

        // ==========================================
        // THEME 3: SUNRISE AURORA AMBITION
        // ==========================================
        else if (theme === 'motivational-sunrise') {
          // Aurora wave ribbon across upper screen
          const waveCount = 3;
          for (let w = 0; w < waveCount; w++) {
            ctx.beginPath();
            ctx.moveTo(0, height * 0.35);

            for (let x = 0; x <= width; x += 30) {
              const y =
                height * 0.35 +
                Math.sin(x * 0.003 + tick * 0.015 + w * 1.5) * 45 +
                Math.cos(x * 0.006 + tick * 0.01) * 25;
              ctx.lineTo(x, y);
            }

            ctx.lineTo(width, height);
            ctx.lineTo(0, height);
            ctx.closePath();

            const grad = ctx.createLinearGradient(0, height * 0.2, 0, height);
            if (w === 0) {
              grad.addColorStop(0, 'rgba(245, 158, 11, 0.07)');
              grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            } else if (w === 1) {
              grad.addColorStop(0, 'rgba(244, 63, 94, 0.06)');
              grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            } else {
              grad.addColorStop(0, 'rgba(251, 191, 36, 0.05)');
              grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            }
            ctx.fillStyle = grad;
            ctx.fill();
          }

          // Rising motivational embers & sparks
          for (let i = 0; i < sunriseSparks.length; i++) {
            const sp = sunriseSparks[i];
            sp.x += sp.vx;
            sp.y += sp.vy;
            sp.alpha = sp.baseAlpha + Math.sin(tick * sp.pulseSpeed) * 0.2;

            if (sp.y < 0) {
              sp.y = height + 10;
              sp.x = Math.random() * width;
            }

            ctx.beginPath();
            ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
            ctx.fillStyle = sp.color;
            ctx.shadowBlur = 14;
            ctx.shadowColor = sp.color;
            ctx.globalAlpha = Math.max(0.1, Math.min(1, sp.alpha));
            ctx.fill();
          }
          ctx.globalAlpha = 1.0;
          ctx.shadowBlur = 0;
        }

        // ==========================================
        // THEME 4: BIOLUMINESCENT RAIN & NEON RIPPLES
        // ==========================================
        else if (theme === 'midnight-rain') {
          ctx.lineWidth = 1.2;

          for (let i = 0; i < rainDrops.length; i++) {
            const r = rainDrops[i];
            r.y += r.speed;
            r.x -= 0.6; // gentle wind slant

            if (r.y > height) {
              // Trigger ripple on surface
              if (Math.random() > 0.4 && ripples.length < 25) {
                ripples.push({
                  x: r.x,
                  y: height - Math.random() * 40,
                  radius: 2,
                  maxRadius: 18 + Math.random() * 20,
                  alpha: 0.7
                });
              }
              r.y = -30;
              r.x = Math.random() * (width + 120);
            }

            ctx.beginPath();
            ctx.moveTo(r.x, r.y);
            ctx.lineTo(r.x - 2, r.y + r.length);
            ctx.strokeStyle = `rgba(147, 197, 253, ${r.alpha * 0.7})`;
            ctx.stroke();
          }

          // Draw and expand ripples
          for (let i = ripples.length - 1; i >= 0; i--) {
            const rip = ripples[i];
            rip.radius += 0.7;
            rip.alpha -= 0.018;

            if (rip.alpha <= 0 || rip.radius >= rip.maxRadius) {
              ripples.splice(i, 1);
              continue;
            }

            ctx.beginPath();
            ctx.ellipse(rip.x, rip.y, rip.radius * 2, rip.radius * 0.6, 0, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(56, 189, 248, ${rip.alpha * 0.6})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [theme, isPaused]);

  // Ambient gradient backdrop configurations
  const themeGradients: Record<BackgroundTheme, string> = {
    'study-library': 'from-slate-950 via-slate-900/90 to-indigo-950/50',
    'cyber-work': 'from-slate-950 via-slate-950/95 to-sky-950/40',
    'motivational-sunrise': 'from-slate-950 via-slate-900/90 to-amber-950/40',
    'midnight-rain': 'from-slate-950 via-slate-900/95 to-cyan-950/30'
  };

  const themeMeta: Record<BackgroundTheme, { name: string; icon: any; color: string }> = {
    'study-library': { name: 'Celestial Library', icon: Compass, color: 'text-indigo-400' },
    'cyber-work': { name: 'Silicon Cyber Grid', icon: Terminal, color: 'text-cyan-400' },
    'motivational-sunrise': { name: 'Dawn Ambition', icon: Sun, color: 'text-amber-400' },
    'midnight-rain': { name: 'Midnight Zen Rain', icon: Moon, color: 'text-blue-400' }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Dynamic Background Base Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-b ${themeGradients[theme]} transition-colors duration-1000`} />

      {/* Atmospheric Multi-stop Glowing Nebulas */}
      {theme === 'study-library' && (
        <>
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] bg-indigo-600/12 rounded-full blur-[140px] pointer-events-none animate-pulse" />
          <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-purple-600/8 rounded-full blur-[120px] pointer-events-none" />
        </>
      )}
      {theme === 'cyber-work' && (
        <>
          <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-600/12 rounded-full blur-[150px] pointer-events-none" />
          <div className="absolute top-10 right-1/4 w-[600px] h-[600px] bg-emerald-600/8 rounded-full blur-[130px] pointer-events-none" />
        </>
      )}
      {theme === 'motivational-sunrise' && (
        <>
          <div className="absolute top-1/4 right-1/4 w-[850px] h-[850px] bg-amber-500/12 rounded-full blur-[150px] pointer-events-none" />
          <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-rose-500/8 rounded-full blur-[140px] pointer-events-none" />
        </>
      )}
      {theme === 'midnight-rain' && (
        <>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none" />
        </>
      )}

      {/* Live Running Interactive Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Floating Ambient Theme HUD & Motivational Strip (Bottom Center) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 pointer-events-auto max-w-[95vw]">
        {/* Quote Pill */}
        <div className="px-4 py-1.5 rounded-full bg-slate-950/75 border border-slate-800/80 backdrop-blur-md shadow-2xl flex items-center gap-2 text-[11px] text-slate-300 truncate">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
          <span className="truncate italic">"{MOTIVATIONAL_QUOTES[currentQuoteIdx]}"</span>
        </div>

        {/* Quick Theme Switchers & Pause Button */}
        <div className="hidden sm:flex items-center gap-1 p-1 rounded-full bg-slate-950/80 border border-slate-800/80 backdrop-blur-md shadow-xl">
          {(Object.keys(themeMeta) as BackgroundTheme[]).map((tKey) => {
            const meta = themeMeta[tKey];
            const Icon = meta.icon;
            const isSelected = theme === tKey;
            return (
              <button
                key={tKey}
                onClick={() => onChangeTheme?.(tKey)}
                title={`Switch to ${meta.name}`}
                className={`p-1.5 rounded-full transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </button>
            );
          })}

          <button
            onClick={() => setIsPaused(!isPaused)}
            title={isPaused ? 'Resume Background Motion' : 'Pause Background Motion'}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
          </button>
        </div>
      </div>
    </div>
  );
};
