import {useEffect, useRef, useState} from 'react';
import {getDocument, GlobalWorkerOptions, type PDFDocumentProxy} from 'pdfjs-dist/legacy/build/pdf.mjs';
import workerUrl from 'pdfjs-dist/legacy/build/pdf.worker.min.mjs?url';
import {signedLink, type Resource} from './client';

GlobalWorkerOptions.workerSrc = workerUrl;
const maximumBytes = 25 * 1024 * 1024;

export default function PdfPreview({resource,teacher}:{resource:Resource;teacher:boolean}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [pdf,setPdf] = useState<PDFDocumentProxy|null>(null);
  const [page,setPage] = useState(1);
  const [zoom,setZoom] = useState(1);
  const [error,setError] = useState('');
  const [attempt,setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let task:ReturnType<typeof getDocument>|undefined;
    setPdf(null); setError(''); setPage(1);
    void (async () => {
      try {
        if (resource.file_size > maximumBytes) throw Error('This PDF is too large to preview.');
        const url = await signedLink(resource.id,true,teacher);
        const response = await fetch(url,{signal:controller.signal,referrerPolicy:'no-referrer'});
        if (!response.ok || !response.body) throw Error('PDF could not load.');
        const reader = response.body.getReader();
        const chunks:Uint8Array[] = [];
        let size = 0;
        for (;;) {
          const {done,value} = await reader.read();
          if (done) break;
          size += value.byteLength;
          if (size > maximumBytes) { await reader.cancel(); throw Error('This PDF is too large to preview.'); }
          chunks.push(value);
        }
        const data = new Uint8Array(size);
        let offset = 0;
        for (const chunk of chunks) { data.set(chunk,offset); offset += chunk.byteLength; }
        if (controller.signal.aborted) return;
        // Render canvas pixels only. Document actions, forms, links and scripts are never mounted.
        task = getDocument({data,enableXfa:false,maxImageSize:16_000_000,canvasMaxAreaInBytes:32*1024*1024});
        const document = await task.promise;
        if (!controller.signal.aborted) setPdf(document);
      } catch (reason) {
        if (!controller.signal.aborted) setError((reason as Error).name === 'PasswordException'
          ? 'This PDF requires a password. Download it to open it with the password.'
          : 'PDF preview could not load. Retry or download the original.');
      }
    })();
    return () => { controller.abort(); void task?.destroy().catch(() => {}); };
  },[resource.id,resource.file_size,teacher,attempt]);

  useEffect(() => {
    if (!pdf || !canvas.current) return;
    let active = true;
    let rendering:ReturnType<Awaited<ReturnType<PDFDocumentProxy['getPage']>>['render']>|undefined;
    const target = canvas.current;
    void pdf.getPage(page).then(documentPage => {
      if (!active) return;
      const base = documentPage.getViewport({scale:1});
      const scale = Math.min(800*zoom/base.width, Math.sqrt(4_000_000/(base.width*base.height)));
      const viewport = documentPage.getViewport({scale});
      target.width = Math.ceil(viewport.width); target.height = Math.ceil(viewport.height);
      rendering = documentPage.render({canvas:target,viewport});
      return rendering.promise;
    }).catch(() => { if (active) setError('This page could not render. Retry or download the original.'); });
    return () => { active = false; rendering?.cancel(); };
  },[pdf,page,zoom]);

  if (error) return <><p role="alert">{error}</p><button className="button small" onClick={() => setAttempt(attempt+1)}>Retry preview</button></>;
  if (!pdf) return <p role="status">Loading PDF…</p>;
  return <>
    <div className="utility-actions">
      <button className="button small" disabled={page===1} onClick={() => setPage(page-1)}>Previous page</button>
      <span role="status">Page {page} of {pdf.numPages}</span>
      <button className="button small" disabled={page===pdf.numPages} onClick={() => setPage(page+1)}>Next page</button>
      <label>Zoom <select value={zoom} onChange={event => setZoom(Number(event.target.value))}>
        <option value={0.75}>75%</option><option value={1}>100%</option><option value={1.5}>150%</option>
      </select></label>
    </div>
    <canvas ref={canvas} className="pdf-page" style={{maxWidth:zoom>1?'none':'100%'}} role="img" aria-label={'PDF page '+page}/>
  </>;
}
