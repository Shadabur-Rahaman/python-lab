export type SyntaxMeta = {
  aliases: string[];
  memory: string;
  realWorld: string;
};

export const syntaxMeta: Record<string, SyntaxMeta> = {
  assignment: {
    aliases: [
      'variable', 'variables', 'store value', 'name value', 'assign', 'reassign',
      'identifier', 'binding', 'save value', 'save number', 'name = value',
    ],
    memory: 'Variable ek label hai jo value ko refer karta hai. Left mein naam, right mein value.',
    realWorld: 'Store a price, quantity, or student score to reuse in calculations.',
  },
  layout: {
    aliases: [
      'indentation', 'spaces', 'indent', 'block', 'colon', 'comment', 'hash',
      'syntax error', 'line break', 'format code', 'code structure',
    ],
    memory: 'Python mein indentation (4 spaces) block banati hai. Colon `:` header ke baad zaroori hai.',
    realWorld: 'Structure readable code blocks and document steps for your team.',
  },
  numbers: {
    aliases: [
      'int', 'float', 'number', 'integer', 'decimal', 'hexadecimal', 'binary',
      'boolean', 'bool', 'none', 'null', 'types', 'true false',
    ],
    memory: 'int poora number hai, float decimal, True/False boolean aur None matlab absence of value.',
    realWorld: 'Represent financial totals, sensor measurements, or missing optional values.',
  },
  strings: {
    aliases: [
      'remove spaces', 'clean string', 'strip', 'trim', 'f-string', 'format string',
      'slice', 'substring', 'string index', 'text', 'quotes', 'uppercase', 'lowercase',
      'bytes', 'raw string', 'replace text', 'split string',
    ],
    memory: 'Text ko quotes mein rakho. `[0]` pehla character hai, `[-1]` aakhri, aur f-string mein `{variable}` use karo.',
    realWorld: 'Clean user-entered names by removing spaces and format clean report lines.',
  },
  arithmetic: {
    aliases: [
      'math', 'maths', 'add', 'subtract', 'multiply', 'divide', 'division',
      'floor division', 'remainder', 'modulo', 'modulus', 'power', 'exponent',
      'calculate', 'operators', 'precedence',
    ],
    memory: '`//` poore hisse (quotient) deta hai aur `%` bacha hua remainder.',
    realWorld: 'Pack items into shipping boxes and calculate leftover units.',
  },
  logic: {
    aliases: [
      'check condition', 'compare', 'comparison', 'equality', 'equal', 'not equal',
      'identity', 'is', 'is not', 'membership', 'in', 'not in', 'and', 'or', 'not',
      'truthy', 'falsy', 'boolean test',
    ],
    memory: '`==` value check karta hai aur `is` exact same object. `and` dono dekhta hai, `or` koi ek.',
    realWorld: 'Verify eligibility for a discount and check whether an item is in inventory.',
  },
  'bits-and-walrus': {
    aliases: [
      'walrus', ':=', 'assignment expression', 'bitwise', 'bit shift',
      'and or xor', 'flags', 'mask',
    ],
    memory: '`:=` (walrus) expression ke andar hi variable assign aur return karta hai.',
    realWorld: 'Calculate and test length in a single condition to avoid duplicate calls.',
  },
  conditions: {
    aliases: [
      'check condition', 'if', 'elif', 'else', 'if else', 'conditional',
      'decision', 'branch', 'ternary', 'if statement',
    ],
    memory: '`if` agar, `elif` warna agar, aur `else` warna. Pehli true condition chalti hai.',
    realWorld: 'Assign letter grades or apply discounts based on order totals.',
  },
  loops: {
    aliases: [
      'repeat code', 'repeat', 'loop', 'for', 'while', 'for loop', 'while loop',
      'range', 'iterate', 'iteration', 'break', 'continue', 'stop loop',
      'repeat action', 'do again',
    ],
    memory: '`for` har item par chalta hai, `while` jab tak condition true ho. `break` loop se nikalta hai.',
    realWorld: 'Process a list of customer transactions or sum an invoice column.',
  },
  match: {
    aliases: [
      'match', 'case', 'switch', 'switch case', 'pattern matching', 'wildcard', 'guard',
    ],
    memory: '`match` pattern ko top-to-bottom check karta hai. `_` default wildcard hai.',
    realWorld: 'Parse command actions or structured API response shapes cleanly.',
  },
  displays: {
    aliases: [
      'add item to list', 'list', 'tuple', 'dict', 'dictionary', 'set',
      'unpack', 'collection', 'append', 'brackets', 'unique items', 'key value', 'array',
    ],
    memory: '`[]` list mutable hai, `()` tuple fixed hai, `{}` dict ya set hai.',
    realWorld: 'Store shopping cart items, contact records, and distinct customer tags.',
  },
  comprehensions: {
    aliases: [
      'list comprehension', 'filter list', 'transform list', 'comprehension',
      'dict comprehension', 'set comprehension', 'generator expression', 'one line loop',
    ],
    memory: '`[expr for item in items if condition]` se ek line mein filtered list ban jati hai.',
    realWorld: 'Extract email addresses from a list of active user accounts in one clean line.',
  },
  parameters: {
    aliases: [
      'function', 'def', 'parameters', 'arguments', 'default argument',
      'positional', 'keyword', '*args', '**kwargs', 'return', 'pass value',
    ],
    memory: '`def f(a, b=2, *args, **kwargs)` — defaults end mein aate hain, mutable defaults (`[]`) mat rakho.',
    realWorld: 'Create a reusable sales tax and shipping fee calculator function.',
  },
  scope: {
    aliases: [
      'scope', 'local', 'global', 'nonlocal', 'lambda', 'closure',
      'recursion', 'private state', 'anonymous function',
    ],
    memory: 'Function ke andar naya variable local hota hai. Outer variable update karne ke liye `nonlocal` use karo.',
    realWorld: 'Create counters or filter lists with quick one-line lambda callbacks.',
  },
  decorators: {
    aliases: [
      'decorator', '@', 'wrap function', 'wrapper', 'type hints',
      'type annotation', 'annotations', 'function wrapper',
    ],
    memory: '`@decorator` function ko wrap karke uske behavior ko modify ya log karta hai.',
    realWorld: 'Log function execution time or authenticate requests before running actions.',
  },
  classes: {
    aliases: [
      'class', 'object', 'self', 'init', '__init__', 'inheritance',
      'instance', 'method', 'super', 'oop', 'blueprint', 'constructor',
    ],
    memory: 'Class ek blueprint hai. `__init__` har naye object ko setup karta hai aur `self` current object hai.',
    realWorld: 'Model user accounts or shopping baskets with their own independent balances.',
  },
  'class-tools': {
    aliases: [
      'property', 'getter', 'setter', 'dataclass', '@dataclass',
      'classmethod', 'staticmethod', 'abstractmethod', 'abc',
    ],
    memory: '`@property` method ko bina `()` ke attribute ki tarah padhne deta hai. `@dataclass` boilerplate kam karta hai.',
    realWorld: 'Define clean data models for inventory items with computed read-only properties.',
  },
  handling: {
    aliases: [
      'error', 'try except', 'catch', 'exception', 'raise', 'traceback',
      'handle error', 'crash', 'error handling', 'finally',
    ],
    memory: '`try` mein risky code daalo, `except` mein error sambhalo, `finally` hamesha chalta hai.',
    realWorld: 'Prevent app crashes by catching missing keys or invalid user inputs gracefully.',
  },
  with: {
    aliases: [
      'with', 'context manager', 'cleanup', 'close file', 'resource',
      'release', 'lock', 'with statement',
    ],
    memory: '`with` block resource ko automatically close karta hai, chahe error hi kyon na aaye.',
    realWorld: 'Ensure files and database connections close safely even if an error occurs.',
  },
  imports: {
    aliases: [
      'import', 'from import', 'package', 'module', 'library', '__name__',
      'main', "if __name__ == '__main__'", 'alias', 'as',
    ],
    memory: '`import module` code reuse ke liye hai. `if __name__ == \'__main__\':` direct run par chalta hai.',
    realWorld: 'Split code into reusable helper modules with an explicit runnable entry point.',
  },
  generators: {
    aliases: [
      'generator', 'yield', 'iter', 'next', 'iterator protocol',
      'stream', 'lazy', 'yield from',
    ],
    memory: '`yield` function ko pause karke value deta hai aur memory bachata hai.',
    realWorld: 'Stream large log files line by line without consuming gigabytes of memory.',
  },
  async: {
    aliases: [
      'async', 'await', 'async def', 'asyncio', 'coroutine',
      'async for', 'async with', 'concurrency', 'asynchronous',
    ],
    memory: '`async def` aur `await` se program wait karte waqt doosra kaam kar sakta hai.',
    realWorld: 'Download multiple product images or query several web APIs concurrently.',
  },
  'object-protocols': {
    aliases: [
      'descriptor', 'metaclass', 'getattr', 'setattr', 'attribute lookup',
      '__get__', '__set__',
    ],
    memory: 'Descriptors attribute access customize karte hain aur class level par define hote hain.',
    realWorld: 'Build ORM models or data validation frameworks with custom attribute behavior.',
  },
  typing: {
    aliases: [
      'type hints', 'type alias', 'generic', 'protocol', 'typing',
      'type var', 'type safety', 'type Pair',
    ],
    memory: 'Type hints code padhne aur IDE errors pakadne mein madad karte hain.',
    realWorld: 'Specify exact function input and return types across team codebases.',
  },
  'input-output': {
    aliases: [
      'convert string to number', 'print', 'input', 'read input', 'output',
      'console', 'isinstance', 'type', 'user input', 'sep', 'end',
    ],
    memory: '`input()` hamesha string deta hai. `print()` values ko space se separate karke dikhata hai.',
    realWorld: 'Prompt the user for their age, cast it to an integer, and print a custom greeting.',
  },
  constructors: {
    aliases: [
      'convert string to number', 'find unique items', 'int', 'float', 'str',
      'bool', 'list', 'tuple', 'set', 'dict', 'type conversion', 'casting',
      'convert', 'deduplicate',
    ],
    memory: '`int(\'10\')` number banata hai, `list()` sequence ko list mein badalta hai, `set()` duplicates hataata hai.',
    realWorld: 'Convert form field text to numbers or deduplicate customer IDs with `set()`.',
  },
  'sequence-tools': {
    aliases: [
      'enumerate', 'zip', 'sorted', 'reversed', 'map', 'filter',
      'range', 'sort list', 'pair lists', 'numbered loop', 'sequence',
    ],
    memory: '`enumerate()` index ke saath count deta hai, `zip()` do lists ko pair karta hai, `sorted()` nayi list banata hai.',
    realWorld: 'Pair customer names with payment amounts and sort them by highest spend.',
  },
  summaries: {
    aliases: [
      'sum', 'min', 'max', 'any', 'all', 'total', 'smallest',
      'largest', 'count', 'aggregate', 'statistics',
    ],
    memory: '`sum()` total karta hai, `min()` sabse chhota, `max()` sabse bada, `any()`/`all()` truth check karte hain.',
    realWorld: 'Calculate invoice totals and check if all order items passed inspection.',
  },
  open: {
    aliases: [
      'read file', 'write file', 'open file', 'open', 'file mode',
      'read text', 'write text', 'append file', 'utf-8', 'file handling',
    ],
    memory: '`open(path, \'w\', encoding=\'utf-8\')` likhne ke liye, \'r\' padhne ke liye. Hamesha `with` use karo.',
    realWorld: 'Save transaction logs to disk or read customer CSV data safely.',
  },
  data: {
    aliases: [
      'read json file', 'json', 'csv', 'pathlib', 'datetime', 'date',
      'json.loads', 'json.dumps', 'dictreader', 'parse json', 'save json', 'format date',
    ],
    memory: '`json.loads()` JSON text ko Python dict banata hai, `json.dumps()` dict ko text banata hai.',
    realWorld: 'Parse API JSON responses and export clean CSV reports with timestamps.',
  },
};

