import {useEffect, useState} from 'react';
import {syntaxTopics} from '../data/syntax';
import {findTerms, glossaryLink} from '../data/glossary';

export default function KnowledgeSearch({lessons, exercises}: {
  lessons:{id:number;title:string;topics:string}[];
  exercises:{id:string;title:string;chapter:number}[];
}) {
  const [query,setQuery] = useState('');
  const [resources,setResources] = useState<{id:string;title:string;description:string;tags:string[]}[]>([]);
  const [resourceError,setResourceError] = useState(false);
  useEffect(() => {
    let mounted = true;
    import('../resources/client').then(({published}) => published())
      .then(rows => {if (mounted) setResources(rows);})
      .catch(() => {if (mounted) setResourceError(true);});
    return () => {mounted = false;};
  },[]);
  const text = query.trim().toLowerCase();
  const matches = (value:string) => value.toLowerCase().includes(text);
  const results = !text ? [] : [
    ...lessons.filter(item => matches(item.title+' '+item.topics)).map(item => ({kind:'Lesson',title:item.title,url:`#/chapter/${item.id}`})),
    ...syntaxTopics.filter(item => matches(item.title+' '+item.format+' '+item.definition)).map(item => ({kind:'Syntax',title:item.title,url:`#/syntax/${item.category}/${item.id}`})),
    ...findTerms(query).map(item => ({kind:'Glossary',title:item.name,url:glossaryLink(item.id)})),
    ...resources.filter(item => matches([item.title,item.description,...item.tags].join(' ')))
      .map(item => ({kind:'Study material',title:item.title,url:`#/resources?item=${item.id}`})),
    ...exercises.filter(item => matches(item.title)).map(item => ({kind:'Exercise',title:item.title,url:`#/practice/${item.id}`})),
  ];
  return <>
    <label>Search the course<input value={query} onChange={event => setQuery(event.target.value)} placeholder="Try assignment or लूप"/></label>
    <p role="status">{text ? `${results.length} results` : 'Search lessons, syntax, glossary terms and exercises.'}</p>
    {resourceError && <p>Study materials could not be included in this search.</p>}
    <ul>{results.map(result => <li key={result.kind+result.title+result.url}>
      <a className="inline-link" href={result.url}>{result.title}</a> · {result.kind}
    </li>)}</ul>
  </>;
}
