import { useEffect, useRef, useState } from "react";
import {
  AnnotationMode,
  GlobalWorkerOptions,
  getDocument,
  type PDFDocumentProxy,
  type PDFPageProxy,
  type RenderTask,
} from "pdfjs-dist/legacy/build/pdf.mjs";
import workerUrl from "pdfjs-dist/legacy/build/pdf.worker.min.mjs?url";
import { signedLink, type Resource } from "./client";
import { pdfBytes, pdfViewport } from "./pdf.mjs";

GlobalWorkerOptions.workerSrc = workerUrl;

export default function PdfPreview({
  resource,
  teacher,
}: {
  resource: Resource;
  teacher: boolean;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null),
    [ratio, setRatio] = useState(1.414),
    [width, setWidth] = useState(600),
    [zoom, setZoom] = useState(1),
    [error, setError] = useState(""),
    [retry, setRetry] = useState(0);
  const [pageNumber,setPageNumber] = useState(1);
  const [pageInput,setPageInput] = useState('1');
  function jump(target:number) {
    if (!pdf || !Number.isFinite(target)) return;
    const number=Math.max(1,Math.min(pdf.numPages,Math.trunc(target)));
    const region=container.current;
    const page=region?.querySelector<HTMLElement>('[data-page="'+number+'"]');
    if (region && page) region.scrollTop += page.getBoundingClientRect().top-region.getBoundingClientRect().top;
    setPageNumber(number);
    setPageInput(String(number));
  }
  function trackPage() {
    const region=container.current;
    if (!region) return;
    const top=region.getBoundingClientRect().top+16;
    const visible=Array.from(region.querySelectorAll<HTMLElement>('[data-page]')).find(page=>page.getBoundingClientRect().bottom>top);
    if (visible) {
      const number=Number(visible.dataset.page);
      setPageNumber(number);
      setPageInput(String(number));
    }
  }
  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    let task: ReturnType<typeof getDocument> | undefined;
    setPdf(null);
    setPageNumber(1);
    setPageInput("1");
    setError("");
    void (async () => {
      try {
        const data = await pdfBytes(
          () => signedLink(resource.id, true, teacher),
          resource.file_size,
          controller.signal,
        );
        if (!active) return;

        // Only canvas and escaped text: no PDF scripting, forms or link actions.
        task = getDocument({
          data,
          enableXfa: false,
          maxImageSize: 32_000_000,
          canvasMaxAreaInBytes: 32 * 1024 * 1024,
        });
        const loaded = await task.promise;
        const first = await loaded.getPage(1),
          viewport = first.getViewport({ scale: 1 });
        if (active) {
          setRatio(viewport.width / viewport.height);
          setPdf(loaded);
        }
      } catch (e) {
        if (active)
          setError(
            (e as Error).name === "PasswordException"
              ? "This PDF is password-protected. Download it to open with its password."
              : "PDF could not be loaded. Please retry or download the original.",
          );
      }
    })();
    return () => {
      active = false;
      controller.abort();
      void task?.destroy().catch(() => {});
    };
  }, [resource.id, resource.version, teacher, retry]);
  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const observer = new ResizeObserver(() =>
      setWidth(Math.max(100, element.clientWidth)),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return (
    <section className="resource-pdf" aria-label="PDF document viewer">
      {error ? (
        <div className="resource-notice" role="alert">
          <p>{error}</p>
          <button
            className="button secondary"
            onClick={() => setRetry((n) => n + 1)}
          >
            Retry preview
          </button>
        </div>
      ) : !pdf ? (
        <p className="resource-pdf-status" role="status">
          Loading PDF…
        </p>
      ) : null}
      {pdf && <div className="pdf-toolbar">
        <button className="button small" disabled={pageNumber<=1} onClick={()=>jump(pageNumber-1)}>Previous page</button>
        <form onSubmit={event=>{event.preventDefault();jump(Number(pageInput));}}>
          <label>Page <input type="number" min={1} max={pdf.numPages} required value={pageInput}
            onChange={event=>setPageInput(event.target.value)}/></label>
          <span>of {pdf.numPages}</span><button className="button small">Go</button>
        </form>
        <button className="button small" disabled={pageNumber>=pdf.numPages} onClick={()=>jump(pageNumber+1)}>Next page</button>
        <label>Zoom <select aria-label="PDF zoom" value={zoom} onChange={event=>setZoom(Number(event.target.value))}>
          <option value={1}>Fit to width</option><option value={1.25}>125%</option>
          <option value={1.5}>150%</option><option value={2}>200%</option>
        </select></label>
      </div>}
      <div
        className="resource-pdf-pages"
        ref={container}
        onScroll={trackPage}
        role="region"
        aria-label="PDF pages"
        tabIndex={0}
        aria-busy={!pdf && !error}
      >
        {pdf &&
          Array.from({ length: pdf.numPages }, (_, i) => (
            <PdfPage
              key={i + 1}
              pdf={pdf}
              number={i + 1}
              title={resource.title}
              width={width * zoom}
              ratio={ratio}
              root={container.current}
            />
          ))}
      </div>
    </section>
  );
}

