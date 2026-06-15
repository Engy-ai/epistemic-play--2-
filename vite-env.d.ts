/// <reference types="vite/client" />

// Resolve the pdf.js worker module to a type stub so TypeScript does not try to
// parse the giant minified file (its deeply nested expressions overflow tsc).
declare module 'pdfjs-dist/build/pdf.worker.min.mjs' {
  export const WorkerMessageHandler: unknown;
  const workerModule: unknown;
  export default workerModule;
}
