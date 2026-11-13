import {useState} from 'react';
import {downloadJson} from '../lib/download';
import {importProgress, type Progress} from '../lib/progress.mjs';
import type {buildCatalog} from '../data/catalog.mjs';

export default function ProgressBackup({progress, catalog, onImport, onReset}: {
  progress: Progress; catalog: ReturnType<typeof buildCatalog>;
  onImport: (progress: Progress) => void; onReset: () => void;
}) {
  const [message, setMessage] = useState('');
  return <div className="card">
    <h3>Back up your progress</h3>
    <p>Progress stays in this browser. Export a backup to move it to another device. Importing adds completed work and keeps your highest quiz scores.</p>
    <div className="utility-actions">
      <button className="button" onClick={() => downloadJson('python-lab-progress.json', progress)}>Export progress</button>
      <button className="button danger" onClick={() => {
        if (window.confirm('Reset all lesson, exercise, quiz and project progress on this device?')) {
          onReset();
          setMessage('Progress reset.');
        }
      }}>Reset progress</button>
    </div>
    <label>Import progress<input type="file" accept=".json,application/json" onChange={async event => {
      const file = event.currentTarget.files?.[0];
      event.currentTarget.value = '';
      if (!file) return;
      try {
        if (file.size > 1_000_000) throw new Error('Choose a progress backup smaller than 1 MB.');
        onImport(importProgress(await file.text(), catalog));
        setMessage('Progress imported.');
      } catch (error) {
        setMessage((error as Error).message);
      }
    }}/></label>
    <p role="status">{message}</p>
  </div>;
}
