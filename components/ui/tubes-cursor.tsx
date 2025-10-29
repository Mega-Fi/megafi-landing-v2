"use client"

import React, { useEffect, useRef, useState } from 'react';

export default function TubesCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<any>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  /**
   * Generates an array of random hex color strings.
   * @param {number} count - The number of random colors to generate.
   * @returns {string[]} An array of color strings.
   */
  const randomColors = (count: number): string[] => {
    return new Array(count)
      .fill(0)
      .map(() => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'));
  };

  // Load the module and initialize animation
  useEffect(() => {
    if (!canvasRef.current) return;

    let mounted = true;
    
    const initTimer = setTimeout(async () => {
      try {
        // Dynamically import the module in the browser
        const module = await import(
          /* webpackIgnore: true */
          'https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js'
        );
        
        if (!mounted || !canvasRef.current) return;
        
        const TubesCursorFn = module.default;
        console.log('TubesCursor module loaded:', TubesCursorFn);
        
        const app = TubesCursorFn(canvasRef.current, {
          tubes: {
            colors: ["#CC2E18", "#CC1862", "#B81880"], // Darker orange to magenta gradient
            lights: {
              intensity: 150,
              colors: ["#CC2E18", "#CC5540", "#CC1862", "#B81880"] // Muted orange to coral to pink to magenta
            }
          }
        });
        
        appRef.current = app;
        setIsScriptLoaded(true);
        console.log('TubesCursor initialized successfully');
      } catch (error) {
        console.error('Error loading or initializing TubesCursor:', error);
      }
    }, 100);

    return () => {
      mounted = false;
      clearTimeout(initTimer);
      if (appRef.current && typeof appRef.current.dispose === 'function') {
        appRef.current.dispose();
      }
    };
  }, []);

  const handleClick = () => {
    if (appRef.current) {
      const newTubeColors = randomColors(3);
      const newLightColors = randomColors(4);
      
      appRef.current.tubes.setColors(newTubeColors);
      appRef.current.tubes.setLightsColors(newLightColors);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="h-screen w-screen bg-background font-sans overflow-hidden cursor-pointer relative"
    >
      {/* Canvas with mix-blend-mode to allow background to show through dark areas 
          In light mode, increase brightness and contrast to make tubes more visible */}
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 z-0 mix-blend-screen dark:brightness-100 dark:contrast-100 brightness-150 contrast-125 dark:saturate-100 saturate-150" 
      />
      
      <div className="relative h-full flex flex-col items-center justify-end pb-20 gap-4 z-10">
        <h1 className="m-0 p-0 text-foreground text-[90px] md:text-[100px] font-bold uppercase leading-tight select-none dark:[text-shadow:0_0_30px_rgba(0,0,0,0.9)] [text-shadow:0_0_30px_rgba(255,255,255,0.4)] text-center font-jost">
          Real Time DeFi
        </h1>
        <p className="m-0 p-0 text-foreground/80 text-2xl md:text-3xl font-light leading-none select-none dark:[text-shadow:0_0_20px_rgba(0,0,0,1)] [text-shadow:0_0_20px_rgba(255,255,255,0.5)]">
          Powered by MegaETH. Engineered for Infinity.
        </p>
      </div>
    </div>
  );
}

