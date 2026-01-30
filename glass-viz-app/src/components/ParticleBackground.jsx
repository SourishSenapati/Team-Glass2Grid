import React, { useEffect, useRef } from 'react';

const ParticleBackground = () => {
    const canvasRef = useRef(null);
    const particles = useRef([]);
    const mouse = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        let animationFrameId;
        
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        const initParticles = () => {
             const count = Math.min(window.innerWidth / 15, 100);
             particles.current = [];
             for(let i=0; i<count; i++) {
                 particles.current.push({
                     x: Math.random() * canvas.width,
                     y: Math.random() * canvas.height,
                     vx: (Math.random() - 0.5) * 0.5,
                     vy: (Math.random() - 0.5) * 0.5,
                     size: Math.random() * 2 + 1,
                     alpha: Math.random() * 0.5 + 0.1
                 });
             }
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw connection lines
            ctx.lineWidth = 0.5;
            for(let i=0; i<particles.current.length; i++) {
                const p = particles.current[i];
                
                // Move
                p.x += p.vx;
                p.y += p.vy;

                // Bounce
                if(p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if(p.y < 0 || p.y > canvas.height) p.vy *= -1;

                // Mouse interaction
                const dx = mouse.current.x - p.x;
                const dy = mouse.current.y - p.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                
                if(dist < 200) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 255, 204, ${1 - dist/200})`;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouse.current.x, mouse.current.y);
                    ctx.stroke();
                }

                // Draw Particle
                ctx.beginPath();
                ctx.fillStyle = `rgba(0, 255, 204, ${p.alpha})`;
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        const handleMouseMove = (e) => {
            mouse.current = { x: e.clientX, y: e.clientY };
        };

        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('mousemove', handleMouseMove);
        
        resizeCanvas();
        draw();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas 
            ref={canvasRef} 
            className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 opacity-40 mix-blend-screen"
        />
    );
};

export default ParticleBackground;
