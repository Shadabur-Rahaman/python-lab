import type {Question} from '../types';

type Check = [prompt:string, correct:string, wrong:[string,string], explanation:string];
const checks: Record<string, Check> = {
  assignment:['What does age = age + 1 do?','Reads age, adds one and assigns the result',['Compares age with age plus one','Prints the value of age'],'Python evaluates the right side before assigning.'],
  layout:['Why can the example break the calculation across two lines?','The expression is inside parentheses',['Comments join lines','Indentation always joins lines'],'Open parentheses allow implicit line joining.'],
  numbers:['What decimal integer does 0x10 represent?','16',['10','2'],'The 0x prefix selects hexadecimal, so 10 represents sixteen.'],
  strings:['What does "Python"[1:4] produce?','yth',['ytho','Pyt'],'The slice starts at index 1 and stops before index 4.'],
  arithmetic:['What is -7 // 2?','-4',['-3','-3.5'],'Floor division rounds the quotient toward negative infinity.'],
  logic:['Why can a == b be true while a is b is false?','Two separate objects can contain equal values',['is compares only the length','== and is always agree'],'Equality compares values and identity compares objects.'],
  'bits-and-walrus':['What does size := len(items) produce?','The length, which it also binds to size',['Only True or False','A second list'],'An assignment expression binds and returns the value.'],
  conditions:['If both if and elif conditions would be true, which branch runs?','The if branch',['Both branches','The else branch'],'An if chain runs only the first matching branch.'],
  loops:['When does a for loop’s else run?','When the loop exhausts without break',['After each iteration','Only when break runs'],'Normal exhaustion triggers else, even if there were no items.'],
  match:['What does a case guard do?','Tests a condition after its pattern matches',['Runs before the subject is evaluated','Runs every later matching case'],'The guard must also pass for the case body to run.'],
  displays:['Which expression creates a one-item tuple?','(1,)',['(1)','[1]'],'The trailing comma makes it a tuple.'],
  comprehensions:['What does the if clause do in a comprehension?','Filters which inputs contribute results',['Stops at the first false result','Sorts the input'],'A false filter skips that input and continues iteration.'],
  parameters:['How do you supply a parameter before /?','By position',['By keyword only','By putting it in a dictionary'],'The slash marks the end of positional-only parameters.'],
  scope:['What does nonlocal let a nested function do?','Rebind an existing enclosing function name',['Declare a new module constant','Turn a local name into a parameter'],'nonlocal selects an existing binding in an enclosing function scope.'],
  decorators:['When is the decorator applied?','When the function definition runs',['After the last call','Only when its result is printed'],'The decorator receives the function at definition time.'],
  classes:['What does super() follow?','The method resolution order',['The order of instance creation','The alphabetical order of method names'],'super delegates to the next class in the resolution order.'],
  'class-tools':['What does item.label do when label is a property?','Calls the getter through attribute access',['Returns the unbound getter function','Requires item.label()'],'A property getter runs during attribute access.'],
  handling:['What does except* ValueError handle in a group?','The subgroup of matching errors',['Only the first error','Every error regardless of type'],'except* separates matching leaves from the rest of the group.'],
  with:['In which order do two contexts exit?','Second, then first',['First, then second','They exit only if no exception occurs'],'Multiple contexts nest, so the last entered exits first.'],
  imports:['Why guard a main() call with __name__?','To run the entry point when executed directly',['To make imports relative','To disable imports from other modules'],'The module name differs when the file is imported normally.'],
  generators:['What does calling a generator function immediately return?','A generator object',['The first yielded value','A list of every result'],'The body begins when iteration asks for a value.'],
  async:['What should replace top-level await main() in a regular .py script?','asyncio.run(main())',['main() alone','return await main()'],'The script needs to run the coroutine in an event loop.'],
  'object-protocols':['Where does the example place the descriptor?','On the class',['In the instance dictionary','In the module namespace only'],'Class attribute lookup invokes the descriptor protocol.'],
  typing:['Which minimum Python version supports type Pair[T] = tuple[T, T]?','3.12',['3.10','3.11'],'Python 3.12 introduced this type alias and type parameter syntax.'],
  'input-output':['What does input() return when you enter 7?','The string "7"',['The integer 7','A boolean'],'input reads text. Convert it explicitly for numeric calculations.'],
  constructors:['What is bool("False")?','True',['False','It raises ValueError'],'A nonempty string is truthy regardless of its spelling.'],
  'sequence-tools':['What happens if zip(a, b, strict=True) encounters unequal lengths?','Iteration raises ValueError',['The shorter input is padded','It silently stops at the shorter input'],'The strict flag makes length mismatch an error.'],
  summaries:['Why is all([]) true?','There is no item that fails the test',['There is one true item in the list','Empty lists are truthy'],'all returns true when it finds no false item.'],
  open:['Which mode truncates an existing file?','"w"',['"r"','"a"'],'Write mode starts the file over. Append mode preserves its earlier contents.'],
  data:['What type is the count column when read from the example CSV?','String',['Integer','Float'],'The CSV reader preserves cell text unless you explicitly convert it.'],
};

export function syntaxCheck(id: string): Question {
  const [prompt,correct,wrong,explanation] = checks[id];
  const options: string[] = [...wrong];
  const answer = id.length % 3;
  options.splice(answer, 0, correct);
  return {prompt,options,answer,explanation};
}
