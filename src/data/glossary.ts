import {extraTerms} from './glossary-extra';
import {glossary as original} from './curriculum';

type Translation = [string, string, string, string, number, string];
const translations: Record<string, Translation> = {
  Argument:['आर्ग्युमेंट','फ़ंक्शन को कॉल करते समय दिया गया मान।','add(2, 3) में 2 और 3 arguments हैं। Parameters उन मानों को लेने वाले नाम हैं।','function argument supplied value',11,'parameters'],
  Assignment:['असाइनमेंट','किसी नाम को एक मान से जोड़ना।','score = 10 में Python पहले 10 को पढ़ता है, फिर score नाम को उससे जोड़ता है।','assign bind equal =',2,'assignment'],
  Boolean:['बूलियन','True या False में से एक मान।','5 > 2 से True मिलता है। खाली list किसी condition में false मानी जाती है, लेकिन वह False object नहीं है।','truthiness true false',3,'logic'],
  Bug:['बग','प्रोग्राम में ऐसी गलती जिससे व्यवहार गलत हो जाता है।','गलत सीमा के कारण अंतिम item छूट सकता है, भले ही Python कोई error न दिखाए।','mistake defect error',1,'handling'],
  Dictionary:['डिक्शनरी','Keys को values से जोड़ने वाला संग्रह।','{"tea": 3} में tea key है और 3 उसकी value है। Key से संबंधित value खोज सकते हैं।','dict mapping key value',10,'displays'],
  Expression:['एक्सप्रेशन','Code का हिस्सा जो एक मान देता है।','2 + 3 का परिणाम 5 है। print(2 + 3) पहले expression का परिणाम निकालता है।','evaluate value calculation',1,'layout'],
  Function:['फ़ंक्शन','काम करने वाला दोबारा इस्तेमाल किया जा सकने वाला code।','def से फ़ंक्शन बना सकते हैं। नाम के बाद parentheses लगाकर उसे कॉल करें।','def call callable',11,'parameters'],
  Immutable:['अपरिवर्तनीय','ऐसा object जिसकी अपनी सामग्री बदली नहीं जा सकती।','String के अक्षर सीधे नहीं बदल सकते। नया string बनाकर उसी नाम को फिर से assign कर सकते हैं।','mutation change immutable',8,'strings'],
  Indentation:['इंडेंटेशन','Line के शुरू की जगह जो block बताती है।','if के अंदर की lines को समान रूप से indent करें। अगली कम indented line block से बाहर होती है।','spaces tabs block suite',6,'layout'],
  Identifier:['आइडेंटिफ़ायर','Python code में इस्तेमाल होने वाला नाम।','student_name एक identifier है। अंक शुरू में नहीं आ सकता और if जैसे reserved शब्द नाम नहीं बन सकते।','name variable naming rules पहचान',2,'assignment'],
  Index:['इंडेक्स','क्रम में किसी item की जगह।','पहली जगह 0 है। एक nonempty sequence में -1 अंतिम item की जगह बताता है।','position indexing zero',8,'strings'],
  Interpreter:['इंटरप्रेटर','Python निर्देश चलाने वाला सॉफ़्टवेयर।','Python code पढ़ता है और उसका व्यवहार लागू करता है। Lab का browser runner Pyodide के जरिए Python चलाता है।','python runtime pyodide',0,'layout'],
  Iteration:['इटरेशन','Loop की एक बार की चाल।','for में हर item के लिए loop body एक बार चलती है, जब तक break जैसे निर्देश उसे रोक न दें।','loop repeat iteration',7,'loops'],
  List:['लिस्ट','बदला जा सकने वाला क्रमबद्ध संग्रह।','[10, 20] में दो items हैं। append से तीसरा item जोड़ सकते हैं।','array ordered mutable',9,'displays'],
  Keyword:['कीवर्ड','Python का आरक्षित शब्द।','if और class के निश्चित काम हैं, इसलिए इन्हें variable name नहीं बना सकते। print एक built-in नाम है।','reserved word',2,'assignment'],
  'Local scope':['लोकल स्कोप','किसी फ़ंक्शन कॉल के अंदर उपलब्ध स्थानीय नाम।','फ़ंक्शन में बनाया गया स्थानीय नाम बाहर उसी नाम वाले variable को अपने आप नहीं बदलता।','namespace local binding',11,'scope'],
  Object:['ऑब्जेक्ट','Python में identity, type और value वाला डेटा।','दो अलग lists में समान items हो सकते हैं। == उनकी values की तुलना करता है और is उनकी identity देखता है।','identity instance type',15,'classes'],
  Parameter:['पैरामीटर','फ़ंक्शन की परिभाषा में input लेने वाला नाम।','def add(a, b) में a और b parameters हैं। add(2, 3) में दिए गए मान arguments हैं।','signature argument def',11,'parameters'],
  Return:['रिटर्न','फ़ंक्शन से कॉल करने वाले code को परिणाम देना।','return total से फ़ंक्शन रुकता है और total का मान मिलता है। print सिर्फ़ उसे दिखाता है।','result return value',11,'parameters'],
  Set:['सेट','अलग-अलग hashable items का संग्रह।','{1, 1, 2} में सिर्फ़ 1 और 2 रहते हैं। खाली set के लिए set() लिखें।','unique distinct set',10,'displays'],
  'Source code':['सोर्स कोड','इंसान के पढ़ने और लिखने वाले प्रोग्राम निर्देश।','Python की .py file में functions, comments और अन्य निर्देश लिखे जा सकते हैं।','source program file',0,'layout'],
  Statement:['स्टेटमेंट','Python को दिया गया एक पूरा निर्देश।','age = 20 एक assignment statement है। if जैसा compound statement एक block भी रखता है।','instruction assignment',1,'layout'],
  String:['स्ट्रिंग','Text रखने वाला Python मान।','"tea" तीन अक्षरों की string है। Quotes उसकी सीमा बताते हैं और मान का हिस्सा नहीं हैं।','text str unicode',8,'strings'],
  Syntax:['सिंटैक्स','Python code लिखने की बनावट के नियम।','if के header के अंत में colon चाहिए। गलत बनावट पर SyntaxError आ सकता है।','grammar syntax error',1,'layout'],
  Tuple:['टपल','एक क्रम जिसमें items को सीधे बदला नहीं जा सकता।','(5,) में एक item है। (5) सिर्फ़ 5 है। Tuple के अंदर मौजूद list अलग से mutable हो सकती है।','immutable sequence',9,'displays'],
  Variable:['वेरिएबल','Python में किसी मान को refer करने वाला नाम।','age = 20 में age नाम 20 को refer करता है। age = 21 उसी नाम को नए मान से जोड़ता है।','name value binding चर',2,'assignment'],
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
  {id:'iterable',name:'Iterable',display:'इटरेबल',short:'An object from which Python can obtain an iterator.',
    hindi:'ऐसा object जिससे iterator मिल सकता है।',explanation:'List और string iterable हैं। for इनके items एक-एक करके ले सकता है।',
    english:'An iterable can supply an iterator through iter(). The iterator is what advances through the items.',
    example:'iter(["tea", "milk"])',misconception:'An iterable is not always a collection stored in memory.',aliases:'iter next generator loop',lesson:7,syntax:'generators'},
  {id:'loop-body',name:'Loop body',display:'लूप बॉडी',short:'The statements inside a loop.',
    hindi:'Loop के अंदर के निर्देश।',explanation:'for के बाद indented lines loop body हैं। हर iteration में ये निर्देश फिर चलते हैं।',
    english:'The indented suite after the loop header runs on each iteration until a control statement redirects execution.',
    example:'for item in ["tea"]:\n    print(item)',misconception:'A statement after dedenting is outside the loop.',aliases:'suite block statements',lesson:7,syntax:'loops'},
].sort((a,b) => a.name.localeCompare(b.name));

export type Term = (typeof terms)[number];
export const glossaryLink = (id: string) => `#/glossary/${id}`;
export function findTerms(query: string) {
  const text = query.trim().toLowerCase();
  return terms.filter(term => [term.name,term.display,term.short,term.hindi,term.explanation,term.aliases].join(' ').toLowerCase().includes(text));
}
