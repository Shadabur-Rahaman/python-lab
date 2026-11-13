# V5 test report

## Pilot acceptance

- npm test passed all 25 Node and Python tests.
- The production build passed TypeScript and Vite. Vite reports the existing large lazy PDF viewer chunk.
- The connected journey test ran real Python, checked receipt totals and NameError, checked a prediction, saved a snippet, and recovered the draft and step after reload.
- Home, Variables and Values, and Playground passed the page overflow check at 360, 390, 768, 1024, 1366, 1440 and 1920px.

The final Edge run passed all 23 browser tests. The first run caught a regression test that selected the new receipt by page order. The updated locator checks the intended original editor.

The pilot uses the current working tree. The owner authorized publishing V5 with the previous Home page restored. A formal WCAG 2.2 AA audit and migration of the other chapters are outside this pilot validation.
After restoring Home, the production build and both updated pilot browser tests passed. The journey starts via the original Home button and continues through Playground and Variables and Values.
