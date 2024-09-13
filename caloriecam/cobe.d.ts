// cobe.d.ts
declare module 'cobe' {
  export default function createGlobe(canvas: HTMLCanvasElement, options: any): {
    destroy: () => void;
  };
}
