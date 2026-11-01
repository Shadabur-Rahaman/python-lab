// Keep the classroom usable even when a browser disallows persistent storage.
let persistent:Storage|undefined;
try{persistent=window.localStorage;}catch{}
const transient=new Map<string,string>();
export const storage={getItem(key:string){try{return persistent?persistent.getItem(key):transient.get(key)||null;}catch{return transient.get(key)||null;}},setItem(key:string,value:string){transient.set(key,value);if(!persistent)throw new Error('Storage unavailable');try{persistent.setItem(key,value);}catch(error){persistent=undefined;throw error;}}};
