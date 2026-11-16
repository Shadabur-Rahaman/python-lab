import type {Example, Question, Task, TestCase} from './types';

export interface VisualStep {
  title: string;
  description: string;
  code?: string;
}

export interface AdvancedVisualizerConfig {
  type: 'composition' | 'decorator-flow' | 'exception-lifecycle' | 'complexity-matrix' | 'refactor-pipeline';
  title: string;
  subtitle: string;
  data: Record<string, unknown>;
}

export interface AdvancedModule {
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
    steps: VisualStep[];
  };
  visualizer: AdvancedVisualizerConfig;
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
  hinglishTip?: string;
}

export const advancedModules: AdvancedModule[] = [
  {
    id: 'advanced-oop',
    moduleIndex: 1,
    title: 'Advanced OOP, Dataclasses & Special Methods',
    subtitle: 'Master composition, property encapsulation, class methods, dataclasses, and rich dunder protocols',
    estimatedMinutes: 25,
    story: 'In an e-commerce platform, modeling customers, items, discounts, and shopping baskets with deep inheritance hierarchies creates fragile code that breaks easily. By using composition ("a Cart has Items" rather than "a Cart inherits from Product"), encapsulating data with @property, using @classmethod for alternate constructors, writing modern @dataclass objects, and implementing special methods like __str__, __repr__, and __len__, you build reusable, maintainable software.',
    objectives: [
      'Distinguish composition ("has-a") from inheritance ("is-a") to build decoupled systems',
      'Implement encapsulation with @property and @setter for validated attribute access',
      'Differentiate @classmethod (factory constructors) from @staticmethod (pure utilities)',
      'Leverage modern @dataclass to eliminate boilerplate __init__, __repr__, and __eq__ code',
      'Implement dunder protocols (__repr__, __str__, __len__, __eq__) for natural Python integration',
    ],
    concepts: [
      ['Composition over Inheritance', 'Inheritance models an "is-a" relationship (Dog is an Animal), but deep hierarchies create brittle couplings. Composition models a "has-a" relationship (Car has an Engine). Storing helper instances as attributes makes components independently testable and swappable.'],
      ['Encapsulation & @property', 'Prefixing attributes with an underscore (_balance) signals internal use. Use @property to expose a getter and @attribute.setter to expose a setter. This allows you to add defensive validation without changing the public object.attribute syntax.'],
      ['Class Methods vs Static Methods', '@classmethod receives cls as its first parameter and is ideal for factory methods (like from_dict or from_string). @staticmethod receives neither self nor cls; it is a self-contained utility function grouped logically inside the class namespace.'],
      ['Modern @dataclass', 'From the dataclasses module, @dataclass auto-generates __init__, __repr__, and __eq__ from type annotations. Passing frozen=True makes instances immutable and hashable, preventing accidental state corruption.'],
      ['Special Methods (Dunder Protocols)', '__repr__ defines the unambiguous developer string representation, __str__ defines the user-friendly format, and __len__ allows len(instance). Implementing these protocols lets your classes work naturally with Python built-in operations.'],
    ],
    visualExplanation: {
      title: 'Composition vs. Inheritance in Software Architecture',
      description: 'Composition connects independent components like building blocks rather than forcing a rigid tree hierarchy.',
      steps: [
        {title: '1. The Inheritance Trap', description: 'ShoppingCart inheriting from Product leads to nonsensical logic: a cart is NOT a product.'},
        {title: '2. The Composition Solution', description: 'ShoppingCart stores a list of Item objects. It delegates item pricing to items and calculates basket totals.'},
        {title: '3. Encapsulated Properties', description: 'Cart properties (@property total) compute dynamic summaries on demand without stale cached values.'},
      ],
    },
    visualizer: {
      type: 'composition',
      title: 'Object Composition & Protocol Inspector',
      subtitle: 'See how a container delegates responsibilities to composed objects and responds to dunder protocols',
      data: {
        container: 'ShoppingCart',
        items: [
          {name: 'Mechanical Keyboard', price: 89.99, quantity: 1},
          {name: 'USB-C Cable', price: 12.50, quantity: 2},
          {name: 'Desk Mat', price: 24.00, quantity: 1},
        ],
        dunderMethods: ['__len__() -> 4 total items', '__repr__() -> ShoppingCart(items=3)', '__str__() -> ShoppingCart (4 items, $138.99)'],
      },
    },
    examples: [
      {
        title: 'Dataclass and Property Encapsulation',
        code: `from dataclasses import dataclass

@dataclass
class Item:
    name: str
    price: float
    quantity: int = 1

    @property
    def subtotal(self) -> float:
        return round(self.price * self.quantity, 2)

item1 = Item("Python Handbook", 29.50, 2)
print(f"Item: {item1.name}, Subtotal: \${item1.subtotal:.2f}")
print(repr(item1))`,
        output: 'Item: Python Handbook, Subtotal: $59.00\nItem(name=\'Python Handbook\', price=29.5, quantity=2)',
        why: '@dataclass automatically wrote __init__ and __repr__. The @property subtotal dynamically computed price * quantity without storing a redundant variable.',
        annotations: [
          ['@dataclass', 'Auto-generates boilerplate constructors and representations.'],
          ['@property def subtotal', 'Exposes subtotal as a calculated attribute.'],
        ],
      },
      {
        title: 'Factory Class Method & Dunder Protocol',
        code: `class Money:
    def __init__(self, amount: float, currency: str = "USD"):
        if amount < 0:
            raise ValueError("Amount cannot be negative")
        self._amount = round(float(amount), 2)
        self._currency = currency.upper()

    @property
    def amount(self) -> float:
        return self._amount

    @classmethod
    def from_cents(cls, cents: int, currency: str = "USD"):
        return cls(cents / 100.0, currency)

    def __repr__(self) -> str:
        return f"Money({self._amount:.2f}, '{self._currency}')"

    def __str__(self) -> str:
        return f"{self._currency} {self._amount:.2f}"

m1 = Money.from_cents(2450)
print(str(m1))
print(repr(m1))`,
        output: 'USD 24.50\nMoney(24.50, \'USD\')',
        why: '@classmethod from_cents provides a clean alternative constructor. __str__ formats user-facing text, while __repr__ produces unambiguous developer output.',
        annotations: [
          ['@classmethod from_cents(cls, ...)', 'Receives the class and instantiates a new instance.'],
          ['__str__ vs __repr__', 'Differentiates user readability from debugging clarity.'],
        ],
      },
    ],
    mistake: {
      code: `class Product:
    def __init__(self, price):
        self.price = price

    @property
    def price(self):
        return self._price

    @price.setter
    def price(self, value):
        if value < 0:
            raise ValueError("Invalid price")
        self.price = value  # BUG: Recursive call!`,
      fix: `class Product:
    def __init__(self, price):
        self.price = price

    @property
    def price(self):
        return self._price

    @price.setter
    def price(self, value):
        if value < 0:
            raise ValueError("Invalid price")
        self._price = value  # Fixed: store in backing attribute _price`,
      why: 'In a property setter, assigning to self.price calls the setter itself, causing infinite recursion and RecursionError. Store the value in self._price instead.',
    },
    application: 'Enterprise backends, ORMs, and game engines use composition, dataclasses, and properties to build robust models with clean APIs.',
    activity: {
      title: 'Predicting Property Evaluation and Special Methods',
      intro: 'Observe how @property computes values on demand and special methods respond to standard built-in functions.',
      code: `class Book:
    def __init__(self, title, pages):
        self.title = title
        self.pages = pages

    def __len__(self):
        return self.pages

    def __repr__(self):
        return f"Book('{self.title}', {self.pages})"

b = Book("Clean Code", 464)
print(len(b))`,
      prediction: 'What does len(b) print for a Book with 464 pages?',
      answer: '464',
      broken: `class Wallet:
    def __init__(self, balance):
        self._balance = balance

    @property
    def balance(self):
        return self._balance

w = Wallet(100)
print(w.balance())`,
      repair: `class Wallet:
    def __init__(self, balance):
        self._balance = balance

    @property
    def balance(self):
        return self._balance

w = Wallet(100)
print(w.balance)`,
      hint: '@property makes a method callable as a regular attribute. Remove the () parentheses.',
      reason: 'Decorating a method with @property converts it to an attribute getter. Calling it with () raises TypeError: int object is not callable.',
      remember: 'Composition se classes ko loosely coupled rakho. @property getter/setter se validation add karo, aur backing variable me self._var use karo taaki recursion na ho.',
    },
    task: {
      id: 'adv-bank-account',
      chapter: 16,
      title: 'Encapsulated Bank Account with History',
      difficulty: 'Hard',
      prompt: 'Implement a BankAccount class with:\n1. __init__(self, owner: str, initial_balance: float = 0.0) validating owner is a non-empty string and initial_balance >= 0 (raise ValueError otherwise). Initialize an internal transaction history list with [initial_balance] if initial_balance > 0 else [].\n2. @property balance -> float returning the current balance.\n3. deposit(amount: float) -> float validating amount > 0 (raise ValueError otherwise). Adds to balance, records amount in history, and returns new balance.\n4. withdraw(amount: float) -> float validating amount > 0 and amount <= balance (raise ValueError otherwise). Deducts from balance, records -amount in history, and returns new balance.\n5. @classmethod from_balance(cls, owner: str, balance: float) creating a new account.\n6. __repr__(self) returning f"BankAccount(owner=\'{self.owner}\', balance={self.balance:.2f})".\n7. __len__(self) returning the total number of transactions recorded.',
      starter: `class BankAccount:
    def __init__(self, owner: str, initial_balance: float = 0.0):
        # Validate owner and balance, initialize state
        pass

    @property
    def balance(self) -> float:
        pass

    def deposit(self, amount: float) -> float:
        pass

    def withdraw(self, amount: float) -> float:
        pass

    @classmethod
    def from_balance(cls, owner: str, balance: float):
        pass

    def __repr__(self) -> str:
        pass

    def __len__(self) -> int:
        pass`,
      solution: `class BankAccount:
    def __init__(self, owner: str, initial_balance: float = 0.0):
        if not isinstance(owner, str) or not owner.strip():
            raise ValueError("Owner must be a non-empty string")
        if not isinstance(initial_balance, (int, float)) or initial_balance < 0:
            raise ValueError("Initial balance cannot be negative")
        self.owner = owner.strip()
        self._balance = round(float(initial_balance), 2)
        self._transactions = [self._balance] if self._balance > 0 else []

    @property
    def balance(self) -> float:
        return self._balance

    def deposit(self, amount: float) -> float:
        if not isinstance(amount, (int, float)) or amount <= 0:
            raise ValueError("Deposit amount must be positive")
        self._balance = round(self._balance + float(amount), 2)
        self._transactions.append(round(float(amount), 2))
        return self._balance

    def withdraw(self, amount: float) -> float:
        if not isinstance(amount, (int, float)) or amount <= 0:
            raise ValueError("Withdrawal amount must be positive")
        if float(amount) > self._balance:
            raise ValueError("Insufficient funds")
        self._balance = round(self._balance - float(amount), 2)
        self._transactions.append(-round(float(amount), 2))
        return self._balance

    @classmethod
    def from_balance(cls, owner: str, balance: float):
        return cls(owner, balance)

    def __repr__(self) -> str:
        return f"BankAccount(owner='{self.owner}', balance={self._balance:.2f})"

    def __len__(self) -> int:
        return len(self._transactions)`,
      expected: 'BankAccount(owner=\'Aria\', balance=150.00)',
      hints: [
        'Check isinstance and non-empty string for owner, and ensure balance >= 0 in __init__.',
        'In deposit and withdraw, validate positive numbers and update both self._balance and self._transactions.',
        'Use @classmethod with def from_balance(cls, owner, balance): return cls(owner, balance).',
      ],
      explanation: 'Encapsulating the balance property protects financial state from invalid direct mutation, while transaction history and special methods provide complete auditability.',
      tests: `
acc = BankAccount("Aria", 100.0)
assert acc.balance == 100.0
assert len(acc) == 1
assert repr(acc) == "BankAccount(owner='Aria', balance=100.00)"

acc.deposit(50.0)
assert acc.balance == 150.0
assert len(acc) == 2

acc.withdraw(25.0)
assert acc.balance == 125.0
assert len(acc) == 3

try:
    acc.withdraw(200.0)
    assert False, "Should raise ValueError on overdraft"
except ValueError:
    pass

try:
    acc.deposit(-10)
    assert False, "Should raise ValueError on negative deposit"
except ValueError:
    pass

try:
    BankAccount("", 50)
    assert False, "Should raise ValueError on empty owner"
except ValueError:
    pass

acc2 = BankAccount.from_balance("Rohan", 250.0)
assert acc2.owner == "Rohan"
assert acc2.balance == 250.0

print("All BankAccount tests passed!")`,
    },
    quiz: [
      {
        prompt: 'Why is composition often preferred over inheritance in software architecture?',
        options: [
          'It creates loosely coupled components that can change independently',
          'Inheritance is deprecated in modern Python versions',
          'Composition runs twice as fast in the Python interpreter',
          'Inheritance does not allow defining methods'
        ],
        answer: 0,
        explanation: 'Composition ("has-a") links independent objects as attributes, avoiding brittle dependencies where changes in a base class inadvertently break subclasses.',
      },
      {
        prompt: 'What happens if you assign to self.value inside a property setter for value without using a backing variable like self._value?',
        options: [
          'It triggers infinite recursion leading to a RecursionError',
          'Python automatically creates a private variable',
          'The assignment is silently ignored',
          'A SyntaxError is raised at class compile time'
        ],
        answer: 0,
        explanation: 'Assigning to self.value inside value setter re-invokes the setter itself in an infinite loop, ultimately crashing with RecursionError.',
      },
      {
        prompt: 'What is the primary difference between @classmethod and @staticmethod?',
        options: [
          '@classmethod receives the class (cls) as its first argument; @staticmethod receives neither self nor cls',
          '@classmethod can only be called from an instance, while @staticmethod can only be called from a class',
          '@staticmethod can access private variables, while @classmethod cannot',
          'There is no difference; they are interchangeable aliases'
        ],
        answer: 0,
        explanation: '@classmethod receives cls automatically and is commonly used for factory constructors, whereas @staticmethod is a plain function grouped in the class namespace.',
      },
    ],
    cheatSheet: [
      '@dataclass: Automatically generates __init__, __repr__, and __eq__ from typed attributes.',
      '@property: Turns a method into a read-only getter attribute.',
      '@name.setter: Defines validation logic when assigning to obj.name = value.',
      '@classmethod: Takes cls as first parameter; ideal for factory constructors like from_dict(cls, data).',
      '@staticmethod: Pure utility function with no self or cls reference.',
      '__repr__(self): Developer-focused string representation for debugging.',
      '__str__(self): Human-friendly string representation for print().',
      '__len__(self): Enables len(obj).',
    ],
    hinglishTip: 'Inheritance tab use karo jab "is-a" relation ho (Cat is an Animal). Lekin jab "has-a" ho (Cart has Items) toh Composition use karo. Backing variable hamesha self._prop rakho!',
  },

  {
    id: 'decorators-and-closures',
    moduleIndex: 2,
    title: 'Closures, Decorators & Metaprogramming',
    subtitle: 'Write higher-order functions, preserve metadata with functools.wraps, and build cross-cutting decorators',
    estimatedMinutes: 30,
    story: 'In a production web backend, 40 different API endpoints need execution timing, request authentication, and error logging. Copy-pasting boilerplate timing code across every function creates maintenance nightmares. Decorators allow you to cleanly wrap functions with non-invasive cross-cutting behavior, keeping business logic clean and transparent.',
    objectives: [
      'Understand first-class functions and lexical scope in Python',
      'Master closures and state retention using inner functions and nonlocal',
      'Build reusable function decorators with *args and **kwargs',
      'Preserve function name, docstrings, and signatures using functools.wraps',
      'Construct configurable decorator factories that accept custom arguments',
    ],
    concepts: [
      ['First-Class Functions', 'In Python, functions are first-class citizens. You can assign functions to variables, pass them as arguments to other functions, store them in data structures, and return them from functions.'],
      ['Lexical Scoping & Closures', 'An inner function has read access to variables in its outer enclosing scope. A closure occurs when the inner function retains these references even after the outer function has completed execution. Use nonlocal to reassign outer variables.'],
      ['How Decorators Work', 'A decorator is a callable that accepts a function and returns a modified wrapper function. The @decorator syntax above def func() is syntactic sugar for func = decorator(func).'],
      ['Preserving Metadata with functools.wraps', 'A naive wrapper replaces the original function\'s __name__ and __doc__ with "wrapper". Applying @functools.wraps(func) onto the inner wrapper preserves the original function metadata for debugging and documentation tools.'],
      ['Decorators with Arguments', 'To pass parameters to a decorator (e.g. @repeat(times=3)), write a three-tier factory: an outer function accepting configuration, returning the actual decorator, which returns the wrapper.'],
    ],
    visualExplanation: {
      title: 'How a Python Decorator Wraps Execution Flow',
      description: 'The decorator intercepts the incoming call, performs pre-execution tasks, calls the original function, and processes post-execution results.',
      steps: [
        {title: '1. Invocation', description: 'Caller executes decorated_func(*args). Control enters wrapper.'},
        {title: '2. Pre-processing', description: 'Wrapper logs timestamp, validates credentials, or inspects arguments.'},
        {title: '3. Core Execution', description: 'Wrapper invokes original func(*args, **kwargs) and captures return value.'},
        {title: '4. Post-processing', description: 'Wrapper computes elapsed time, caches output, and returns the final result.'},
      ],
    },
    visualizer: {
      type: 'decorator-flow',
      title: 'Decorator Execution Trace Visualizer',
      subtitle: 'Inspect the call stack transition from caller through wrapper to target function and back',
      data: {
        decorator: '@time_and_log',
        targetFunction: 'compute_analytics(dataset_id=42)',
        steps: [
          {stage: 'ENTRY', text: 'Call compute_analytics() intercepted by wrapper(*args, **kwargs)'},
          {stage: 'PRE-HOOK', text: 'Started timer: t0 = 10:00:00.000'},
          {stage: 'TARGET', text: 'Executing original compute_analytics body...'},
          {stage: 'POST-HOOK', text: 'Finished timer: elapsed = 142ms. Recorded metrics.'},
          {stage: 'EXIT', text: 'Wrapper returned result to caller.'},
        ],
      },
    },
    examples: [
      {
        title: 'Execution Counter Closure with nonlocal',
        code: `def make_counter(start: int = 0):
    count = start
    def increment() -> int:
        nonlocal count
        count += 1
        return count
    return increment

c1 = make_counter(10)
print(c1())
print(c1())
print(c1())`,
        output: '11\n12\n13',
        why: 'The inner increment function closes over count. The nonlocal keyword allows modifying the enclosing variable across multiple calls.',
        annotations: [
          ['nonlocal count', 'Enables modifying the variable from the enclosing scope.'],
          ['make_counter returns increment', 'Returns the closure function with bound state.'],
        ],
      },
      {
        title: 'Timing and Metadata Preservation with @wraps',
        code: `import functools

def log_call(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        print(f"Calling {func.__name__} with args={args}")
        result = func(*args, **kwargs)
        print(f"{func.__name__} returned {result}")
        return result
    return wrapper

@log_call
def multiply(a: int, b: int) -> int:
    """Multiply two integers."""
    return a * b

ans = multiply(3, 4)
print(f"Result: {ans}, Function name: {multiply.__name__}")`,
        output: 'Calling multiply with args=(3, 4)\nmultiply returned 12\nResult: 12, Function name: multiply',
        why: '@functools.wraps preserves multiply.__name__ and docstrings. Without it, multiply.__name__ would be "wrapper".',
        annotations: [
          ['@functools.wraps(func)', 'Preserves original name, docstring, and signature.'],
          ['*args, **kwargs', 'Allows the wrapper to accept any parameters.'],
        ],
      },
    ],
    mistake: {
      code: `def double_result(func):
    def wrapper(*args, **kwargs):
        res = func(*args, **kwargs) * 2
        # BUG: forgot to return res!
    return wrapper

@double_result
def add(a, b):
    return a + b

print(add(2, 3))`,
      fix: `def double_result(func):
    def wrapper(*args, **kwargs):
        res = func(*args, **kwargs) * 2
        return res  # Fixed: return the computed result
    return wrapper

@double_result
def add(a, b):
    return a + b

print(add(2, 3))`,
      why: 'A wrapper function must return the result of the decorated function. Forgetting return res causes the decorated function to evaluate to None.',
    },
    application: 'Web frameworks (Flask, FastAPI, Django) use decorators for authentication, routing, rate limiting, and database transactions.',
    activity: {
      title: 'Predicting Decorator Evaluation and Metadata',
      intro: 'Observe how a decorator wraps output and how @wraps retains function identity.',
      code: `import functools

def tag_bold(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        return f"<b>{func(*args, **kwargs)}</b>"
    return wrapper

@tag_bold
def greet(name):
    return f"Hello, {name}"

print(greet("Ada"))`,
      prediction: 'What string is returned when calling greet("Ada")?',
      answer: '<b>Hello, Ada</b>',
      broken: `def repeat(func):
    def wrapper():
        func()
        func()
    return wrapper

@repeat
def say_hi(name):
    print(f"Hi {name}")

say_hi("Sam")`,
      repair: `def repeat(func):
    def wrapper(*args, **kwargs):
        func(*args, **kwargs)
        return func(*args, **kwargs)
    return wrapper

@repeat
def say_hi(name):
    print(f"Hi {name}")

say_hi("Sam")`,
      hint: 'The wrapper must accept (*args, **kwargs) and pass them to func(*args, **kwargs).',
      reason: 'A wrapper defined with zero arguments (def wrapper():) fails with TypeError when the decorated function is called with arguments.',
      remember: 'Decorator ek higher-order function hai jo doosre function ko wrap karta hai. Hamesha @functools.wraps(func) aur *args, **kwargs use karo, aur result return karna mat bhoolo.',
    },
    task: {
      id: 'adv-memoize-decorator',
      chapter: 16,
      title: 'Memoization and Call-Cache Decorator',
      difficulty: 'Hard',
      prompt: 'Implement a memoize(func) decorator that:\n1. Uses @functools.wraps(func) to preserve the original function name and docstrings.\n2. Caches results in a dictionary using the argument tuple as the key.\n3. Attaches a .cache dictionary attribute to the returned wrapper function so callers can inspect or clear cached entries.\n4. Attaches a .call_count integer attribute to the wrapper tracking how many times the UNDERLYING func was actually executed (not cache hits).\n5. Returns cached values on repeated calls without invoking the wrapped func.',
      starter: `import functools

def memoize(func):
    # Implement memoization decorator with .cache and .call_count
    pass`,
      solution: `import functools

def memoize(func):
    cache = {}
    calls = 0

    @functools.wraps(func)
    def wrapper(*args):
        nonlocal calls
        if args in cache:
            return cache[args]
        calls += 1
        wrapper.call_count = calls
        result = func(*args)
        cache[args] = result
        return result

    wrapper.cache = cache
    wrapper.call_count = 0
    return wrapper`,
      expected: '55',
      hints: [
        'Initialize cache = {} and attach it to wrapper.cache = cache before returning wrapper.',
        'Check if args in cache; if present, return cache[args] directly without incrementing calls.',
        'Use @functools.wraps(func) on wrapper so wrapper.__name__ matches func.__name__.',
      ],
      explanation: 'Memoization caches pure function outputs by input arguments, turning exponential time algorithms (like recursive Fibonacci) into linear time operations.',
      tests: `
import functools

@memoize
def fib(n):
    """Compute nth Fibonacci number."""
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)

assert fib(10) == 55
assert fib.__name__ == "fib"
assert fib.__doc__ == "Compute nth Fibonacci number."
assert isinstance(fib.cache, dict)
assert (10,) in fib.cache
assert fib.cache[(10,)] == 55

# Ensure cache hits do not re-execute underlying function
prev_calls = fib.call_count
assert fib(10) == 55
assert fib.call_count == prev_calls

@memoize
def add(a, b):
    return a + b

assert add(2, 3) == 5
assert add.call_count == 1
assert add(2, 3) == 5
assert add.call_count == 1
assert add(3, 4) == 7
assert add.call_count == 2

print("All memoize tests passed!")`,
    },
    quiz: [
      {
        prompt: 'Why should you always decorate the inner wrapper with @functools.wraps(func)?',
        options: [
          'To preserve the original function name, docstring, and signature metadata',
          'To speed up Python bytecode compilation',
          'To allow the wrapper to return values',
          'To automatically convert functions into classes'
        ],
        answer: 0,
        explanation: 'Without @functools.wraps, the decorated function inherits the wrapper name ("wrapper") and loses its original docstring, breaking debugging and introspection.',
      },
      {
        prompt: 'What does the nonlocal keyword do inside a nested closure function?',
        options: [
          'Allows reassigning a variable in the nearest enclosing non-global scope',
          'Imports a variable from another Python module',
          'Declares a variable as global across all threads',
          'Makes the variable private to the inner function'
        ],
        answer: 0,
        explanation: 'nonlocal tells Python that an assignment targets a variable in the enclosing outer function scope rather than creating a local variable.',
      },
      {
        prompt: 'What is the evaluated equivalent of @log_call above def fetch(id): pass?',
        options: [
          'fetch = log_call(fetch)',
          'fetch = log_call()',
          'log_call = fetch(log_call)',
          'fetch = class(log_call)'
        ],
        answer: 0,
        explanation: 'The @decorator syntax is syntactic sugar for passing the defined function into the decorator and re-binding the function name to the returned callable.',
      },
    ],
    cheatSheet: [
      'Closure: Inner function retaining references to variables in an enclosing scope.',
      'nonlocal x: Reassigns variable x in the enclosing outer function.',
      'Decorator pattern: def dec(func): @wraps(func) def wrapper(*a, **k): return func(*a, **k); return wrapper',
      '@functools.wraps(func): Preserves __name__, __doc__, and annotations on wrapper.',
      'Parameterized decorator: def repeat(n): def dec(func): def wrap(*a, **k): ...; return wrap; return dec',
    ],
    hinglishTip: 'Decorator ek wrapper hai jo function ke pehle aur baad me extra code execute karta hai bina original function ko change kiye. Hamesha @wraps(func) use karo!',
  },

  {
    id: 'robust-python-exceptions',
    moduleIndex: 3,
    title: 'Robust Systems & Deep Exception Handling',
    subtitle: 'Architect custom exception hierarchies, manage resource lifecycles with with, and write resilient code',
    estimatedMinutes: 25,
    story: 'In a financial payment processor, database transactions, network gateways, and cryptographic signatures can fail at any step. Silently swallowing exceptions with a generic "except:" causes corrupt ledger state. Architecting domain-specific custom exceptions, utilizing the full try/except/else/finally lifecycle, and building context managers guarantees that open transactions rollback on failure and release all system locks.',
    objectives: [
      'Design clean custom exception hierarchies inheriting from standard Exception',
      'Master the complete try, except, else, and finally execution lifecycle',
      'Preserve debugging tracebacks using exception chaining with "raise from"',
      'Build custom context managers using the __enter__ and __exit__ protocol',
      'Leverage contextlib.contextmanager for lightweight generator-based resource management',
    ],
    concepts: [
      ['Custom Exception Hierarchies', 'Derive custom exceptions from Exception (never BaseException). Create a base domain error (e.g. BankingError) and specific subclasses (InsufficientFundsError, AccountLockedError). This lets callers catch the entire domain family or handle specific edge cases.'],
      ['The Full Exception Lifecycle', 'try executes code that may raise errors. except catches targeted exception types. else executes ONLY if no exception was raised in try. finally ALWAYS executes, regardless of whether exceptions were raised or caught, making it the bedrock of resource cleanup.'],
      ['Exception Chaining (raise ... from)', 'When translating low-level errors (like sqlite3.OperationalError or KeyError) into clean domain exceptions, write raise DatabaseSyncError("Failed") from err. Python links the tracebacks so root cause diagnostics are never lost.'],
      ['Context Managers (__enter__ and __exit__)', 'The with statement guarantees cleanup. __enter__ sets up the resource and returns the target object. __exit__(exc_type, exc_val, exc_tb) handles teardown. Returning True from __exit__ suppresses the exception; returning False allows it to propagate.'],
      ['contextlib.contextmanager', 'The @contextmanager decorator turns a generator with a single yield into a context manager. Code before yield is setup; code in finally after yield is teardown.'],
    ],
    visualExplanation: {
      title: 'The try-except-else-finally State Machine',
      description: 'Understanding the deterministic sequence of Python error handling states ensures resources are never leaked.',
      steps: [
        {title: '1. try Block', description: 'Python executes the protected statement block.'},
        {title: '2. Exception Raised?', description: 'YES -> Jump to matching except block. NO -> Jump to else block.'},
        {title: '3. finally Block', description: 'Always runs unconditionally before control leaves the construct.'},
        {title: '4. Cleanup Guarantee', description: 'Open sockets, file descriptors, and database locks are safely closed.'},
      ],
    },
    visualizer: {
      type: 'exception-lifecycle',
      title: 'Exception Lifecycle & Propagation Explorer',
      subtitle: 'Simulate successful vs failed operations to observe the exact path through except, else, and finally',
      data: {
        scenarios: [
          {
            name: 'Success Flow',
            path: ['try: query_db()', 'else: commit_transaction()', 'finally: close_connection()'],
            outcome: 'Transaction committed cleanly; connection closed.',
          },
          {
            name: 'Error Flow (Handled)',
            path: ['try: query_db() -> raises DBTimeout', 'except DBTimeout: rollback()', 'finally: close_connection()'],
            outcome: 'Rollback triggered; connection closed; error handled.',
          },
        ],
      },
    },
    examples: [
      {
        title: 'Complete try-except-else-finally Lifecycle',
        code: `def process_transaction(amount: float, balance: float):
    print("--- Starting Transaction ---")
    try:
        if amount <= 0:
            raise ValueError("Amount must be positive")
        if amount > balance:
            raise ArithmeticError("Insufficient funds")
        new_balance = balance - amount
    except ValueError as e:
        print(f"Validation Error: {e}")
        return balance
    except ArithmeticError as e:
        print(f"Business Rule Error: {e}")
        return balance
    else:
        print(f"Success! New balance: \${new_balance:.2f}")
        return new_balance
    finally:
        print("Audit log recorded.")

b1 = process_transaction(40.0, 100.0)
b2 = process_transaction(150.0, b1)`,
        output: '--- Starting Transaction ---\nSuccess! New balance: $60.00\nAudit log recorded.\n--- Starting Transaction ---\nBusiness Rule Error: Insufficient funds\nAudit log recorded.',
        why: 'The else block ran only when the balance deduction succeeded. The finally block ran in both success and failure cases to record audit logs.',
        annotations: [
          ['else block', 'Executes ONLY if try completed without any exceptions.'],
          ['finally block', 'Guaranteed to run in both success and exception paths.'],
        ],
      },
      {
        title: 'Custom Context Manager with __enter__ and __exit__',
        code: `class ManagedFile:
    def __init__(self, filename: str):
        self.filename = filename
        self.status = "closed"

    def __enter__(self):
        self.status = "open"
        print(f"Opened resource: {self.filename}")
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.status = "closed"
        print(f"Closed resource: {self.filename}")
        return False  # Do not suppress exceptions

with ManagedFile("data.csv") as f:
    print(f"Inside with block: file is {f.status}")
print(f"After with block: file is {f.status}")`,
        output: 'Opened resource: data.csv\nInside with block: file is open\nClosed resource: data.csv\nAfter with block: file is closed',
        why: 'The with statement automatically called __enter__ on entry and __exit__ on exit, guaranteeing the file status returned to "closed".',
        annotations: [
          ['__enter__', 'Sets up resource and returns the bound target.'],
          ['__exit__', 'Cleans up resource even if an unhandled error occurred.'],
        ],
      },
    ],
    mistake: {
      code: `def load_config():
    try:
        with open("missing.json") as f:
            return f.read()
    except:  # BUG: Bare except catches KeyboardInterrupt and SystemExit!
        pass`,
      fix: `def load_config():
    try:
        with open("missing.json") as f:
            return f.read()
    except FileNotFoundError:  # Fixed: catch specific expected exception
        return "{}"`,
      why: 'Never use bare "except:". It catches system exit signals, typing errors, and interrupts, masking serious bugs. Always catch specific exceptions like FileNotFoundError or ValueError.',
    },
    application: 'Database transaction blocks, network connection pools, and thread locks rely on context managers to guarantee cleanup.',
    activity: {
      title: 'Predicting Exception Flow and finally Execution',
      intro: 'Trace how control transfers across try, except, else, and finally.',
      code: `def trace():
    output = []
    try:
        output.append("A")
        raise KeyError()
    except KeyError:
        output.append("B")
    else:
        output.append("C")
    finally:
        output.append("D")
    return "".join(output)

print(trace())`,
      prediction: 'What string does trace() return?',
      answer: 'ABD',
      broken: `class DatabaseSession:
    def __enter__(self):
        print("Connected")
        return self

    def __exit__(self):  # BUG: __exit__ must accept 4 arguments!
        print("Disconnected")

with DatabaseSession():
    pass`,
      repair: `class DatabaseSession:
    def __enter__(self):
        print("Connected")
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        print("Disconnected")
        return False

with DatabaseSession():
    pass`,
      hint: '__exit__ requires 4 parameters: (self, exc_type, exc_val, exc_tb).',
      reason: 'Python passes exception diagnostic info to __exit__. If the signature has fewer parameters, Python raises TypeError: __exit__ takes 1 positional argument but 4 were given.',
      remember: 'Bare "except:" kabhi mat likho. Specific error catch karo. else block tab chalta hai jab koi error na ho, aur finally hamesha clean up ke liye chalta hai.',
    },
    task: {
      id: 'adv-transaction-manager',
      chapter: 16,
      title: 'Resilient Transaction Context Manager',
      difficulty: 'Hard',
      prompt: 'Implement a TransactionManager context manager class and custom exceptions:\n1. Define TransactionError(Exception) as base exception, and InsufficientFundsError(TransactionError) as subclass.\n2. TransactionManager(account_id: str, balance: float):\n   - __enter__(self): marks state as "active", stores initial balance snapshot, and returns self.\n   - record(self, amount: float): deducts amount from balance. If amount > balance, raises InsufficientFundsError.\n   - __exit__(self, exc_type, exc_val, exc_tb): if an exception occurred, rolls back balance to initial snapshot and sets status to "rolled_back". If no exception occurred, sets status to "committed". Does not suppress exceptions (returns False).\n   - @property balance: returns current balance.\n   - @property status: returns "idle", "active", "committed", or "rolled_back".',
      starter: `class TransactionError(Exception):
    pass

class InsufficientFundsError(TransactionError):
    pass

class TransactionManager:
    def __init__(self, account_id: str, balance: float):
        pass

    def __enter__(self):
        pass

    def record(self, amount: float):
        pass

    def __exit__(self, exc_type, exc_val, exc_tb):
        pass

    @property
    def balance(self) -> float:
        pass

    @property
    def status(self) -> str:
        pass`,
      solution: `class TransactionError(Exception):
    pass

class InsufficientFundsError(TransactionError):
    pass

class TransactionManager:
    def __init__(self, account_id: str, balance: float):
        if balance < 0:
            raise ValueError("Balance cannot be negative")
        self.account_id = account_id
        self._balance = float(balance)
        self._snapshot = float(balance)
        self._status = "idle"

    def __enter__(self):
        self._status = "active"
        self._snapshot = self._balance
        return self

    def record(self, amount: float):
        if self._status != "active":
            raise TransactionError("Transaction is not active")
        if amount <= 0:
            raise ValueError("Amount must be positive")
        if amount > self._balance:
            raise InsufficientFundsError(f"Insufficient funds: needed {amount}, available {self._balance}")
        self._balance = round(self._balance - float(amount), 2)
        return self._balance

    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type is not None:
            self._balance = self._snapshot
            self._status = "rolled_back"
            return False  # Propagate exception
        self._status = "committed"
        return False

    @property
    def balance(self) -> float:
        return self._balance

    @property
    def status(self) -> str:
        return self._status`,
      expected: 'Committed: 60.0, Rolled back: 100.0',
      hints: [
        'In __enter__, set _snapshot = _balance and _status = "active", then return self.',
        'In __exit__, check if exc_type is not None; if so, restore _balance = _snapshot and set _status = "rolled_back".',
        'Always return False from __exit__ so exceptions are not silently swallowed.',
      ],
      explanation: 'Context managers implement transactional rollback semantics: if any step fails midway, state reverts cleanly to the snapshot before the block started.',
      tests: `
tm = TransactionManager("acc-1", 100.0)
assert tm.status == "idle"

# Test successful commit
with tm as t:
    t.record(20.0)
    t.record(20.0)
    assert t.balance == 60.0

assert tm.status == "committed"
assert tm.balance == 60.0

# Test rollback on InsufficientFundsError
tm2 = TransactionManager("acc-2", 100.0)
try:
    with tm2 as t:
        t.record(50.0)
        t.record(80.0)  # Should raise InsufficientFundsError
        assert False, "Should have failed on insufficient funds"
except InsufficientFundsError:
    pass

assert tm2.status == "rolled_back"
assert tm2.balance == 100.0  # Balance was rolled back to snapshot!

# Verify inheritance
assert issubclass(InsufficientFundsError, TransactionError)
assert issubclass(TransactionError, Exception)

print("All TransactionManager tests passed!")`,
    },
    quiz: [
      {
        prompt: 'In a try-except-else-finally statement, when does the else block execute?',
        options: [
          'Only when the try block completes successfully without raising any exceptions',
          'Only when an exception was raised and caught',
          'Always, immediately before the finally block',
          'Whenever the finally block returns True'
        ],
        answer: 0,
        explanation: 'The else block executes only if no exception occurred in the try block. It separates code that might raise exceptions from code that should run on success.',
      },
      {
        prompt: 'What is the purpose of raising an exception with "raise NewError() from err"?',
        options: [
          'To chain exceptions so the original traceback and root cause are preserved',
          'To suppress the original error completely',
          'To convert an error into a warning',
          'To re-run the failed function automatically'
        ],
        answer: 0,
        explanation: 'Exception chaining (raise ... from err) explicitly links the original low-level error to the new domain exception in the traceback for easier debugging.',
      },
      {
        prompt: 'What must a custom context manager\'s __exit__ method return to suppress an exception raised inside the with block?',
        options: [
          'A truthy value such as True',
          'None',
          'A falsy value such as False',
          'The exception object itself'
        ],
        answer: 0,
        explanation: 'If __exit__ returns True, Python suppresses the exception and continues execution outside the with block. Returning False or None propagates the error.',
      },
    ],
    cheatSheet: [
      'try: Code that may raise errors.',
      'except SpecificError as e: Handles specific exception type.',
      'else: Runs ONLY if try had zero errors.',
      'finally: Runs ALWAYS; ideal for releasing resources and closing connections.',
      'raise DomainError("msg") from err: Explicit exception chaining.',
      '__enter__(self): Context manager setup; returns value for "as target".',
      '__exit__(self, exc_type, exc_val, exc_tb): Teardown; return True to suppress errors.',
    ],
    hinglishTip: 'Context manager ke saath "with" use karne se resource leak nahi hota. Agar error aaye toh __exit__ me rollback karo aur snapshot restore karo!',
  },

  {
    id: 'data-structures-algorithms',
    moduleIndex: 4,
    title: 'Computational Complexity & Specialized Collections',
    subtitle: 'Gain Big-O intuition, leverage Counter, defaultdict, and deque, and optimize searching and sorting',
    estimatedMinutes: 30,
    story: 'An analytics engine scans 200,000 server access log entries every minute. A developer checking "if user_id in user_list" accidentally introduced an O(n^2) bottleneck that timed out the server. Replacing linear list scans with hash set lookups (O(1)), using collections.Counter for frequency analytics, and collections.deque for sliding window averages transformed a 40-second lag into a 15-millisecond response.',
    objectives: [
      'Develop intuition for Big-O complexity: O(1), O(log n), O(n), O(n log n), and O(n^2)',
      'Compare lookup efficiency: linear list scans vs hash table sets and dicts',
      'Use collections.Counter for item frequencies and multi-set arithmetic',
      'Apply collections.defaultdict to eliminate manual dictionary key initialization checks',
      'Leverage collections.deque for true O(1) double-ended queue operations',
    ],
    concepts: [
      ['Big-O Complexity Intuition', 'Big-O notation describes how execution time or memory requirements grow as input size n increases. O(1) is constant time. O(log n) halves the problem each step (binary search). O(n) scales linearly. O(n log n) is optimal comparison sorting. O(n^2) becomes prohibitively slow on large datasets.'],
      ['Set / Dict vs List Lookups', 'Checking "x in my_list" is an O(n) linear scan that checks every element from first to last. Sets and dictionaries use hash tables, offering amortized O(1) lookup time by converting keys directly into memory array buckets.'],
      ['collections.Counter', 'Counter is a specialized dictionary subclass designed for counting hashable objects. It provides .most_common(k) to retrieve top frequencies and supports addition (+), subtraction (-), and intersection (&) across counters.'],
      ['collections.defaultdict', 'defaultdict avoids KeyError by automatically calling a factory function (like list, int, or set) whenever a non-existent key is accessed. It eliminates boilerplate "if key not in d: d[key] = []" checks.'],
      ['collections.deque for Queues', 'Python lists are dynamic arrays: list.append() and list.pop() at the end are O(1), but list.insert(0, x) or list.pop(0) at the front take O(n) time because all remaining elements must shift. deque is a doubly-linked list with true O(1) appends and pops at both ends.'],
    ],
    visualExplanation: {
      title: 'Time Complexity Growth: O(1) vs. O(n) vs. O(n^2)',
      description: 'As input sizes scale from 1,000 to 1,000,000 items, algorithmic choices dictate whether code runs in milliseconds or hours.',
      steps: [
        {title: '1. Constant O(1)', description: 'Set lookup: 1,000 items -> 1 step. 1,000,000 items -> 1 step. Immediate direct address.'},
        {title: '2. Linear O(n)', description: 'List scan: 1,000 items -> 1,000 steps. 1,000,000 items -> 1,000,000 steps.'},
        {title: '3. Quadratic O(n^2)', description: 'Nested loop: 1,000 items -> 1,000,000 steps. 100,000 items -> 10,000,000,000 operations! Server freeze.'},
      ],
    },
    visualizer: {
      type: 'complexity-matrix',
      title: 'Data Structure Complexity & Operation Matrix',
      subtitle: 'Compare time complexities across standard Python sequences and specialized collections',
      data: {
        operations: [
          {structure: 'list', access: 'O(1)', search: 'O(n)', insertFront: 'O(n)', appendEnd: 'O(1)'},
          {structure: 'deque', access: 'O(n)', search: 'O(n)', insertFront: 'O(1)', appendEnd: 'O(1)'},
          {structure: 'set', access: 'N/A', search: 'O(1)', insertFront: 'O(1)', appendEnd: 'O(1)'},
          {structure: 'dict', access: 'O(1)', search: 'O(1)', insertFront: 'O(1)', appendEnd: 'O(1)'},
        ],
      },
    },
    examples: [
      {
        title: 'High-Performance Counting with Counter',
        code: `from collections import Counter

logs = ["login", "view", "login", "buy", "login", "view", "logout"]
counts = Counter(logs)

print(f"Login count: {counts['login']}")
print(f"Top 2 events: {counts.most_common(2)}")`,
        output: 'Login count: 3\nTop 2 events: [(\'login\', 3), (\'view\', 2)]',
        why: 'Counter tallied frequencies in a single O(n) pass. most_common(2) efficiently extracted the highest frequency items without sorting the entire dataset.',
        annotations: [
          ['Counter(logs)', 'Tallies element counts in O(n) time.'],
          ['.most_common(k)', 'Extracts top k frequent elements.'],
        ],
      },
      {
        title: 'Group Ingestion with defaultdict & Fast Queue with deque',
        code: `from collections import defaultdict, deque

# Grouping items by category
grouped = defaultdict(list)
items = [("fruit", "apple"), ("veg", "carrot"), ("fruit", "banana")]
for cat, item in items:
    grouped[cat].append(item)

print(f"Fruits: {grouped['fruit']}")

# Double-ended queue O(1) operations
q = deque([10, 20, 30])
q.append(40)       # O(1) end
q.appendleft(0)    # O(1) front
print(f"Queue: {list(q)}")
first = q.popleft() # O(1) pop from front
print(f"Popped first: {first}, Remaining: {list(q)}")`,
        output: 'Fruits: [\'apple\', \'banana\']\nQueue: [0, 10, 20, 30, 40]\nPopped first: 0, Remaining: [10, 20, 30, 40]',
        why: 'defaultdict(list) eliminated key existence checks. deque performed O(1) insertions and removals at both ends without shifting array elements.',
        annotations: [
          ['defaultdict(list)', 'Initializes empty list on first access.'],
          ['deque.appendleft() / popleft()', 'Performs true O(1) operations on front of sequence.'],
        ],
      },
    ],
    mistake: {
      code: `items = list(range(10000))
# Process queue from the front
while items:
    item = items.pop(0)  # BUG: O(n) pop on every step -> O(n^2) overall!
    # process item`,
      fix: `from collections import deque
items = deque(range(10000))
while items:
    item = items.popleft()  # Fixed: O(1) popleft from deque!
    # process item`,
      why: 'Calling list.pop(0) on a Python list forces the interpreter to shift every remaining item left by one index in memory on every iteration, causing O(n^2) performance. Use deque.popleft() for O(1) queue processing.',
    },
    application: 'Log parsing, sliding window metric calculations, breadth-first search (BFS) graph traversals, and real-time event aggregation.',
    activity: {
      title: 'Predicting Complexity and Collection Outputs',
      intro: 'Observe how defaultdict and Counter aggregate information.',
      code: `from collections import Counter

c1 = Counter(a=3, b=1)
c2 = Counter(a=1, b=2)
diff = c1 - c2
print(diff["a"], diff["b"])`,
      prediction: 'What two numbers print for diff["a"] and diff["b"]?',
      answer: '2 0',
      broken: `from collections import defaultdict
grades = defaultdict()  # BUG: factory function omitted!
grades["Alice"].append(95)`,
      repair: `from collections import defaultdict
grades = defaultdict(list)
grades["Alice"].append(95)`,
      hint: 'defaultdict requires a callable factory like list or int: defaultdict(list).',
      reason: 'Calling defaultdict() without a factory function behaves like a regular dict and raises KeyError on non-existent keys.',
      remember: 'Jab bhi frequent item search karna ho, list ke badle set ya dict use karo O(1) lookup ke liye. Queue processing ke liye hamesha collections.deque use karo.',
    },
    task: {
      id: 'adv-frequency-analyzer',
      chapter: 16,
      title: 'Log Stream Event & Error Frequency Analyzer',
      difficulty: 'Hard',
      prompt: 'Implement analyze_event_stream(events: list[dict], top_k: int = 3) -> dict that processes log dictionaries:\nEach event is {"service": str, "level": "INFO" | "WARN" | "ERROR", "message": str}.\n1. If events is empty or top_k <= 0, return {"total_events": 0, "error_count": 0, "by_service": {}, "top_errors": []}.\n2. Count total events and total error events (where level == "ERROR").\n3. Use collections.defaultdict(int) to count event volume per service.\n4. Use collections.Counter to track error messages and extract top_k most common error messages as a list of tuples: [(message, count), ...].\n5. Return {"total_events": total, "error_count": errors, "by_service": dict(by_service), "top_errors": top_errors}.',
      starter: `from collections import defaultdict, Counter

def analyze_event_stream(events: list[dict], top_k: int = 3) -> dict:
    # Process event logs with defaultdict and Counter
    pass`,
      solution: `from collections import defaultdict, Counter

def analyze_event_stream(events: list[dict], top_k: int = 3) -> dict:
    if not events or top_k <= 0:
        return {"total_events": 0, "error_count": 0, "by_service": {}, "top_errors": []}

    by_service = defaultdict(int)
    error_counter = Counter()
    total_events = len(events)
    error_count = 0

    for event in events:
        service = event.get("service", "unknown")
        level = event.get("level", "INFO")
        msg = event.get("message", "")

        by_service[service] += 1
        if level == "ERROR":
            error_count += 1
            error_counter[msg] += 1

    return {
        "total_events": total_events,
        "error_count": error_count,
        "by_service": dict(by_service),
        "top_errors": error_counter.most_common(top_k),
    }`,
      expected: "{'total_events': 4, 'error_count': 2, ...}",
      hints: [
        'Initialize by_service = defaultdict(int) and error_counter = Counter().',
        'Loop through events: update by_service[service] += 1 and if level == "ERROR": error_counter[msg] += 1.',
        'Use error_counter.most_common(top_k) and convert by_service to dict(by_service) for output.',
      ],
      explanation: 'Combining defaultdict and Counter allows processing large event streams in a single linear pass (O(n)) with O(1) intermediate aggregations.',
      tests: `
sample = [
    {"service": "auth", "level": "INFO", "message": "User login"},
    {"service": "payment", "level": "ERROR", "message": "Card declined"},
    {"service": "auth", "level": "ERROR", "message": "Invalid password"},
    {"service": "payment", "level": "ERROR", "message": "Card declined"},
]

res = analyze_event_stream(sample, top_k=2)
assert res["total_events"] == 4
assert res["error_count"] == 3
assert res["by_service"]["auth"] == 2
assert res["by_service"]["payment"] == 2
assert res["top_errors"] == [("Card declined", 2), ("Invalid password", 1)]

# Edge cases
empty_res = analyze_event_stream([])
assert empty_res["total_events"] == 0
assert empty_res["by_service"] == {}
assert empty_res["top_errors"] == []

zero_k = analyze_event_stream(sample, top_k=0)
assert zero_k["top_errors"] == []

print("All analyze_event_stream tests passed!")`,
    },
    quiz: [
      {
        prompt: 'What is the average time complexity for checking if an item exists in a Python set compared to a Python list?',
        options: [
          'Set is O(1) average; List is O(n)',
          'Set is O(n); List is O(1)',
          'Both are O(log n)',
          'Both are O(n^2)'
        ],
        answer: 0,
        explanation: 'Python sets use hash tables allowing O(1) amortized lookup, while lists require an O(n) scan across all items.',
      },
      {
        prompt: 'Why is collections.deque significantly faster than a Python list for implementing queues with front pop operations?',
        options: [
          'deque.popleft() is O(1) because it is a doubly-linked list, while list.pop(0) is O(n) because it shifts all elements',
          'deque compresses items using gzip in memory',
          'list cannot remove items from the front',
          'deque executes in a separate CPU thread'
        ],
        answer: 0,
        explanation: 'list.pop(0) shifts every subsequent element in memory (O(n)), whereas deque unlinks the front node in O(1) time.',
      },
      {
        prompt: 'What does collections.Counter("banana").most_common(1) return?',
        options: [
          "[('a', 3)]",
          "('a', 3)",
          "{'a': 3}",
          "['a']"
        ],
        answer: 0,
        explanation: 'most_common(1) returns a list of tuples containing the top 1 most frequent elements and their counts: [("a", 3)].',
      },
    ],
    cheatSheet: [
      'O(1): Constant time (dict lookup, set check, deque append/pop).',
      'O(n): Linear time (list lookup, min/max, manual loop).',
      'O(n log n): Efficient sort (sorted(), list.sort()).',
      'Counter(seq): Tallies item frequencies; .most_common(k) gives top k.',
      'defaultdict(factory): Auto-initializes missing keys (e.g. defaultdict(list)).',
      'deque(maxlen=N): Double-ended queue with O(1) appendleft() and popleft().',
    ],
    hinglishTip: 'List me "in" check O(n) hota hai, jabki Set me O(1) hota hai. Millions of items search karne ke liye hamesha Set use karo!',
  },

  {
    id: 'maintainable-code-testing',
    moduleIndex: 5,
    title: 'Maintainable Architecture, Type Hints & Unit Testing',
    subtitle: 'Write clean, self-documenting code with type annotations, apply Single Responsibility, and verify with unittest',
    estimatedMinutes: 30,
    story: 'A fast-growing software company has thousands of lines of procedural Python with 200-line functions. Changing a single line breaks features across multiple modules because code lacks type annotations and unit test coverage. Adopting type hints, refactoring monolithic scripts into single-responsibility functions, and writing automated test suites with unittest transforms an unmaintainable codebase into resilient software.',
    objectives: [
      'Annotate functions and classes using modern Python type hints (Optional, Union, Generic collections)',
      'Apply the Single Responsibility Principle (SRP) to keep functions focused and testable',
      'Organize comprehensive test cases using the standard unittest framework',
      'Refactor tightly coupled procedural scripts into clean, decoupled functions',
      'Handle boundary conditions and edge cases defensively without crashing',
    ],
    concepts: [
      ['Type Annotations & Static Contracts', 'Type hints (like def process(items: list[str]) -> dict[str, int]:) document function contracts for developers and static analyzers like mypy. They catch mismatched types before runtime without slowing down code execution.'],
      ['Single Responsibility Principle (SRP)', 'Every function or class should have one reason to change. If a function fetches data, validates fields, and formats output, split it into three distinct functions. Pure, focused functions are effortless to test and reuse.'],
      ['Standard Unit Testing with unittest', 'Python\'s standard unittest module organizes tests into subclasses of unittest.TestCase. Methods starting with test_ execute automatically, using self.assertEqual(), self.assertTrue(), and self.assertRaises() to verify behavior.'],
      ['Test Fixtures with setUp()', 'In a TestCase, the setUp() method runs before every individual test method, establishing a clean, predictable state and avoiding test pollution.'],
      ['Refactoring Towards Testability', 'Code that directly accesses global state or hardcoded system resources cannot be tested in isolation. Refactor by injecting dependencies as parameters, making components modular and mockable.'],
    ],
    visualExplanation: {
      title: 'The Refactoring & Unit Testing Pipeline',
      description: 'Transforming fragile procedural code into verified, maintainable production software.',
      steps: [
        {title: '1. Establish Baseline', description: 'Write unit tests capturing current behavior to detect regressions.'},
        {title: '2. Add Type Contracts', description: 'Annotate parameters and return values to define interface boundaries.'},
        {title: '3. Decompose Monolith', description: 'Extract sub-routines into single-responsibility pure functions.'},
        {title: '4. Verify & Harden', description: 'Run test suite verifying all edge cases, null values, and boundaries pass.'},
      ],
    },
    visualizer: {
      type: 'refactor-pipeline',
      title: 'Code Refactoring & Testing Architecture',
      subtitle: 'See how a monolithic 60-line function decomposes into typed, testable, cohesive units',
      data: {
        stages: [
          {name: 'Monolith', issue: 'Parses raw string + validates + aggregates + writes disk in 1 block'},
          {name: 'Parse Stage', solution: 'parse_records(raw: str) -> list[dict] (Pure function)'},
          {name: 'Validate Stage', solution: 'validate_record(r: dict) -> ValidatedRecord (Raises ValueError)'},
          {name: 'Aggregate Stage', solution: 'calculate_totals(records: list[ValidatedRecord]) -> Summary'},
          {name: 'Test Suite', solution: 'unittest.TestCase testing each stage independently with 100% coverage'},
        ],
      },
    },
    examples: [
      {
        title: 'Type Hints and Clean Architecture',
        code: `def calculate_discount(price: float, discount_pct: float = 0.0) -> float:
    """Calculate discounted price rounded to two decimals."""
    if not (0.0 <= discount_pct <= 100.0):
        raise ValueError("Discount must be between 0 and 100")
    if price < 0.0:
        raise ValueError("Price cannot be negative")
    factor = (100.0 - discount_pct) / 100.0
    return round(price * factor, 2)

p = calculate_discount(120.0, 15.0)
print(f"Discounted price: \${p:.2f}")`,
        output: 'Discounted price: $102.00',
        why: 'Type annotations define explicit contracts. Defensive checks validate boundaries before mathematical operations occur.',
        annotations: [
          ['price: float, discount_pct: float', 'Type hints specify expected parameter types.'],
          ['-> float', 'Explicit return type declaration.'],
        ],
      },
      {
        title: 'Automated Testing with unittest.TestCase',
        code: `import unittest

def is_valid_email(email: str) -> bool:
    if not isinstance(email, str) or "@" not in email:
        return False
    user, _, domain = email.partition("@")
    return bool(user and "." in domain and not domain.startswith("."))

class TestEmailValidation(unittest.TestCase):
    def test_valid_emails(self):
        self.assertTrue(is_valid_email("user@example.com"))
        self.assertTrue(is_valid_email("dev.team@corp.org"))

    def test_invalid_emails(self):
        self.assertFalse(is_valid_email("plainaddress"))
        self.assertFalse(is_valid_email("@missinguser.com"))
        self.assertFalse(is_valid_email("user@nodot"))

suite = unittest.TestLoader().loadTestsFromTestCase(TestEmailValidation)
runner = unittest.TextTestRunner(verbosity=0)
result = runner.run(suite)
print(f"Tests run: {result.testsRun}, Errors: {len(result.errors)}, Failures: {len(result.failures)}")`,
        output: 'Tests run: 2, Errors: 0, Failures: 0',
        why: 'unittest.TestCase structured tests cleanly. Assertions like assertTrue and assertFalse verified both happy path and edge cases.',
        annotations: [
          ['unittest.TestCase', 'Base class providing test harness and assertions.'],
          ['self.assertTrue / assertFalse', 'Precise boolean assertion checks.'],
        ],
      },
    ],
    mistake: {
      code: `def append_item(item, target_list=[]):  # BUG: Mutable default argument!
    target_list.append(item)
    return target_list

print(append_item("a"))
print(append_item("b"))  # Prints ['a', 'b'] instead of ['b']!`,
      fix: `def append_item(item, target_list=None):  # Fixed: use None as default
    if target_list is None:
        target_list = []
    target_list.append(item)
    return target_list

print(append_item("a"))
print(append_item("b"))`,
      why: 'Default parameter values are evaluated once when the function is defined, NOT each time it is called. Using a mutable default (like [] or {}) causes data to persist across calls. Always use None as the default sentinel value.',
    },
    application: 'Production libraries, CI/CD automated test pipelines, and enterprise microservices maintain high software quality through typing and unit tests.',
    activity: {
      title: 'Predicting Unit Test and Default Parameter Behavior',
      intro: 'Observe how mutable default parameters behave across repeated calls.',
      code: `def tag(val, tags=[]):
    tags.append(val)
    return len(tags)

t1 = tag("python")
t2 = tag("lab")
print(t1, t2)`,
      prediction: 'What two numbers print for t1 and t2?',
      answer: '1 2',
      broken: `import unittest

class MathTests(unittest.TestCase):
    def check_addition(self):  # BUG: test method must start with test_!
        self.assertEqual(2 + 2, 4)

suite = unittest.TestLoader().loadTestsFromTestCase(MathTests)
print(suite.countTestCases())`,
      repair: `import unittest

class MathTests(unittest.TestCase):
    def test_addition(self):  # Fixed: name starts with test_
        self.assertEqual(2 + 2, 4)

suite = unittest.TestLoader().loadTestsFromTestCase(MathTests)
print(suite.countTestCases())`,
      hint: 'unittest runner only discovers test methods that begin with the test_ prefix.',
      reason: 'Methods inside unittest.TestCase must start with test_ (e.g. test_addition) to be recognized and run by the test loader.',
      remember: 'Mutable default parameters ([] ya {}) kabhi mat use karo, hamesha default=None rakho. unittest me test functions hamesha "test_" se start hone chahiye.',
    },
    task: {
      id: 'adv-typed-pipeline',
      chapter: 16,
      title: 'Typed & Validated Data Sanitization Pipeline',
      difficulty: 'Hard',
      prompt: 'Implement a typed data sanitization module for customer orders:\n1. sanitize_customer_record(raw: dict) -> dict:\n   - Validates that "name" is a non-empty string; strips whitespace and formats with .title().\n   - Validates that "email" contains "@" and a dot in the domain portion; strips and lowercases it.\n   - Validates that "age" is convertible to int >= 18 and <= 120.\n   - If any required field is missing or invalid, raises ValueError with a descriptive message.\n   - Returns clean dict: {"name": str, "email": str, "age": int}.\n2. batch_process_records(records: list[dict]) -> tuple[list[dict], list[dict]]:\n   - Takes a list of raw dicts.\n   - Returns a tuple of (valid_records, failed_records), where failed_records contains {"record": raw, "error": str(err)}.\n3. Include a full unittest.TestCase class TestSanitization verifying valid inputs, missing fields, and invalid boundaries.',
      starter: `import unittest

def sanitize_customer_record(raw: dict) -> dict:
    # Validate and clean customer record
    pass

def batch_process_records(records: list[dict]) -> tuple[list[dict], list[dict]]:
    # Process batch and return (valid_list, failed_list)
    pass

class TestSanitization(unittest.TestCase):
    # Test suite for sanitization
    pass`,
      solution: `import unittest

def sanitize_customer_record(raw: dict) -> dict:
    if not isinstance(raw, dict):
        raise ValueError("Record must be a dictionary")

    name = raw.get("name")
    if not isinstance(name, str) or not name.strip():
        raise ValueError("Name must be a non-empty string")

    email = raw.get("email")
    if not isinstance(email, str) or "@" not in email:
        raise ValueError("Invalid email format")
    user, _, domain = email.partition("@")
    if not user.strip() or "." not in domain or domain.startswith("."):
        raise ValueError("Invalid email domain")

    age_raw = raw.get("age")
    try:
        age = int(age_raw)
    except (TypeError, ValueError):
        raise ValueError("Age must be an integer")
    if age < 18 or age > 120:
        raise ValueError("Age must be between 18 and 120")

    return {
        "name": name.strip().title(),
        "email": email.strip().lower(),
        "age": age,
    }

def batch_process_records(records: list[dict]) -> tuple[list[dict], list[dict]]:
    valid = []
    failed = []
    for r in records:
        try:
            clean = sanitize_customer_record(r)
            valid.append(clean)
        except ValueError as err:
            failed.append({"record": r, "error": str(err)})
    return valid, failed

class TestSanitization(unittest.TestCase):
    def test_valid_record(self):
        raw = {"name": "  alice smith ", "email": "ALICE@EXAMPLE.COM ", "age": "25"}
        clean = sanitize_customer_record(raw)
        self.assertEqual(clean["name"], "Alice Smith")
        self.assertEqual(clean["email"], "alice@example.com")
        self.assertEqual(clean["age"], 25)

    def test_invalid_underage(self):
        with self.assertRaises(ValueError):
            sanitize_customer_record({"name": "Bob", "email": "bob@test.com", "age": 16})

    def test_missing_field(self):
        with self.assertRaises(ValueError):
            sanitize_customer_record({"name": "Bob", "age": 30})

    def test_batch_processing(self):
        data = [
            {"name": "Valid User", "email": "v@test.org", "age": 20},
            {"name": "", "email": "bad@test.org", "age": 20},
        ]
        valid, failed = batch_process_records(data)
        self.assertEqual(len(valid), 1)
        self.assertEqual(len(failed), 1)`,
      expected: 'Valid: 1, Failed: 1',
      hints: [
        'In sanitize_customer_record, validate name.strip(), email partition with "@", and try int(age).',
        'In batch_process_records, wrap sanitize_customer_record(r) in a try/except ValueError block.',
        'In TestSanitization, write test methods using self.assertEqual and with self.assertRaises(ValueError):.',
      ],
      explanation: 'Decoupling record sanitization from batch error partitioning allows high-throughput data processing where bad rows are logged without crashing the entire batch.',
      tests: `
clean = sanitize_customer_record({"name": "rohan sharma", "email": "Rohan@Example.com", "age": 28})
assert clean["name"] == "Rohan Sharma"
assert clean["email"] == "rohan@example.com"
assert clean["age"] == 28

try:
    sanitize_customer_record({"name": "Bob", "email": "bad_email", "age": 25})
    assert False, "Should raise ValueError on bad email"
except ValueError:
    pass

try:
    sanitize_customer_record({"name": "Bob", "email": "b@test.com", "age": 15})
    assert False, "Should raise ValueError on age < 18"
except ValueError:
    pass

records = [
    {"name": "Alice", "email": "a@test.com", "age": 22},
    {"name": "", "email": "b@test.com", "age": 30},
    {"name": "Charlie", "email": "c@test.com", "age": 45},
]
valid, failed = batch_process_records(records)
assert len(valid) == 2
assert len(failed) == 1
assert failed[0]["record"]["name"] == ""

suite = unittest.TestLoader().loadTestsFromTestCase(TestSanitization)
runner = unittest.TextTestRunner(verbosity=0)
res = runner.run(suite)
assert res.wasSuccessful()
assert res.testsRun >= 4

print("All TestSanitization and pipeline tests passed!")`,
    },
    quiz: [
      {
        prompt: 'Why should you avoid using a mutable default argument such as def add(item, items=[]):?',
        options: [
          'The default list is created once at function definition time and shared across all future calls',
          'Python raises a SyntaxError on mutable default arguments',
          'It prevents the function from returning values',
          'Mutable defaults consume infinite memory'
        ],
        answer: 0,
        explanation: 'Default arguments are evaluated once at function definition time. A mutable list or dict retains mutations across successive calls, introducing subtle shared-state bugs.',
      },
      {
        prompt: 'What must every test method inside a unittest.TestCase subclass begin with to be automatically executed by the test runner?',
        options: [
          'test_',
          'assert_',
          'run_',
          'check_'
        ],
        answer: 0,
        explanation: 'unittest uses convention-over-configuration: only methods whose names start with test_ are discovered and run as tests.',
      },
      {
        prompt: 'What is the primary benefit of Python type hints?',
        options: [
          'They serve as explicit self-documenting contracts and enable static analyzers to catch bugs before runtime',
          'They force Python to compile into C++ binaries for 10x speed',
          'They make variables immutable at runtime',
          'They automatically generate database schemas'
        ],
        answer: 0,
        explanation: 'Type hints do not change runtime behavior, but they provide critical documentation and allow IDEs and tools like mypy to catch type mismatches before execution.',
      },
    ],
    cheatSheet: [
      'Type annotations: def func(a: int, b: str = "") -> list[int]: pass',
      'Optional types: val: str | None = None (or Optional[str])',
      'unittest: class MyTest(unittest.TestCase): def test_case(self): self.assertEqual(a, b)',
      'Asserting exceptions: with self.assertRaises(ValueError): risky_call()',
      'Default sentinel: Use arg=None and check if arg is None: arg = [] inside body.',
      'Single Responsibility: Each function does exactly one cohesive task.',
    ],
    hinglishTip: 'Default parameter me kabhi empty list [] mat do, hamesha None do aur function ke andar "if arg is None: arg = []" karo. Aur unittest functions hamesha test_ se shuru karo!',
  },
];
