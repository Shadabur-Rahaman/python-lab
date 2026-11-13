import {createClient} from '@supabase/supabase-js';

const url = (import.meta.env.VITE_SUPABASE_URL ?? '').trim();
const key = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? '').trim();
const validUrl = /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(url)
  || /^http:\/\/(127\.0\.0\.1|localhost):54321\/?$/.test(url);
export const cloud = validUrl && key.startsWith('sb_publishable_')
  ? createClient(url, key, {auth:{storageKey:'python-lab.teacher.session'}})
  : null;

export type Resource = {
  id:string; title:string; description:string; original_filename:string; mime_type:string; file_size:number;
  chapter_id:number|null; lesson_id:string|null; category_id:string|null; tags:string[]; glossary_ids:string[];
  language:string; difficulty:string; version:number; display_order:number; published_at:string|null;
  status?:'draft'|'published'|'archived'|'deleted';
};
export type Category = {id:string;name:string};
export type Metadata = Pick<Resource,'title'|'description'|'chapter_id'|'lesson_id'|'category_id'|'tags'|'glossary_ids'|'language'|'difficulty'|'display_order'> & {status:NonNullable<Resource['status']>};

export async function request<T>(action:string, payload:Record<string,unknown> = {}, teacher = false):Promise<T> {
  if (!cloud) throw Error('Study materials are not configured.');
  let token:string|undefined;
  if (teacher) {
    const {data} = await cloud.auth.getSession();
    token = data.session?.access_token;
    if (!token) throw Error('Sign in to continue.');
  }
  const response = await fetch(url.replace(/\/$/, '') + '/functions/v1/resource-api', {
    method:'POST', headers:{apikey:key,'Content-Type':'application/json',...(token ? {Authorization:`Bearer ${token}`} : {})},
    body:JSON.stringify({action,...payload}),
  });
  const body = await response.json().catch(() => null);
  if (!response.ok || body === null) throw Error(body?.error ?? 'The resource service could not respond. Try again.');
  return body as T;
}

export async function published() {
  if (!cloud) return [];
  const rows: Resource[] = [];
  for (let start = 0; ; start += 100) {
    const {data,error} = await cloud.from('published_resources').select('*')
      .order('display_order').order('id').range(start,start+99);
    if (error) throw error;
    rows.push(...data as Resource[]);
    if (data.length < 100) return rows;
  }
}

export async function categories() {
  if (!cloud) return [];
  const {data,error} = await cloud.from('resource_categories').select('id,name').eq('archived',false).order('display_order');
  if (error) throw error;
  return data as Category[];
}
