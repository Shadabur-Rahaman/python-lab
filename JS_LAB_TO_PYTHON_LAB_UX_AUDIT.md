# JS Lab to Python Lab UX audit

| Python Lab before 5.0 | JS Lab pattern and benefit | Python Lab pilot | Acceptance |
| --- | --- | --- | --- |
| Decorative hero editor | JS Lab Home embeds an interactive demonstration so visitors can try a concept immediately | App and ReceiptEditor present a runnable receipt with a Variables link | Edit quantity and see actual Python output |
| Chapter material stacks vertically | JS Lab visual and trace components pair an explanation with something to manipulate | ReceiptLesson places guided stages beside the editor and stacks them on smaller screens | Prediction and stage navigation work at desktop and phone widths |
| Experiments double as a playground | JS Lab separates editing, controls and results | Dedicated Playground reuses CodeLab with a desktop output panel and optional program input | Execute, inspect traceback and save a snippet |
| Navigation resumes chapters | JS Lab treats search, progression and tools as a single workspace | Preserve course navigation and add a Playground entry and shared receipt draft | Return and reload without losing code or stage |

Reviewed JS Lab App, Playground, BrowserLab, BrowserChapter, TracePlayer, resource components and shared styles. Python execution retains the existing Pyodide worker, input queue, cancellation and time limit. The quantity model illustrates a fixed receipt and does not inspect the runtime.
