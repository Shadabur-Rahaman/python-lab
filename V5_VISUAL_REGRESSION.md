# V5 visual regression

The pilot layout test checks Home, Variables and Values, and Playground at 360, 390, 768, 1024, 1366, 1440 and 1920px. It waits for fonts before checking page overflow. Edge screenshots were captured at 390 and 1440px from the previous live site and the initial local V5 build. The final release restores the previous Home design. The old site had no dedicated Playground route, so that screen has after captures only.

The first run detected 4px of overflow on Home at 360px. The pilot now uses smaller hero padding and shrinkable columns at that width. Manual screenshot review also identified low contrast on the collapsed input heading, which now uses the editor surface and theme accent.
