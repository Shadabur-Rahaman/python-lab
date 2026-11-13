export const categories = {
  fundamentals: 'Fundamentals', literals: 'Types and literals', operators: 'Operators',
  control: 'Control flow', collections: 'Collections', functions: 'Functions',
  objects: 'Object-oriented syntax', errors: 'Exceptions and context managers', modules: 'Modules and imports',
  iteration: 'Iterators, generators and async', advanced: 'Advanced constructs',
  builtins: 'Built-in functions', standard: 'Standard library',
} as const;

export type Category = keyof typeof categories;
export type Topic = {
  id: string; category: Category; title: string; difficulty: 'Beginner'|'Intermediate'|'Advanced';
  since: string; lesson: number; definition: string; format: string; symbols: [string,string][];
  code: string; output: string; trace: string; pitfall: string; correction: string;
  use: string; practice: [string,string]; docs: string; input?: string;
};

export function topic(
  category: Category, id: string, title: string, difficulty: Topic['difficulty'], lesson: number,
  definition: string, format: string, symbols: Topic['symbols'], code: string, output: string,
  trace: string, pitfall: string, correction: string, use: string, practice: Topic['practice'],
  reference: string, since = '3.0', input?: string
): Topic {
  return {category,id,title,difficulty,lesson,definition,format,symbols,code,output,trace,
    pitfall,correction,use,practice,since,input,docs:'https://docs.python.org/3.12/'+reference};
}
