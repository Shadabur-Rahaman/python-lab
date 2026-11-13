import {useState} from 'react';
import {ArrowRight, Bookmark, Search} from 'lucide-react';
import {levels, tracks, type buildCatalog} from '../data/catalog.mjs';
import type {Progress} from '../lib/progress.mjs';

export default function CourseCatalog({catalog, progress}: {
  catalog: ReturnType<typeof buildCatalog>; progress: Progress;
}) {
  const [search, setSearch] = useState('');
  const [onlyBookmarks, setOnlyBookmarks] = useState(false);
  const query = search.trim().toLowerCase();
  const matches = catalog.lessons.filter(lesson =>
    (!onlyBookmarks || progress.bookmarks.includes(lesson.id))
    && `${lesson.title} ${lesson.subtitle} ${lesson.topics}`.toLowerCase().includes(query));
  return <>
    <div className="utility-actions">
      <label className="search-field"><Search size={18}/>
        <input aria-label="Search chapters" placeholder="Search titles and Python topics" value={search} onChange={event => setSearch(event.target.value)}/>
      </label>
      <button className="button small" aria-pressed={onlyBookmarks} onClick={() => setOnlyBookmarks(!onlyBookmarks)}>
        <Bookmark size={16}/> Bookmarked lessons
      </button>
    </div>
    {!matches.length && <p role="status">No lessons match your filters.</p>}
    {levels.map(level => {
      const lessons = matches.filter(lesson => lesson.level === level.id);
      if (!lessons.length && (query || onlyBookmarks)) return null;
      return <section className="catalog-level" key={level.id}>
        <h2>{level.title}</h2>
        <p>{level.scope}</p>
        {lessons.length ? <div className="chapter-grid">
          {lessons.map(lesson => <a className="card chapter-card" key={lesson.id} href={`#/chapter/${lesson.id}`}>
            <h3>{lesson.title}</h3>
            <p>{lesson.subtitle}</p>
            <div className="card-bottom">
              {progress.completed.includes(lesson.id) ? '✓ Completed' : 'Open chapter'} <ArrowRight size={16}/>
            </div>
          </a>)}
        </div> : <p>Planned curriculum</p>}
      </section>;
    })}
    {!query && !onlyBookmarks && <section className="catalog-level">
      <h2>Specialization roadmap</h2>
      <p>Track lessons and capstones are planned. The foundation lessons below are available now.</p>
      <div className="chapter-grid">{tracks.map(track => <article className="card" key={track.title}>
        <h3>{track.title}</h3><p>{track.scope}</p>
        <p>{track.foundation.filter(id => progress.completed.includes(id)).length} of {track.foundation.length} suggested foundation lessons completed</p>
        <ul>{track.foundation.map(id => <li key={id}><a className="inline-link" href={`#/chapter/${id}`}>
          {catalog.lessons.find(lesson => lesson.id === id)?.title}
        </a></li>)}</ul>
      </article>)}</div>
    </section>}
  </>;
}
