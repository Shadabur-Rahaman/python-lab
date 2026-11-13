# Python Lab design system

The student workspace uses a collapsible navigation rail, a breadcrumb, course search and a persistent theme preference. At phone widths the rail becomes a drawer. The teacher studio has a standalone layout.

| Token | Light | Dark |
| --- | --- | --- |
| Canvas | #f4f6fb | #101523 |
| Surface | #ffffff | #181f31 |
| Main text | #18233c | #eff2fd |
| Secondary text | #526079 | #adb8d1 |
| Accent | #3d4fc0 | #bac4ff |
| Border | #d9e0ed | #35405b |

The shared stylesheet retains the course typography and its monospace code editor. Use the existing primary and secondary buttons for actions, visible labels for inputs, and cards for grouped content. Library cards adapt from three columns to two and then one. The preview uses a native dialog with a keyboard dismissal path and a labelled title.
