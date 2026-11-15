import type {Example, Question, Task, TestCase} from './types';

export type IntermediateModule = {
  id: string;
  moduleIndex: number;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  story: string;
  objectives: string[];
  concepts: [string, string][];
  visualExplanation: {
    title: string;
    description: string;
    steps: {title: string; description: string; code?: string}[];
  };
  examples: Example[];
  mistake: {code: string; fix: string; why: string};
  application: string;
  activity: {
    title: string;
    intro: string;
    code: string;
    prediction: string;
    answer: string;
    broken: string;
    repair: string;
    hint: string;
    reason: string;
    remember: string;
  };
  task: Task;
  quiz: Question[];
  cheatSheet: string[];
};

export const intermediateModules: IntermediateModule[] = [
  {
    id: 'modules-and-stdlib',
    moduleIndex: 1,
    title: 'Modules & The Standard Library',
    subtitle: 'Harness Python’s rich built-in ecosystem without reinventing the wheel',
    estimatedMinutes: 20,
    story: 'A shipping service calculates package route distances, generates random order tracking tokens, and computes average delivery times. Instead of writing complex geometry and statistics algorithms from scratch, Python provides standard-library modules like math, random, and statistics ready to use.',
    objectives: [
      'Import built-in modules using import, from ... import, and as aliases',
      'Leverage math, random, and statistics to perform standard computations',
      'Understand module namespaces and diagnose ModuleNotFoundError and AttributeError',
    ],
    concepts: [
      ['Importing Modules', 'import math brings the entire module into a dedicated namespace, accessed with math.sqrt(). from math import sqrt imports sqrt directly into local scope. Use import ... as alias (e.g. import statistics as stats) for clean readability.'],
      ['The math and statistics Modules', 'math provides mathematical functions like ceil, floor, sqrt, and constants like pi. statistics provides statistical routines like mean, median, and stdev for analyzing numerical sequences.'],
      ['The random Module', 'random generates pseudo-random numbers: random.randint(a, b) produces random integers inclusive, random.choice(seq) picks a single element, and random.sample(seq, k) picks k unique items.'],
      ['Namespaces & Import Errors', 'Avoid from module import * because it pollutes your namespace and creates name collisions. If Python cannot locate a module, it raises ModuleNotFoundError. If a named function does not exist inside a module, it raises AttributeError.'],
    ],
    visualExplanation: {
      title: 'How Module Namespaces Protect Your Code',
      description: 'Importing keeps tools organized in separate boxes so identical names never collide.',
      steps: [
        {title: '1. Standard Library', description: 'Python includes dozens of pre-tested modules (math, random, csv) installed out of the box.'},
        {title: '2. Dedicated Namespace', description: 'import math keeps functions in math.sqrt. Your own variables (e.g. sqrt = 5) remain untouched.'},
        {title: '3. Direct Import', description: 'from statistics import mean brings mean() directly into your file for concise mathematical formulas.'},
      ],
    },
    examples: [
      {
        title: 'Calculate circle areas and average size',
        code: 'import math\nimport statistics\n\nradii = [2.0, 4.0, 6.0]\nareas = [math.pi * (r ** 2) for r in radii]\navg_area = statistics.mean(areas)\nprint(f"Mean area: {avg_area:.2f}")',
        output: 'Mean area: 58.64',
        why: 'math.pi provides the mathematical constant π. A list comprehension calculates each area, and statistics.mean computes the exact average.',
        annotations: [
          ['import math', 'Loads the standard math library providing pi and trigonometric functions.'],
          ['statistics.mean(areas)', 'Calculates the arithmetic average of a sequence without manual loop summation.'],
        ],
      },
    ],
    mistake: {
      code: 'import math\n# Find the hypotenuse: sqrt(a^2 + b^2)\na = 3\nb = 4\nc = math.sqr(a**2 + b**2)\nprint(c)',
      fix: 'import math\na = 3\nb = 4\nc = math.sqrt(a**2 + b**2)\nprint(c)',
      why: 'AttributeError: module math has no attribute sqr. The function name in Python’s standard library is sqrt (square root).',
    },
    application: 'Games use random for dice and loot drops. Financial trackers use statistics for averages and standard deviation. Navigation apps use math for distance formulas.',
    activity: {
      title: 'Square roots and statistical median',
      intro: 'math.isqrt returns the integer square root. statistics.median finds the middle value of a sorted list.',
      code: 'import math\nimport statistics\n\nvalues = [16, 25, 36]\nroots = [math.isqrt(v) for v in values]\nprint(statistics.median(roots))',
      prediction: 'What number prints as the median of [4, 5, 6]?',
      answer: '5',
      broken: 'from math import sqr\nprint(sqr(16))',
      repair: 'from math import sqrt\nprint(sqrt(16))',
      hint: 'The standard math function for square root is sqrt, not sqr.',
      reason: 'Python standard library function names are exact. Square root is sqrt.',
      remember: 'Modules standard library ke tools hain: math.sqrt, statistics.mean, aur random.choice. Namespace collision se bachne ke liye import module use karo.',
    },
    task: {
      id: 'int-summary-stats',
      chapter: 16,
      title: 'Calculate Summary Statistics',
      difficulty: 'Easy',
      prompt: 'Implement calculate_summary_stats(numbers: list[float]) -> dict. Return a dictionary with: "mean" (float rounded to 2 decimals), "median" (float rounded to 2 decimals), "stdev" (float rounded to 2 decimals if len >= 2 else 0.0), "min" (minimum value), and "max" (maximum value). Return {} if numbers is empty.',
      starter: 'import statistics\n\ndef calculate_summary_stats(numbers: list[float]) -> dict:\n    pass',
      solution: 'import statistics\n\ndef calculate_summary_stats(numbers: list[float]) -> dict:\n    if not numbers:\n        return {}\n    m = round(statistics.mean(numbers), 2)\n    med = round(statistics.median(numbers), 2)\n    dev = round(statistics.stdev(numbers), 2) if len(numbers) >= 2 else 0.0\n    return {"mean": m, "median": med, "stdev": dev, "min": min(numbers), "max": max(numbers)}',
      expected: '',
      hints: [
        'Direction: Use statistics.mean, statistics.median, and statistics.stdev. Check for an empty list first.',
        'Specific Guidance: statistics.stdev raises an error if the list has fewer than 2 items; return 0.0 in that case.',
        'Strong Hint: Round each statistical metric using round(val, 2). Return the exact keys: mean, median, stdev, min, max.',
      ],
      explanation: 'Using the statistics module avoids writing summation and square root loops manually. Defensive checking prevents stdev errors on small lists.',
      cases: [
        {name: 'Standard distribution', check: 'calculate_summary_stats([10.0, 20.0, 30.0]) == {"mean": 20.0, "median": 20.0, "stdev": 10.0, "min": 10.0, "max": 30.0}'},
        {name: 'Single item list', check: 'calculate_summary_stats([5.0]) == {"mean": 5.0, "median": 5.0, "stdev": 0.0, "min": 5.0, "max": 5.0}'},
        {name: 'Empty list fallback', check: 'calculate_summary_stats([]) == {}'},
      ],
    },
    quiz: [
      {prompt: 'What happens when you run `from math import *`?', options: ['It is the recommended way to import', 'It dumps all math functions into your global namespace, risking name collisions', 'It compiles the math library to bytecode', 'It causes a SyntaxError'], answer: 1, explanation: 'Wildcard imports risk overwriting existing variables or functions with identical names.'},
      {prompt: 'Which module would you use to calculate the median score of an exam?', options: ['math', 'random', 'statistics', 'sys'], answer: 2, explanation: 'The statistics module provides median(), mean(), and mode().'},
      {prompt: 'What error occurs if you attempt `import non_existent_module`?', options: ['NameError', 'ModuleNotFoundError', 'AttributeError', 'TypeError'], answer: 1, explanation: 'Python raises ModuleNotFoundError when an imported module cannot be found in the module search path.'},
    ],
    cheatSheet: [
      'import math -> math.sqrt(25), math.pi, math.ceil(4.2)',
      'import statistics -> statistics.mean(data), statistics.median(data)',
      'import random -> random.randint(1, 6), random.choice(items)',
      'from module import function as alias -> rename imports for clarity',
    ],
  },
  {
    id: 'better-functions',
    moduleIndex: 2,
    title: 'Writing Better Functions',
    subtitle: 'Design clean, modular, parameterized, and testable functions',
    estimatedMinutes: 20,
    story: 'An online store has an invoice generation script. Originally written as one giant block of code, changing the state sales tax required hunting through dozens of nested statements. Refactoring the code into small, pure functions with default parameters and type annotations makes it robust and reusable.',
    objectives: [
      'Decompose complex scripts into single-purpose pure functions',
      'Use default and keyword arguments effectively while avoiding the mutable default trap',
      'Add type annotations and docstrings for clear contracts and code maintainability',
    ],
    concepts: [
      ['Function Decomposition', 'A function should do one thing well (Single Responsibility Principle). Separating calculation logic from user interaction (input/print) allows functions to be reused in web APIs, scripts, and automated tests.'],
      ['Default and Keyword Arguments', 'Default arguments (def greet(name, greeting="Hello"):) make parameters optional. Keyword arguments (greet(greeting="Hi", name="Noor")) let callers specify arguments in any order.'],
      ['The Mutable Default Argument Trap', 'Never use mutable objects (like [] or {}) as default values! Python evaluates default arguments once when the function is defined. Use None as the default: def add_item(item, items=None): if items is None: items = [].'],
      ['Type Hints & Docstrings', 'Type hints (def total(price: float, qty: int = 1) -> float:) document expected types without altering runtime behavior. Docstrings ("""Compute invoice total.""") provide built-in documentation.'],
    ],
    visualExplanation: {
      title: 'Pure Functions vs Side Effects',
      description: 'Pure functions receive inputs and return values without touching global variables or calling print/input.',
      steps: [
        {title: '1. Input Parameters', description: 'Arguments pass into the function explicitly (e.g. price, discount).'},
        {title: '2. Deterministic Calculation', description: 'Given the same inputs, the function always returns the exact same result.'},
        {title: '3. Return Value', description: 'The function returns data. The caller chooses whether to print, save, or test it.'},
      ],
    },
    examples: [
      {
        title: 'Format a member badge with optional parameters',
        code: 'def format_user_badge(username: str, role: str = "Member", points: int = 0) -> str:\n    """Return a formatted display badge string for a community member."""\n    clean_name = username.strip().title()\n    tier = "VIP" if points >= 100 else "Standard"\n    return f"[{role}] {clean_name} ({tier} - {points} pts)"\n\nprint(format_user_badge("  farhan  "))\nprint(format_user_badge("noor", role="Admin", points=150))',
        output: '[Member] Farhan (Standard - 0 pts)\n[Admin] Noor (VIP - 150 pts)',
        why: 'The first call uses the default role and points. The second call overrides both using keyword arguments.',
        annotations: [
          ['role: str = "Member"', 'Default parameter: callers can omit role or provide an override.'],
          ['"""Return a formatted..."""', 'Docstring explaining function contract, accessible via help().'],
        ],
      },
    ],
    mistake: {
      code: 'def add_item(item: str, basket: list = []) -> list:\n    basket.append(item)\n    return basket\n\nprint(add_item("tea"))\nprint(add_item("milk"))',
      fix: 'def add_item(item: str, basket: list | None = None) -> list:\n    if basket is None:\n        basket = []\n    basket.append(item)\n    return basket\n\nprint(add_item("tea"))\nprint(add_item("milk"))',
      why: 'Default arguments are evaluated once at definition. In the broken version, both calls share the same list! The fix uses None and creates a new list per call.',
    },
    application: 'Clean functions form the backbone of production backends, CLI utilities, and data transformation pipelines.',
    activity: {
      title: 'Default parameters and keyword arguments',
      intro: 'Default arguments supply fallback values when arguments are omitted.',
      code: 'def make_box(width: int = 3, symbol: str = "*") -> str:\n    return symbol * width\n\nprint(make_box())\nprint(make_box(symbol="#"))',
      prediction: 'What will print on line 1 and line 2?',
      answer: '***\n###',
      broken: 'def greet(name="Student", title):\n    return f"{title} {name}"',
      repair: 'def greet(title, name="Student"):\n    return f"{title} {name}"',
      hint: 'In Python, non-default arguments must always come before arguments with defaults.',
      reason: 'SyntaxError: non-default argument follows default argument. Required parameters must precede optional ones.',
      remember: 'Functions ko pure rakho: input lo aur return karo. Mutable default argument (jaise list=[]) kabhi mat use karo; default me None do.',
    },
    task: {
      id: 'int-query-url',
      chapter: 16,
      title: 'Build a Parameterized Query URL',
      difficulty: 'Medium',
      prompt: 'Implement build_query_url(base_path: str, params: dict | None = None, secure: bool = True) -> str. Prefix with "https://" if secure is True, else "http://". Append base_path stripped of surrounding slashes "/". If params is provided and non-empty, append "?" followed by key=value pairs sorted alphabetically by key and joined by "&".',
      starter: 'def build_query_url(base_path: str, params: dict | None = None, secure: bool = True) -> str:\n    pass',
      solution: 'def build_query_url(base_path: str, params: dict | None = None, secure: bool = True) -> str:\n    scheme = "https://" if secure else "http://"\n    clean_path = base_path.strip("/")\n    if not params:\n        return f"{scheme}{clean_path}"\n    query = "&".join(f"{k}={params[k]}" for k in sorted(params))\n    return f"{scheme}{clean_path}?{query}"',
      expected: '',
      hints: [
        'Direction: Use ternary expression for scheme: "https://" if secure else "http://".',
        'Specific Guidance: Strip surrounding slashes from base_path using base_path.strip("/").',
        'Strong Hint: Iterate over sorted(params) and join with "&": "&".join(f"{k}={params[k]}" for k in sorted(params)).',
      ],
      explanation: 'Separating URL assembly into a pure function with default parameters makes it reusable across development and production environments.',
      cases: [
        {name: 'Secure base URL without params', check: 'build_query_url("api/items") == "https://api/items"'},
        {name: 'Insecure URL with sorted query params', check: 'build_query_url("/search/", {"q": "python", "page": "1"}, secure=False) == "http://search?page=1&q=python"'},
        {name: 'None params handled safely', check: 'build_query_url("status", None) == "https://status"'},
      ],
    },
    quiz: [
      {prompt: 'Why is `def append_to(element, target=[])` considered a dangerous bug in Python?', options: ['Lists cannot be used as function arguments', 'The default list is created only once when the function is defined, sharing state across calls', 'It raises a TypeError at runtime', 'target is read-only'], answer: 1, explanation: 'Default arguments are evaluated once at definition time, meaning all invocations share the exact same list instance.'},
      {prompt: 'What does a type hint like `def add(a: int, b: int) -> int:` do at runtime in standard Python?', options: ['Throws a TypeError if you pass a string', 'Automatically converts inputs to integers', 'Provides hints for developers and linters without enforcing types at runtime', 'Compiles the function to C code'], answer: 2, explanation: 'Type hints in Python are informational annotations and do not enforce type constraints at runtime by default.'},
      {prompt: 'Where must non-default parameters be placed relative to default parameters?', options: ['Before any default parameters', 'After all default parameters', 'Any order is valid', 'Only inside **kwargs'], answer: 0, explanation: 'Syntax rules mandate that positional parameters without defaults must precede parameters with default values.'},
    ],
    cheatSheet: [
      'def func(param: type, default_param: type = value) -> return_type:',
      'Avoid mutable defaults: use param: list | None = None and initialize inside',
      'Keyword arguments: func(name="Noor", age=22) allows arbitrary order',
      'Docstrings: """Summary line.\n\nExtended explanation.""" directly under def',
    ],
  },
  {
    id: 'iterators-and-generators',
    moduleIndex: 3,
    title: 'Iterators & Generators',
    subtitle: 'Stream data progressively with lazy evaluation and zero memory waste',
    estimatedMinutes: 20,
    story: 'A weather monitoring station records sensor temperature updates every millisecond. Storing millions of readings in a list quickly exhausts system RAM and crashes the server. By writing a generator function with yield, readings are produced on demand as an infinite stream, using constant memory.',
    objectives: [
      'Differentiate between an iterable collection and an active iterator',
      'Use iter() and next() to control stepping through a sequence manually',
      'Write generator functions using yield for memory-efficient stream processing',
    ],
    concepts: [
      ['Iterable vs Iterator', 'An iterable is any object you can loop over (lists, strings, dicts). An iterator is a stateful stream object produced by iter(collection) that delivers elements one by one via next(it).'],
      ['The yield Keyword', 'yield turns an ordinary function into a generator. When called, it does not run immediately; it returns a generator object. When next() is called, code runs until it hits yield, sends the value, and freezes its state until the next request.'],
      ['Generator Exhaustion & StopIteration', 'Iterators are single-use streams! Once an iterator yields its last element, subsequent calls to next() raise StopIteration. A second for loop over an exhausted generator does nothing.'],
      ['Memory Efficiency', 'A list of 1,000,000 integers consumes ~8 megabytes of RAM. A generator expression (x for x in range(1000000)) consumes under 150 bytes, generating numbers on the fly.'],
    ],
    visualExplanation: {
      title: 'List vs Generator Memory Model',
      description: 'Lists store all values in memory upfront. Generators compute values on demand.',
      steps: [
        {title: '1. List in Memory', description: '[1, 2, 3, ... 1000000] allocates memory for every element simultaneously.'},
        {title: '2. Generator Function', description: 'def gen(): yield x pauses after each value. Only the current value exists in memory.'},
        {title: '3. Stream Consumer', description: 'for item in gen(): pulls values one by one without buffering.'},
      ],
    },
    examples: [
      {
        title: 'Step through a countdown generator',
        code: 'def countdown(start: int):\n    """Yield numbers down to 1, then yield Blastoff!"""\n    current = start\n    while current > 0:\n        yield current\n        current -= 1\n    yield "Blastoff!"\n\nfor step in countdown(3):\n    print(step)',
        output: '3\n2\n1\nBlastoff!',
        why: 'Each loop iteration requests the next value from countdown. The while loop pauses at yield current, resuming on the next turn.',
        annotations: [
          ['yield current', 'Emits current and freezes function execution state until next() is requested.'],
          ['for step in countdown(3):', 'The for loop automatically calls next() and handles StopIteration cleanly.'],
        ],
      },
    ],
    mistake: {
      code: 'def get_names():\n    yield "Ayaan"\n    yield "Sara"\n\nnames = get_names()\nprint(list(names))\n# Trying to iterate over an already exhausted generator:\nprint(list(names))',
      fix: 'def get_names():\n    yield "Ayaan"\n    yield "Sara"\n\nprint(list(get_names()))\nprint(list(get_names()))',
      why: 'Generators cannot be rewound once exhausted. To iterate again, call the generator function to obtain a fresh generator object.',
    },
    application: 'Log file processing, paginated API response fetching, database record streaming, and real-time audio/sensor feeds.',
    activity: {
      title: 'Stepping with iter() and next()',
      intro: 'next() advances an iterator to its subsequent item.',
      code: 'def step_generator():\n    yield "Step A"\n    yield "Step B"\n    yield "Step C"\n\ngen = step_generator()\nprint(next(gen))\nprint(next(gen))',
      prediction: 'What will print after calling next() twice?',
      answer: 'Step A\nStep B',
      broken: 'def countdown(n):\n    while n > 0:\n        return n\n        n -= 1\n\nprint(list(countdown(3)))',
      repair: 'def countdown(n):\n    while n > 0:\n        yield n\n        n -= 1\n\nprint(list(countdown(3)))',
      hint: 'return terminates the function after the first loop. Use yield to stream multiple values over time.',
      reason: 'return exits the function immediately. yield pauses execution and resumes on the next call.',
      remember: 'yield generator banata hai jo memory bachata hai. Iterator sirf ek baar chalta hai; dobara chalane ke liye naya generator banao.',
    },
    task: {
      id: 'int-chunk-stream',
      chapter: 16,
      title: 'Batch Streaming Generator',
      difficulty: 'Challenge',
      prompt: 'Implement a generator function chunk_stream(items: list, size: int). It must yield successive slices of items of length up to size. If size <= 0, raise ValueError("Chunk size must be positive"). If items is empty, yield nothing.',
      starter: 'def chunk_stream(items: list, size: int):\n    pass',
      solution: 'def chunk_stream(items: list, size: int):\n    if size <= 0:\n        raise ValueError("Chunk size must be positive")\n    for i in range(0, len(items), size):\n        yield items[i : i + size]',
      expected: '',
      hints: [
        'Direction: Check if size <= 0 and raise ValueError before looping.',
        'Specific Guidance: Use range(0, len(items), size) to step through items in chunks.',
        'Strong Hint: Inside the loop, yield items[i : i + size].',
      ],
      explanation: 'Slicing in batches with a generator allows processing large datasets in controlled memory chunks without loading everything into memory.',
      cases: [
        {name: 'Even division into batches', check: 'list(chunk_stream([1, 2, 3, 4, 5], 2)) == [[1, 2], [3, 4], [5]]'},
        {name: 'Chunk size larger than list', check: 'list(chunk_stream(["a", "b"], 5)) == [["a", "b"]]'},
        {name: 'Empty list yields no chunks', check: 'list(chunk_stream([], 3)) == []'},
      ],
    },
    quiz: [
      {prompt: 'What happens when a generator function reaches the end of its code or executes `return`?', options: ['It restarts from the beginning', 'It raises a StopIteration exception, signaling the iteration is complete', 'It returns None repeatedly', 'It clears system memory'], answer: 1, explanation: 'In Python, iterators signal completion by raising StopIteration, which for loops handle automatically.'},
      {prompt: 'What is the main advantage of a generator over returning a large list?', options: ['Generators run faster in all cases', 'Generators compute items lazily on demand, using constant memory', 'Generators can be indexed directly with [0]', 'Generators are automatically multi-threaded'], answer: 1, explanation: 'Generators compute values on the fly, allowing programs to stream millions of records without running out of RAM.'},
      {prompt: 'How do you obtain an iterator from an iterable object like a list?', options: ['next(my_list)', 'iter(my_list)', 'yield my_list', 'my_list.iterator()'], answer: 1, explanation: 'The built-in iter() function calls an object’s __iter__ method to create an iterator stream.'},
    ],
    cheatSheet: [
      'def my_gen(): yield value -> creates a generator function',
      'it = iter(collection) -> creates an iterator from an iterable',
      'next(it, fallback) -> gets next item or returns fallback when exhausted',
      '(x ** 2 for x in data) -> generator expression for lazy mapping',
    ],
  },
  {
    id: 'csv-structured-data',
    moduleIndex: 4,
    title: 'Structured Data with CSV',
    subtitle: 'Read, clean, validate, and summarize real tabular records using built-in tools',
    estimatedMinutes: 20,
    story: 'A university campus cafe exports daily receipts as a CSV file. Customer names have accidental trailing spaces, some prices are recorded as text, and malformed rows could skew the revenue count. Using Python’s built-in csv module, you can safely parse, validate, and aggregate tabular data without installing heavy external dependencies like Pandas.',
    objectives: [
      'Parse CSV files using csv.reader and csv.DictReader',
      'Clean data types by stripping whitespace and converting numerical strings',
      'Compute aggregate summaries like totals, averages, and group counts',
    ],
    concepts: [
      ['The Built-in csv Module', 'Python includes the csv module for handling comma-separated values. csv.reader reads rows as lists of strings, while csv.DictReader reads rows as dictionaries keyed by header names.'],
      ['csv.DictReader Advantages', 'DictReader maps each column to its header name (e.g. row["price"]). This protects your code from breaking if column order changes in future exports.'],
      ['Virtual Files in Pyodide with io.StringIO', 'In browser-based Python, io.StringIO(text) wraps a string into an in-memory file stream that standard file readers like csv.reader can read seamlessly.'],
      ['Data Validation & Defensive Parsing', 'All values read from a CSV start as strings! Always convert types explicitly (int(row["qty"]), float(row["price"])) and use try/except to skip or report corrupt records.'],
    ],
    visualExplanation: {
      title: 'CSV Text to Python Records',
      description: 'DictReader converts raw comma-delimited text into structured dictionary objects.',
      steps: [
        {title: '1. Raw CSV String', description: 'name,qty,price\\nChai,2,20.0\\nSamosa,1,15.0'},
        {title: '2. DictReader Parsing', description: 'Maps row 1 to {"name": "Chai", "qty": "2", "price": "20.0"}.'},
        {title: '3. Type Conversion', description: 'Convert strings to numbers: int(row["qty"]), float(row["price"]).'},
      ],
    },
    examples: [
      {
        title: 'Read and sum inventory from CSV data',
        code: 'import csv\nimport io\n\ncsv_data = """product,quantity,price\nNotebook,5,40.0\nPen,10,15.5\nEraser,3,5.0"""\n\nreader = csv.DictReader(io.StringIO(csv_data))\ntotal_value = 0.0\nfor row in reader:\n    qty = int(row["quantity"])\n    price = float(row["price"])\n    total_value += qty * price\n\nprint(f"Total inventory: ₹{total_value:.2f}")',
        output: 'Total inventory: ₹370.00',
        why: 'csv.DictReader pairs each row with column headers. The loop converts quantities and prices into numbers to calculate the final inventory sum.',
        annotations: [
          ['io.StringIO(csv_data)', 'Creates an in-memory file stream that csv.DictReader can read like a local file.'],
          ['csv.DictReader(stream)', 'Parses header line as dictionary keys for each subsequent record.'],
        ],
      },
    ],
    mistake: {
      code: 'import csv\nimport io\n\ndata = "name,score\\nArun,85\\nMeera,92"\nreader = csv.reader(io.StringIO(data))\n# Bug: treating header as numbers raises ValueError!\ntotal = sum(int(row[1]) for row in reader)\nprint(total)',
      fix: 'import csv\nimport io\n\ndata = "name,score\\nArun,85\\nMeera,92"\nreader = csv.reader(io.StringIO(data))\nnext(reader)  # Skip the header row\ntotal = sum(int(row[1]) for row in reader)\nprint(total)',
      why: 'csv.reader includes the header row ("score"). Calling int("score") raises ValueError. Calling next(reader) skips the header.',
    },
    application: 'Exporting accounting ledgers, importing customer spreadsheets, logging sensor metrics, and processing tabular open data.',
    activity: {
      title: 'Filtering rows with DictReader',
      intro: 'DictReader lets you filter rows by column name.',
      code: 'import csv\nimport io\n\ndata = """city,temp\nDelhi,32\nMumbai,30\nKolkata,31"""\n\nreader = csv.DictReader(io.StringIO(data))\ncities = [row["city"] for row in reader if int(row["temp"]) > 30]\nprint(cities)',
      prediction: 'Which cities have temp > 30?',
      answer: "['Delhi', 'Kolkata']",
      broken: 'import csv\nreader = csv.DictReader(["name,age", "Ayaan,20"])\nfor r in reader:\n    print(r["Age"])',
      repair: 'import csv\nreader = csv.DictReader(["name,age", "Ayaan,20"])\nfor r in reader:\n    print(r["age"])',
      hint: 'CSV header keys are case-sensitive. Look at the capitalization of age.',
      reason: 'KeyError: "Age". DictReader uses exact casing from the header row.',
      remember: 'CSV hamesha text deta hai; numbers ko int() ya float() me convert karna zaroori hai. DictReader se column access readable banta hai.',
    },
    task: {
      id: 'int-csv-orders',
      chapter: 16,
      title: 'Parse and Aggregate CSV Orders',
      difficulty: 'Challenge',
      prompt: 'Implement parse_csv_orders(csv_text: str) -> dict. Using csv.DictReader and io.StringIO, parse rows containing order_id, item, quantity, price. Skip rows where quantity <= 0, price <= 0, or conversion fails. Return a dictionary with: "valid_orders" (count of valid rows), "total_revenue" (sum of quantity * price rounded to 2 decimals), and "items_sold" (dictionary mapping item name to total quantity sold, sorted alphabetically by item name). If csv_text is empty or has no valid rows, return {"valid_orders": 0, "total_revenue": 0.0, "items_sold": {}}.',
      starter: 'import csv\nimport io\n\ndef parse_csv_orders(csv_text: str) -> dict:\n    pass',
      solution: 'import csv\nimport io\n\ndef parse_csv_orders(csv_text: str) -> dict:\n    if not csv_text.strip():\n        return {"valid_orders": 0, "total_revenue": 0.0, "items_sold": {}}\n    reader = csv.DictReader(io.StringIO(csv_text.strip()))\n    valid = 0\n    revenue = 0.0\n    items: dict[str, int] = {}\n    for row in reader:\n        try:\n            qty = int(row["quantity"])\n            price = float(row["price"])\n            if qty <= 0 or price <= 0:\n                continue\n            item = row["item"].strip()\n            valid += 1\n            revenue += qty * price\n            items[item] = items.get(item, 0) + qty\n        except (KeyError, ValueError, TypeError):\n            continue\n    return {"valid_orders": valid, "total_revenue": round(revenue, 2), "items_sold": dict(sorted(items.items()))}',
      expected: '',
      hints: [
        'Direction: Use csv.DictReader(io.StringIO(csv_text.strip())) to read rows into dictionaries.',
        'Specific Guidance: Wrap int(row["quantity"]) and float(row["price"]) in a try/except to ignore corrupt rows.',
        'Strong Hint: Accumulate quantities into a dict and return dict(sorted(items.items())) for alphabetical sorting.',
      ],
      explanation: 'Parsing tabular data defensively ensures malformed lines do not crash the pipeline, while DictReader provides field-name access.',
      cases: [
        {name: 'Valid rows and broken row skipped', check: 'parse_csv_orders("order_id,item,quantity,price\\n1,Tea,3,20.0\\n2,Samosa,2,15.0\\n3,Bad,bad,50.0\\n4,Tea,2,20.0") == {"valid_orders": 3, "total_revenue": 130.0, "items_sold": {"Samosa": 2, "Tea": 5}}'},
        {name: 'Empty CSV text', check: 'parse_csv_orders("") == {"valid_orders": 0, "total_revenue": 0.0, "items_sold": {}}'},
        {name: 'All rows invalid', check: 'parse_csv_orders("order_id,item,quantity,price\\n1,Tea,-1,20.0") == {"valid_orders": 0, "total_revenue": 0.0, "items_sold": {}}'},
      ],
    },
    quiz: [
      {prompt: 'What data type are values returned by `csv.reader` or `csv.DictReader` by default?', options: ['Automatically converted to int, float, or str', 'Strings (str)', 'Byte objects', 'JSON objects'], answer: 1, explanation: 'CSV is plain text; all column values are read as strings and require explicit conversion.'},
      {prompt: 'Why is `csv.DictReader` generally preferred over index-based `csv.reader`?', options: ['It uses 10x less memory', 'Accessing by column name prevents bugs when columns are added or reordered in the CSV', 'It automatically sorts rows', 'It connects directly to SQL databases'], answer: 1, explanation: 'DictReader binds values to header names, making code robust against column repositioning.'},
      {prompt: 'What does `io.StringIO` do in Python?', options: ['Converts an integer to a string', 'Creates an in-memory stream that acts like a file object', 'Encodes text into UTF-32 bytes', 'Downloads a CSV from the internet'], answer: 1, explanation: 'io.StringIO wraps an in-memory string into a file-like stream compatible with file APIs.'},
    ],
    cheatSheet: [
      'import csv, io',
      'reader = csv.DictReader(io.StringIO(csv_text)) -> rows as dicts',
      'reader = csv.reader(io.StringIO(csv_text)) -> next(reader) skips header',
      'Always convert strings to numbers: int(row["qty"]), float(row["price"])',
    ],
  },
  {
    id: 'testing-and-debugging',
    moduleIndex: 5,
    title: 'Testing & Defensive Programming',
    subtitle: 'Write automated assertions, catch boundary bugs, and refactor with confidence',
    estimatedMinutes: 20,
    story: 'A payments startup deployed a discount calculation function. It passed casual manual tests like ₹100 purchases, but crashed on Black Friday when a customer entered an order with zero items or a promo code with spaces. Automated assertions and edge-case testing catch these boundary bugs before production.',
    objectives: [
      'Write automated unit assertions using Python’s assert statement',
      'Identify and test critical edge cases (zero, empty sequences, boundary thresholds)',
      'Interpret traceback stacks and refactor code safely while tests guarantee correctness',
    ],
    concepts: [
      ['The assert Statement', 'assert condition, "Error message" tests assumptions in code. If condition is True, execution continues silently. If False, Python raises an AssertionError with your descriptive error message.'],
      ['Testing Edge Cases', 'Bugs live at the boundaries! Always test: empty inputs ([], "", None), zero (0, 0.0), negative values, maximum thresholds, and boundary numbers (e.g. 17 vs 18 for age).'],
      ['Reading Tracebacks', 'A Python traceback lists calls from oldest to newest. Read from the bottom up: the last line states the exception type and reason; the line above it shows the exact file and line number of the failure.'],
      ['Refactoring With Safety', 'Refactoring means improving internal code structure without changing its external behavior. When a comprehensive suite of assertions passes before and after your edits, you can optimize code with complete confidence.'],
    ],
    visualExplanation: {
      title: 'Automated Test Matrix',
      description: 'Systematic testing verifies happy path, boundary thresholds, and invalid inputs.',
      steps: [
        {title: '1. Happy Path', description: 'Test normal, expected inputs (e.g. valid cart with 3 items).'},
        {title: '2. Boundary Edges', description: 'Test threshold limits (e.g. exactly 0 items, exactly 100% discount).'},
        {title: '3. Invalid Fallbacks', description: 'Test bad data types or negative numbers to confirm exceptions or clean rejections.'},
      ],
    },
    examples: [
      {
        title: 'Defensive function verified with assertion suite',
        code: 'def calculate_discount(price: float, is_student: bool = False) -> float:\n    """Calculate discounted price with edge case validation."""\n    if price < 0:\n        raise ValueError("Price cannot be negative")\n    rate = 0.20 if is_student else 0.05\n    return round(price * (1 - rate), 2)\n\n# Self-contained automated assertion tests\nassert calculate_discount(100.0, False) == 95.0, "Standard discount failed"\nassert calculate_discount(100.0, True) == 80.0, "Student discount failed"\nassert calculate_discount(0.0) == 0.0, "Zero price failed"\nprint("All discount assertion checks passed successfully!")',
        output: 'All discount assertion checks passed successfully!',
        why: 'The function validates against negative values. Three self-checking assert statements verify normal, student, and zero-price boundaries.',
        annotations: [
          ['assert calculate_discount(...) == 95.0', 'Assert evaluates the expression; raises AssertionError if output differs.'],
          ['if price < 0: raise ValueError(...)', 'Defensive programming: rejects impossible domain states early.'],
        ],
      },
    ],
    mistake: {
      code: 'def get_first_and_last(items: list):\n    # Fails with IndexError on empty list!\n    return (items[0], items[-1])\n\nprint(get_first_and_last([10, 20, 30]))\n# Crashes:\nprint(get_first_and_last([]))',
      fix: 'def get_first_and_last(items: list):\n    if not items:\n        return None\n    return (items[0], items[-1])\n\nprint(get_first_and_last([10, 20, 30]))\nprint(get_first_and_last([]))',
      why: 'Accessing items[0] on an empty list raises IndexError. Defensive checking if not items handles the empty collection gracefully.',
    },
    application: 'Automated CI/CD testing pipelines, banking and transaction validation, data sanitation before database persistence.',
    activity: {
      title: 'Catching assertion failures',
      intro: 'assert raises an AssertionError if the condition evaluates to False.',
      code: 'def is_even(n: int) -> bool:\n    return n % 2 == 0\n\ntry:\n    assert is_even(4) == True\n    assert is_even(7) == False\n    assert is_even(0) == False\n    print("Passed all")\nexcept AssertionError:\n    print("Caught assertion failure on 0")',
      prediction: 'What prints when assert is_even(0) == False runs?',
      answer: 'Caught assertion failure on 0',
      broken: 'def divide(a, b):\n    # Missing zero check causes ZeroDivisionError\n    return a / b\n\ndivide(10, 0)',
      repair: 'def divide(a, b):\n    if b == 0:\n        raise ValueError("Cannot divide by zero")\n    return a / b\n\ntry:\n    divide(10, 0)\nexcept ValueError as e:\n    print(e)',
      hint: 'Check if b is zero before dividing and raise a clear ValueError.',
      reason: 'Unchecked denominators cause ZeroDivisionError crashes in production.',
      remember: 'assert se automated tests likho taaki bugs deploy hone se pehle pakde jayein. Boundaries (0, empty list, negative numbers) zaroor test karo.',
    },
    task: {
      id: 'int-validate-reg',
      chapter: 16,
      title: 'Validate User Registration Data',
      difficulty: 'Medium',
      prompt: 'Implement validate_registration(data: dict) -> tuple[bool, str]. Verify: 1) "username" is str, 3 to 20 alphanumeric characters inclusive (username.isalnum()), else return (False, "Invalid username"). 2) "age" is an int >= 13, else return (False, "Invalid age"). 3) "email" is str containing "@" and ending with a domain suffix containing a dot "." after the "@", else return (False, "Invalid email"). If all pass, return (True, "Registration valid").',
      starter: 'def validate_registration(data: dict) -> tuple[bool, str]:\n    pass',
      solution: 'def validate_registration(data: dict) -> tuple[bool, str]:\n    if not isinstance(data, dict):\n        return (False, "Invalid payload")\n    username = data.get("username")\n    if not isinstance(username, str) or not (3 <= len(username) <= 20) or not username.isalnum():\n        return (False, "Invalid username")\n    age = data.get("age")\n    if type(age) is not int or age < 13:\n        return (False, "Invalid age")\n    email = data.get("email")\n    if not isinstance(email, str) or "@" not in email or "." not in email.split("@")[-1]:\n        return (False, "Invalid email")\n    return (True, "Registration valid")',
      expected: '',
      hints: [
        'Direction: Check type and content for username, age, and email in order.',
        'Specific Guidance: Use type(age) is int and age >= 13 so boolean True is not mistaken for 1.',
        'Strong Hint: For email, check "@" in email and "." in email.split("@")[-1].',
      ],
      explanation: 'Defensive validation protects databases and downstream services by verifying data conforms to the contract before processing.',
      cases: [
        {name: 'Valid registration', check: 'validate_registration({"username": "ayaan99", "age": 18, "email": "ayaan@example.com"}) == (True, "Registration valid")'},
        {name: 'Username too short', check: 'validate_registration({"username": "a", "age": 18, "email": "a@b.com"}) == (False, "Invalid username")'},
        {name: 'Underage registration', check: 'validate_registration({"username": "ayaan", "age": 12, "email": "a@b.com"}) == (False, "Invalid age")'},
        {name: 'Malformed email', check: 'validate_registration({"username": "ayaan", "age": 20, "email": "bademail"}) == (False, "Invalid email")'},
      ],
    },
    quiz: [
      {prompt: 'What does Python do when an `assert condition` statement evaluates to False?', options: ['Prints a warning and continues', 'Raises an AssertionError exception', 'Logs the error to syslog', 'Retries the statement'], answer: 1, explanation: 'A false assertion immediately raises an AssertionError, halting execution unless caught.'},
      {prompt: 'Which inputs constitute essential boundary edge cases when testing a numerical discount function?', options: ['Only 100', '0, negative numbers, threshold values, and maximum possible discounts', 'Random large strings', 'Only positive even numbers'], answer: 1, explanation: 'Boundary values like zero, negative numbers, and boundary limits trigger most real-world logic bugs.'},
      {prompt: 'How should you read a multi-line Python traceback error message?', options: ['From top to bottom', 'From bottom to top, starting with the exception name on the last line', 'Only the first line matters', 'Alphabetically'], answer: 1, explanation: 'The bottom of a traceback displays the actual error type and message; lines above show the call chain.'},
    ],
    cheatSheet: [
      'assert condition, "Descriptive failure message"',
      'if not condition: raise ValueError("Explanation")',
      'Test edge cases: [], "", 0, -1, None, boundary numbers',
      'Tracebacks: bottom line gives the error type and message',
    ],
  },
];

