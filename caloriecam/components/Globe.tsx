import React, { useRef, useEffect } from 'react';
import createGlobe from 'cobe';

const Globe_on = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      let currentPhi = 0;

      const globe = createGlobe(canvasRef.current, {
        devicePixelRatio: window.devicePixelRatio || 1,
        width: 450, // Adjusted width for better fit
        height: 450, // Adjusted height for better fit
        phi: 0,
        theta: 0,
        dark: 1,
        diffuse: 1.2,
        mapSamples: 10000,
        mapBrightness: 10,
        baseColor: [0.3, 0.3, 0.3],
        markerColor: [0.1, 0.8, 1],
        glowColor: [1, 1, 1],
        markers: [
          { location: [37.7595, -122.4367], size: 0.03 },
          { location: [40.7128, -74.006], size: 0.1 },
        ],
        onRender: (state: { phi: number }) => { // Added type annotation
          state.phi = currentPhi;
          currentPhi += 0.01;
        },
      });

      return () => {
        globe.destroy();
      };
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: 450, height: 450, maxWidth: '100%', aspectRatio: '1' }} // Adjusted style for width and height
    />
  );
};

export default Globe_on;