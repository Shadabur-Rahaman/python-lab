import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

test('Cross-Platform Ecosystem: Python Lab links to valid DS LAB production endpoints', () => {
  const appTsx = fs.readFileSync(path.join(rootDir, 'src', 'App.tsx'), 'utf8');
  const intermediateTsx = fs.readFileSync(path.join(rootDir, 'src', 'components', 'IntermediatePathView.tsx'), 'utf8');
  const projectStudioTsx = fs.readFileSync(path.join(rootDir, 'src', 'components', 'ProjectStudioView.tsx'), 'utf8');
  const studentMarksTsx = fs.readFileSync(path.join(rootDir, 'src', 'components', 'StudentMarksAnalyzerView.tsx'), 'utf8');
  const catalogTsx = fs.readFileSync(path.join(rootDir, 'src', 'components', 'CourseCatalog.tsx'), 'utf8');

  // Verify stable production URL
  const dsLabUrl = 'https://shadabur-rahaman.github.io/ds-lab/';
  assert.ok(appTsx.includes(dsLabUrl), 'App.tsx must include DS LAB production URL');
  assert.ok(intermediateTsx.includes(dsLabUrl), 'IntermediatePathView.tsx must include DS LAB production URL');
  assert.ok(projectStudioTsx.includes(dsLabUrl), 'ProjectStudioView.tsx must include DS LAB production URL');
  assert.ok(studentMarksTsx.includes('https://shadabur-rahaman.github.io/ds-lab/#/courses'), 'StudentMarksAnalyzerView.tsx must link to DS LAB courses');
  assert.ok(catalogTsx.includes(dsLabUrl), 'CourseCatalog.tsx must include DS LAB production URL');
});

test('Cross-Platform Ecosystem: Sidebar, topbar, and journey banners include ecosystem nodes', () => {
  const appTsx = fs.readFileSync(path.join(rootDir, 'src', 'App.tsx'), 'utf8');
  assert.ok(appTsx.includes('sidebar-ecosystem'), 'App.tsx must contain sidebar-ecosystem');
  assert.ok(appTsx.includes('ecosystem-pill'), 'App.tsx must contain ecosystem-pill in topbar');

  const intermediateTsx = fs.readFileSync(path.join(rootDir, 'src', 'components', 'IntermediatePathView.tsx'), 'utf8');
  assert.ok(intermediateTsx.includes('Data Science & Backend'), 'Intermediate journey banner must reference Data Science');

  const projectStudioTsx = fs.readFileSync(path.join(rootDir, 'src', 'components', 'ProjectStudioView.tsx'), 'utf8');
  assert.ok(projectStudioTsx.includes('ds-lab-bridge-card'), 'ProjectStudioView must provide ds-lab-bridge-card');
});
