import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import * as pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { ChevronLeft, ChevronRight, Download, Loader2 } from 'lucide-react';

// Run pdf.js on the main thread by registering the worker message handler on
// globalThis. Module workers (the only build pdf.js v4 ships) silently fail to
// complete their handshake inside some embedded webviews, which left the
// viewer hanging on "Binding pages…". The main-thread path is fast enough here.
(globalThis as any).pdfjsWorker = pdfjsWorker;
pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

const PDF_URL = `${import.meta.env.BASE_URL}thesis.pdf`;
const RENDER_SCALE = 1.5;

type Flip = {
  dir: 'next' | 'prev';
  frontNum: number;
  backNum: number;
  baseLeftNum: number;
  baseRightNum: number;
} | null;

const ThesisBook: React.FC = () => {
  const pdfRef = useRef<any>(null);
  const cacheRef = useRef<Record<number, string>>({});
  const [numPages, setNumPages] = useState(0);
  const [aspect, setAspect] = useState(0.707); // single page width / height
  const [spread, setSpread] = useState(0);
  const [images, setImages] = useState<Record<number, string>>({});
  const [flip, setFlip] = useState<Flip>(null);
  const [fadeKey, setFadeKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pairing: spread 0 = page 1 alone (cover); spread s = [page 2s | page 2s+1].
  // A trailing lone page (last spread) is also shown alone.
  const numSpreads = numPages ? Math.floor(numPages / 2) + 1 : 0;
  const leftNumFor = (s: number) => (s === 0 ? 0 : 2 * s);
  const rightNumFor = (s: number) => (s === 0 ? 1 : 2 * s + 1);
  const valid = (n: number) => n >= 1 && n <= numPages;
  const isSingle = (s: number) => valid(leftNumFor(s)) !== valid(rightNumFor(s));

  const renderPage = useCallback(async (n: number) => {
    if (!n || cacheRef.current[n] || !pdfRef.current || n < 1 || n > pdfRef.current.numPages) return;
    const pdfPage = await pdfRef.current.getPage(n);
    const viewport = pdfPage.getViewport({ scale: RENDER_SCALE });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    await pdfPage.render({ canvasContext: ctx, viewport }).promise;
    const url = canvas.toDataURL('image/jpeg', 0.85);
    cacheRef.current[n] = url;
    setImages((prev) => ({ ...prev, [n]: url }));
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const task = pdfjsLib.getDocument({ url: PDF_URL });
        const pdf = await task.promise;
        if (cancelled) return;
        pdfRef.current = pdf;
        setNumPages(pdf.numPages);
        const first = await pdf.getPage(1);
        const vp = first.getViewport({ scale: 1 });
        setAspect(vp.width / vp.height);
        // Render the cover before revealing the book so it appears with content.
        await renderPage(1);
        if (cancelled) return;
        setLoading(false);
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setError('Could not load the thesis PDF.');
          setLoading(false);
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Pre-render the pages for the current spread and its neighbours.
  useEffect(() => {
    if (loading) return;
    [spread - 1, spread, spread + 1].forEach((s) => {
      if (s < 0 || s >= numSpreads) return;
      renderPage(leftNumFor(s));
      renderPage(rightNumFor(s));
    });
  }, [spread, loading, numSpreads, renderPage]);

  const goNext = () => {
    if (flip || spread >= numSpreads - 1) return;
    const cur = spread, nxt = spread + 1;
    renderPage(leftNumFor(nxt));
    renderPage(rightNumFor(nxt));
    // Single page involved on either side → simple fade, no spread leaf turn.
    if (isSingle(cur) || isSingle(nxt)) {
      setFadeKey((k) => k + 1);
      setSpread(nxt);
      return;
    }
    setFlip({
      dir: 'next',
      frontNum: rightNumFor(cur),
      backNum: leftNumFor(nxt),
      baseLeftNum: leftNumFor(cur),
      baseRightNum: rightNumFor(nxt),
    });
  };

  const goPrev = () => {
    if (flip || spread <= 0) return;
    const cur = spread, prv = spread - 1;
    renderPage(leftNumFor(prv));
    renderPage(rightNumFor(prv));
    if (isSingle(cur) || isSingle(prv)) {
      setFadeKey((k) => k + 1);
      setSpread(prv);
      return;
    }
    setFlip({
      dir: 'prev',
      frontNum: rightNumFor(prv),
      backNum: leftNumFor(cur),
      baseLeftNum: leftNumFor(prv),
      baseRightNum: rightNumFor(cur),
    });
  };

  const onFlipEnd = () => {
    if (!flip) return;
    setSpread((s) => (flip.dir === 'next' ? s + 1 : s - 1));
    setFlip(null);
  };

  const baseLeftNum = flip ? flip.baseLeftNum : leftNumFor(spread);
  const baseRightNum = flip ? flip.baseRightNum : rightNumFor(spread);

  const singleView = !flip && isSingle(spread);
  const singleNum = valid(leftNumFor(spread)) ? leftNumFor(spread) : rightNumFor(spread);

  const curLeft = leftNumFor(spread);
  const curRight = rightNumFor(spread);
  const rangeLabel = isSingle(spread)
    ? `${singleNum}`
    : `${curLeft}–${curRight}`;

  const PageFace = ({ n, side }: { n: number; side: 'left' | 'right' | 'single' }) => {
    if (!valid(n)) return <div className={`book-pageimg ${side} book-blank`} />;
    if (!images[n]) {
      return (
        <div className={`book-pageimg ${side} flex items-center justify-center`}>
          <Loader2 size={20} className="animate-spin text-[var(--accent)]" />
        </div>
      );
    }
    return <img src={images[n]} className={`book-pageimg ${side}`} alt={`Page ${n}`} />;
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="file-meta mb-6 flex items-center gap-3">
        <span>Bound volume · Thesis</span>
        <span className="text-[var(--text-muted)]">·</span>
        <span>{numPages ? `${isSingle(spread) ? 'p.' : 'pp.'} ${rangeLabel} / ${numPages}` : '—'}</span>
      </div>

      <div
        className="book-stage w-full max-w-[920px]"
        style={{ aspectRatio: String(aspect * 2) }}
      >
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-[var(--text-secondary)]">
            <Loader2 size={28} className="animate-spin text-[var(--accent)]" />
            <span className="file-meta">Binding pages…</span>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center px-6">
            <p className="text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-serif)' }}>{error}</p>
            <a href={PDF_URL} target="_blank" rel="noopener noreferrer" className="thesis-btn-secondary px-4 py-2 inline-flex items-center gap-2">
              <Download size={14} /> Open PDF
            </a>
          </div>
        )}

        {!loading && !error && (
          singleView ? (
            <div key={fadeKey} className="book-single book-fade">
              <PageFace n={singleNum} side="single" />
            </div>
          ) : (
            <div key={fadeKey} className="book-spread book-fade">
              <div className="book-half">
                <PageFace n={baseLeftNum} side="left" />
              </div>
              <div className="book-half">
                <PageFace n={baseRightNum} side="right" />
              </div>
              <div className="book-spine-center" />

              {flip && (
                <div
                  className={`spread-leaf ${flip.dir === 'next' ? 'leaf-next' : 'leaf-prev'}`}
                  onAnimationEnd={onFlipEnd}
                >
                  <div className="leaf-face leaf-front">
                    <PageFace n={flip.frontNum} side="right" />
                  </div>
                  <div className="leaf-face leaf-back">
                    <PageFace n={flip.backNum} side="left" />
                  </div>
                </div>
              )}
            </div>
          )
        )}
      </div>

      {!loading && !error && (
        <div className="flex items-center gap-5 mt-7">
          <button
            onClick={goPrev}
            disabled={spread <= 0 || !!flip}
            className="thesis-btn-secondary w-11 h-11 flex items-center justify-center rounded-full disabled:opacity-30"
            aria-label="Previous spread"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="file-meta min-w-[110px] text-center">{isSingle(spread) ? 'p.' : 'pp.'} {rangeLabel} / {numPages}</span>
          <button
            onClick={goNext}
            disabled={spread >= numSpreads - 1 || !!flip}
            className="thesis-btn-secondary w-11 h-11 flex items-center justify-center rounded-full disabled:opacity-30"
            aria-label="Next spread"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ThesisBook;
