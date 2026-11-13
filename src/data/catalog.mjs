export const levels = [
  {id: 0, title: 'Before programming', scope: 'Problem solving, execution models and local setup'},
  {id: 1, title: 'Python beginner', scope: 'Syntax, data, control flow and functions'},
  {id: 2, title: 'Python intermediate', scope: 'Collections, files, exceptions, iterators, modules and testing'},
  {id: 3, title: 'Object-oriented Python', scope: 'Object state, composition, inheritance and protocols'},
  {id: 4, title: 'Advanced Python', scope: 'Decorators, the object model, concurrency and performance'},
  {id: 5, title: 'Professional engineering', scope: 'Packaging, quality tools, CI and deployment'},
];

export const expandedLessons = [
  {id: 13, level: 2, title: 'Transforming Collections', subtitle: 'Filter, transform and order records', prerequisites: [7, 9, 11], topics: 'list comprehension unpacking enumerate zip sorted lambda',
    taskIds: ['trim-labels', 'passing-scores', 'sort-orders']},
  {id: 14, level: 2, title: 'Files, JSON & Exceptions', subtitle: 'Read structured data and handle bad input', prerequisites: [10, 11], topics: 'pathlib temporary files JSON validation try except ValueError',
    taskIds: ['read-count', 'read-names', 'load-stock']},
  {id: 15, level: 3, title: 'Classes & Object State', subtitle: 'Give each object its own data and behavior', prerequisites: [11], topics: 'class constructor instance self methods mutable state',
    taskIds: ['make-counter', 'counter-reset', 'shopping-basket']},
];

export const tracks = [
  {title: 'DSA and problem solving', foundation: [7, 9, 11, 13], scope: 'Complexity, searching, sorting, trees, graphs and dynamic programming'},
  {title: 'Backend development', foundation: [10, 11, 14, 15], scope: 'HTTP, APIs, databases, authentication, tests and deployment'},
  {title: 'Automation and scripting', foundation: [8, 11, 14], scope: 'File workflows, tabular data, APIs, scheduling and recovery'},
  {title: 'Data science', foundation: [9, 10, 13, 14], scope: 'NumPy, Pandas, exploratory analysis and reproducible notebooks'},
  {title: 'Machine learning', foundation: [11, 13, 14], scope: 'Data science foundations, pipelines, evaluation and experiment tracking'},
  {title: 'Deep learning and AI applications', foundation: [11, 13, 15], scope: 'Machine learning foundations, PyTorch, embeddings, retrieval and evaluation'},
  {title: 'Advanced engineering and performance', foundation: [13, 14, 15], scope: 'Advanced Python foundations, concurrency, profiling and maintainability'},
];

/**
 * @param {{id: number, title: string, subtitle: string, concepts: [string, string][], tasks: {id: string}[]}[]} beginner
 * @param {{id: string}[]} projects
 */
export function buildCatalog(beginner, projects) {
  const lessons = [
    ...beginner.map((lesson, index) => ({
      id: lesson.id,
      level: index === 0 ? 0 : 1,
      title: lesson.title,
      subtitle: lesson.subtitle,
      prerequisites: index === 0 ? [] : [beginner[index - 1].id],
      topics: lesson.concepts.flat().join(' '),
      taskIds: lesson.tasks.map(task => task.id),
    })),
    ...expandedLessons,
  ];
  return {
    lessons,
    lessonIds: new Set(lessons.map(lesson => lesson.id)),
    taskIds: new Set(lessons.flatMap(lesson => lesson.taskIds)),
    projectIds: new Set(projects.map(project => project.id)),
  };
}

/** @param {ReturnType<typeof buildCatalog>} catalog @param {number} id */
export function lessonNeighbors(catalog, id) {
  const index = catalog.lessons.findIndex(lesson => lesson.id === id);
  if (index < 0) return {};
  return {previous: catalog.lessons[index - 1], next: catalog.lessons[index + 1]};
}