export const studentMarksAnalyzerProject = {
  id: 'student-marks-analyzer',
  title: 'Student Marks Analyzer',
  chapters: [13, 14, 16],
  use: 'Process classroom CSV grade exports, validate student records, calculate statistics, and identify top performers.',
  sampleCsv: `student_id,name,math,science,english
S01,Ayaan Khan,85,90,88
S02,Sara Ahmed,92,95,90
S03,Rohan Verma,78,,84
S04,Priya Sharma,65,70,72
S05,Kabir Sen,88,82,85`,
  requirements: [
    'Parse comma-separated values (CSV) into structured student records with student_id and name.',
    'Clean scores: convert numerical marks to float, handle missing or empty values as None.',
    'Calculate student summaries: total marks, average score, and pass status (average >= 50 and all scores >= 40).',
    'Calculate class analytics: overall class average, top-performing student name, and list of honor students (average >= 85).',
    'Support modular, pure functions covered by automated assertion checks.',
  ],
  steps: [
    '1. Implement parse_marks(csv_text) to convert CSV text into dictionary records using csv.DictReader.',
    '2. Implement calculate_student_summary(student) to average available marks and check pass/fail.',
    '3. Implement analyze_class(students) to compute class-wide statistics and top performers.',
    '4. Verify your results against automated assertion tests.',
  ],
  starter: `import csv
import io
import statistics

sample_csv = """student_id,name,math,science,english
S01,Ayaan Khan,85,90,88
S02,Sara Ahmed,92,95,90
S03,Rohan Verma,78,,84
S04,Priya Sharma,65,70,72
S05,Kabir Sen,88,82,85"""

def parse_marks(csv_text: str) -> list[dict]:
    # Parse CSV into list of student dictionaries with clean scores
    pass

def calculate_student_summary(student: dict) -> dict:
    # Compute total, average, and pass status for one student
    pass

def analyze_class(students_data: list[dict]) -> dict:
    # Compute class_average, top_student, and honors list
    pass
`,
  solution: `import csv
import io
import statistics

sample_csv = """student_id,name,math,science,english
S01,Ayaan Khan,85,90,88
S02,Sara Ahmed,92,95,90
S03,Rohan Verma,78,,84
S04,Priya Sharma,65,70,72
S05,Kabir Sen,88,82,85"""

def parse_marks(csv_text: str) -> list[dict]:
    reader = csv.DictReader(io.StringIO(csv_text.strip()))
    students = []
    for row in reader:
        record = {
            'id': row['student_id'].strip(),
            'name': row['name'].strip(),
            'scores': {}
        }
        for sub in ['math', 'science', 'english']:
            val = row.get(sub, '').strip()
            record['scores'][sub] = float(val) if val else None
        students.append(record)
    return students

def calculate_student_summary(student: dict) -> dict:
    valid_scores = [v for v in student['scores'].values() if v is not None]
    avg = statistics.mean(valid_scores) if valid_scores else 0.0
    tot = sum(valid_scores)
    passed = len(valid_scores) > 0 and avg >= 50.0 and all(v >= 40.0 for v in valid_scores)
    return {
        'id': student['id'],
        'name': student['name'],
        'total': round(tot, 1),
        'average': round(avg, 2),
        'passed': passed
    }

def analyze_class(students_data: list[dict]) -> dict:
    summaries = [calculate_student_summary(s) for s in students_data]
    if not summaries:
        return {'class_average': 0.0, 'top_student': None, 'honors': []}
    class_avg = statistics.mean(s['average'] for s in summaries)
    top = max(summaries, key=lambda s: s['average'])
    honors = [s['name'] for s in summaries if s['average'] >= 85.0]
    return {
        'class_average': round(class_avg, 2),
        'top_student': top['name'],
        'honors': honors
    }

# Run sample execution
records = parse_marks(sample_csv)
report = analyze_class(records)
print(f"Class average: {report['class_average']:.2f}")
print(f"Top student: {report['top_student']}")
print(f"Honor roll: {', '.join(report['honors'])}")
`,
  input: '',
  output: `Class average: 83.00\nTop student: Sara Ahmed\nHonor roll: Ayaan Khan, Sara Ahmed, Kabir Sen`,
  tests: [
    'Rohan Verma with missing science mark has valid total 162.0 and average 81.0',
    'Sara Ahmed is identified as top student with 92.33 average',
    'Honor roll includes Ayaan Khan, Sara Ahmed, and Kabir Sen',
    'Handles empty CSV safely returning default 0.0 metrics',
  ],
  mistake: 'Failing to handle missing marks causes float("") to raise ValueError. Check if value is truthy before float() conversion.',
  improvements: [
    'Export generated report summaries back to a new formatted CSV string using csv.writer',
    'Add grade letter assignments (A at 90+, B at 80+, C at 70+)',
    'Generate standard deviation metrics across subjects using statistics.stdev',
  ],
};
