export const KEY = 'python-lab.progress.v1';
export const freshProgress = () => ({version:1,visited:[],completed:[],solved:[],projects:[],scores:{},last:0,firstProgram:false});
export function loadProgress(storage) {
  try { const p=JSON.parse(storage.getItem(KEY)); if(p?.version!==1)return freshProgress();
    const clean=freshProgress(); for(const k of ['visited','completed','solved','projects']) clean[k]=Array.isArray(p[k])?[...new Set(p[k].filter(x=>typeof x==='string'||Number.isInteger(x)))]:[];
    for(const k of ['visited','completed'])clean[k]=clean[k].filter(x=>Number.isInteger(x)&&x>=0&&x<=12);
    clean.solved=clean.solved.filter(x=>typeof x==='string'&&/^(?:[0-9]|1[0-2])-[0-2]$/.test(x));
    clean.projects=clean.projects.filter(x=>['intro','calculator','shopping','eligibility','grades','tables','guess','contacts','expenses','marks'].includes(x));
    clean.scores=Object.fromEntries(Object.entries(p.scores||{}).filter(([k,v])=>(k==='revision'||/^(?:[0-9]|1[0-2])$/.test(k))&&typeof v==='number'&&v>=0&&v<=100)); clean.last=Number.isInteger(p.last)&&p.last>=0&&p.last<=12?p.last:0; clean.firstProgram=p.firstProgram===true; return clean;
  } catch {return freshProgress();}
}
export function saveProgress(storage,p){try{storage.setItem(KEY,JSON.stringify(p));return true;}catch{return false;}}
export const normalize = s => s.replace(/\r/g,'').split('\n').map(x=>x.trimEnd()).join('\n').trim();
export const matchesOutput = (actual,expected) => normalize(actual)===normalize(expected);
export const scoreQuiz = (questions,answers) => Math.round(100*questions.filter((q,i)=>q.answer===answers[i]).length/questions.length);
export const percentage = p => Math.round(100*(p.completed.length+p.solved.length+p.projects.length+Object.keys(p.scores).filter(k=>k!=='revision').length)/(13+39+10+13));