function PdfPage({
  pdf,
  number,
  title,
  width,
  ratio,
  root,
}: {
  pdf: PDFDocumentProxy;
  number: number;
  title: string;
  width: number;
  ratio: number;
  root: HTMLDivElement | null;
}) {
  const frame = useRef<HTMLDivElement>(null),
    surface = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false),
    [pageRatio, setPageRatio] = useState(ratio),
    [rendered, setRendered] = useState(false),
    [error, setError] = useState(""),
    [text, setText] = useState("");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => setNear(entries[0].isIntersecting),
      { root, rootMargin: "800px 0px" },
    );
    if (frame.current) observer.observe(frame.current);
    return () => observer.disconnect();
  }, [root]);
  useEffect(() => {
    if (!near) {
      surface.current?.replaceChildren();
      setRendered(false);
      setText("");
      return;
    }
    let active = true,
      render: RenderTask | undefined,
      page: PDFPageProxy | undefined;
    const canvas = document.createElement("canvas");
    canvas.setAttribute("role", "img");
    canvas.setAttribute(
      "aria-label",
      `${title}, PDF page ${number} of ${pdf.numPages}`,
    );
    setRendered(false);
    setError("");
    void (async () => {
      try {
        page = await pdf.getPage(number);
        if (!active) return;
        const base = page.getViewport({ scale: 1 }),
          bounds = pdfViewport(
            base.width,
            base.height,
            width,
            1,
            window.devicePixelRatio || 1,
          );
        setPageRatio(base.width / base.height);
        canvas.width = bounds.pixelWidth;
        canvas.height = bounds.pixelHeight;
        canvas.style.width = bounds.cssWidth + "px";
        canvas.style.height = bounds.cssHeight + "px";
        render = page.render({
          canvas,
          viewport: page.getViewport({ scale: bounds.scale }),
          transform: [bounds.outputScale, 0, 0, bounds.outputScale, 0, 0],
          annotationMode: AnnotationMode.DISABLE,
          background: "#ffffff",
        });
        await render.promise;
        if (!active) return;
        const old = surface.current?.querySelector("canvas");
        surface.current?.replaceChildren(canvas);
        if (old) {
          old.width = 0;
          old.height = 0;
        }
        setRendered(true);
        try {
          const content = await page.getTextContent();
          if (active)
            setText(
              content.items
                .map((item) => ("str" in item ? item.str : ""))
                .join(" "),
            );
        } catch {
          /* Image-only pages do not need a text layer. */
        }
      } catch (e) {
        if (active && (e as Error).name !== "RenderingCancelledException")
          setError(
            "This page could not be displayed. Download the original to view it.",
          );
      }
    })();
    return () => {
      active = false;
      render?.cancel();
      const release = () => {
        if (!canvas.isConnected) {
          canvas.width = 0;
          canvas.height = 0;
        }
        page?.cleanup();
      };
      if (render) void render.promise.then(release, release);
      else release();
    };
  }, [pdf, number, width, near, title]);
  return (
    <div
      className="resource-pdf-page"
      ref={frame}
      style={{ aspectRatio: pageRatio, width: Math.max(100,width-24) }}
      data-page={number}
      data-rendered={rendered ? "true" : "false"}
      aria-busy={near && !rendered && !error}
    >
      <div ref={surface} />
      {near && !rendered && !error && (
        <span className="resource-pdf-page-loading" role="status">
          Loading page…
        </span>
      )}
      {error && (
        <p className="resource-notice" role="alert">
          {error}
        </p>
      )}
      {text && <p className="resource-pdf-page-text">{text}</p>}
    </div>
  );
}
