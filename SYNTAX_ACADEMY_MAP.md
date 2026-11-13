# Syntax Academy map

Open `#/syntax` to search or filter 30 reference topics. Each topic has a stable `#/syntax/<category>/<id>` route, symbol explanations, runnable code, output and trace, a common mistake, a runnable correction, two practice prompts and a knowledge check. The linked chapter provides suggested preparation.

| Category | Topics |
| --- | --- |
| Fundamentals | Assignment and identifiers. Statements and layout. |
| Types and literals | Numbers, booleans and None. Strings, bytes and slicing. |
| Operators | Arithmetic. Comparisons and truthiness. Bits and assignment expressions. |
| Control flow | Conditions. Loops. Pattern matching. |
| Collections | Displays and unpacking. Comprehensions. |
| Functions | Parameter kinds. Scope and recursion. Decorators and annotations. |
| Object-oriented syntax | Classes and inheritance. Properties, special methods and dataclasses. |
| Exceptions | Handling, chaining and exception groups. Context managers. |
| Modules | Imports, packages and entry points. |
| Iteration | Iterator and generator protocols. Coroutines and async contexts. |
| Advanced | Descriptors and metaclasses. Generics and protocols. |
| Built-ins | Input and output. Constructors. Sequence tools. Summaries. File modes. |
| Standard library | CSV, JSON, dates and paths. |

The minimum version on a topic applies to its example. Browser examples target Python 3.12 in Pyodide 0.27.7. The async example uses browser top-level await and shows the script equivalent. File examples use the browser’s virtual filesystem.

To add a topic, register it in the category module under `src/data/syntax`, add its question to `checks.ts`, and run the Syntax Academy browser spec. Use the [Python Language Reference](https://docs.python.org/3.12/reference/) for syntax and the [Python Standard Library](https://docs.python.org/3.12/library/) for APIs.
