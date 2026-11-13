import {useState} from 'react';
import {storage} from '../lib/storage';

const key = 'python-lab.memory-language';
export default function MemoryHint({english,roman}: {english:string;roman:string}) {
  const [language,setLanguage] = useState(()=>storage.getItem(key)==='roman'?'roman':'en');
  return <div className="memory-hint">
    <label>Memory hint language <select value={language} onChange={event=>{
      setLanguage(event.target.value);
      try {storage.setItem(key,event.target.value);} catch {}
    }}><option value="en">English</option><option value="roman">Hinglish / Roman Urdu</option></select></label>
    <p lang={language==='roman'?'hi-Latn':'en'}><span aria-hidden="true">🧠 </span>{language==='roman'?roman:english}</p>
  </div>;
}
