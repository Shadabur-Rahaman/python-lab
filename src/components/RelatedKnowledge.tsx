import {GlossaryTerm} from './GlossaryPage';
import {syntaxTopics} from '../data/syntax';
import {terms} from '../data/glossary';

export default function RelatedKnowledge({lessonId}: {lessonId:number}) {
  const relatedTerms = terms.filter(term => term.lesson === lessonId);
  const relatedTopics = syntaxTopics.filter(topic => topic.lesson === lessonId);
  if (!relatedTerms.length && !relatedTopics.length) return null;
  return <section className="lesson-section">
    <h2>Related syntax and terms</h2>
    <div className="utility-actions">{relatedTerms.map(term => <GlossaryTerm key={term.id} id={term.id}/>)}</div>
    <ul>{relatedTopics.map(topic =>
      <li key={topic.id}><a className="inline-link" href={`#/syntax/${topic.category}/${topic.id}`}>{topic.title}</a></li>)}</ul>
  </section>;
}
