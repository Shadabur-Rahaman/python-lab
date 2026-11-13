import {extraTerms} from './glossary-extra';
import {glossary as original} from './curriculum';

type Translation = [string, string, string, string, number, string];
const translations: Record<string, Translation> = {
  Argument:['Argument','Function call karte waqt diya gaya value.','add(2, 3) mein 2 aur 3 arguments hain.','function argument supplied value',11,'parameters'],
  Assignment:['Assignment','Kisi naam ko value se jodna.','score = 10 mein Python score naam ko 10 se jodta hai.','assign bind equal =',2,'assignment'],
  Boolean:['Boolean','True ya False mein se ek value.','5 > 2 ka result True hai.','truthiness true false',3,'logic'],
  Bug:['Bug','Code ki galti jo galat result ya behavior deti hai.','Galat range se loop ka aakhri item chhoot sakta hai.','mistake defect error',1,'handling'],
  Dictionary:['Dictionary','Keys se values jodne wala collection.','Tea ki keemat tea naam ki key se mil sakti hai.','dict mapping key value',10,'displays'],
  Expression:['Expression','Code ka hissa jo ek value deta hai.','2 + 3 ek expression hai aur iska result 5 hai.','evaluate value calculation',1,'layout'],
  Function:['Function','Dobara use karne ke liye code ka block.','def se function banao aur naam ke saath parentheses laga kar call karo.','def call callable',11,'parameters'],
  Immutable:['Immutable','Aisa object jise wahi par badal nahi sakte.','String badalne ke liye nayi string banao.','mutation change immutable',8,'strings'],
  Indentation:['Indentation','Line ke shuru ki spaces jo code block batati hain.','if ke block ki lines ek level par indent karo.','spaces tabs block suite',6,'layout'],
  Identifier:['Identifier','Python code mein use hone wala naam.','student_name valid hai, lekin naam digit se shuru nahi ho sakta.','name variable naming rules',2,'assignment'],
  Index:['Index','Sequence mein item ki position.','Pehla index 0 hai. -1 aakhri item ko dekhta hai.','position indexing zero',8,'strings'],
  Interpreter:['Interpreter','Software jo Python code padhta aur chalata hai.','Python Lab browser mein Pyodide ke through code chalata hai.','python runtime pyodide',0,'layout'],
  Iteration:['Iteration','Loop ka ek chakkar.','for loop aam taur par har item ke liye ek chakkar chalata hai.','loop repeat iteration',7,'loops'],
  List:['List','Ordered collection jise badal sakte ho.','append se list ke end mein item jodo.','array ordered mutable',9,'displays'],
  Keyword:['Keyword','Python ka reserved word.','if aur class ko variable name ki tarah use nahi kar sakte.','reserved word',2,'assignment'],
  'Local scope':['Local scope','Function call ke andar available local names.','Andar ka naya naam bahar ke usi naam ko apne aap nahi badalta.','namespace local binding',11,'scope'],
  Object:['Object','Python ki ek entity jiski identity, type aur value hoti hai.','Do alag lists ke items barabar ho sakte hain.','identity instance type',15,'classes'],
  Parameter:['Parameter','Function definition mein input lene wala naam.','def add(a, b) mein a aur b parameters hain.','signature argument def',11,'parameters'],
  Return:['Return','Function ke caller ko result wapas bhejna.','return result deta hai, print usse screen par dikhata hai.','result return value',11,'parameters'],
  Set:['Set','Unique hashable items ka collection.','Set mein duplicate values ek hi baar rehti hain.','unique distinct set',10,'displays'],
  'Source code':['Source code','Insaan ke padhne aur likhne layak program instructions.','Python ki .py file mein code aur comments ho sakte hain.','source program file',0,'layout'],
  Statement:['Statement','Python ko diya gaya ek poora instruction.','age = 20 ek assignment statement hai.','instruction assignment',1,'layout'],
  String:['String','Text rakhne wali value.','"tea" mein teen characters hain. Quotes text ki boundary dikhate hain.','text str unicode',8,'strings'],
  Syntax:['Syntax','Python code likhne ke niyam.','if ke header ke end mein colon chahiye.','grammar syntax error',1,'layout'],
  Tuple:['Tuple','Ordered collection jiske items dobara assign nahi kar sakte.','Ek item ke tuple ke liye (5,) likho.','immutable sequence',9,'displays'],
  Variable:['Variable','Kisi value ya object ko refer karne wala naam.','age = 20 mein age naam 20 ko refer karta hai.','name value binding',2,'assignment'],
};


const detail: Record<string, [string,string,string]> = {
  assignment:['Python computes the expression on the right before binding the target on the left.','score = 10','Assignment does not test equality.'],
  variable:['A name can refer to a different object after reassignment. Two names may refer to the same object.','age = 20','A variable name is not quoted when you want to read its value.'],
  identifier:['Variable and function names are identifiers. Python accepts Unicode identifiers as well as familiar English-letter names.','student_name','A spelling can have the shape of an identifier and still be reserved as a keyword.'],
  iteration:['Each iteration visits an item or repeats the loop body after a condition test.','for item in ["tea", "milk"]:', 'One loop may perform zero iterations.'],
  argument:['An argument is the caller’s input. A parameter is the name that receives that input in the function.','add(2, 3)','An argument need not be a literal. It can be any expression.'],
  indentation:['Python uses the indentation level to decide which statements belong to a block.','if ready:\n    print("go")','Indentation changes structure, not just appearance.'],
};

const definitions = original.map(([name, short]) => {
  const [display, hindi, explanation, aliases, lesson, syntax] = translations[name];
  const id = name.toLowerCase().replaceAll(' ', '-');
  const [english, example, misconception] = detail[id] ?? [short, '', ''];
  return {id,name,display,short,hindi,explanation,english,example,misconception,aliases,lesson,syntax};
});
export const terms = [
  ...definitions,
  ...extraTerms,
  {id:'iterable',name:'Iterable',display:'Iterable',short:'An object from which Python can obtain an iterator.',
    hindi:'Aisa object jisse iterator mil sakta hai.',explanation:'List aur string dono iterable hain.',
    english:'An iterable can supply an iterator through iter(). The iterator is what advances through the items.',
    example:'iter(["tea", "milk"])',misconception:'An iterable is not always a collection stored in memory.',aliases:'iter next generator loop',lesson:7,syntax:'generators'},
  {id:'loop-body',name:'Loop body',display:'Loop body',short:'The statements inside a loop.',
    hindi:'Loop ke andar chalne wali statements.',explanation:'for ke neeche indented lines loop body hoti hain.',
    english:'The indented suite after the loop header runs on each iteration until a control statement redirects execution.',
    example:'for item in ["tea"]:\n    print(item)',misconception:'A statement after dedenting is outside the loop.',aliases:'suite block statements',lesson:7,syntax:'loops'},
].sort((a,b) => a.name.localeCompare(b.name));

export type Term = (typeof terms)[number];
export const glossaryLink = (id: string) => `#/glossary/${id}`;
export function findTerms(query: string) {
  const text = query.trim().toLowerCase();
  return terms.filter(term => [term.name,term.display,term.short,term.hindi,term.explanation,term.aliases].join(' ').toLowerCase().includes(text));
}
