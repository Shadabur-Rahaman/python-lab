export type Example = {title:string;code:string;output:string;why:string;input?:string};
export type Question = {prompt:string;options:string[];answer:number;explanation:string};
export type Task = {id:string;chapter:number;title:string;difficulty:string;prompt:string;starter:string;solution:string;expected:string;hints:string[];explanation:string;tests?:string;input?:string};
export type Chapter = {id:number;title:string;subtitle:string;story:string;objectives:string[];concepts:[string,string][];visual:string[];examples:Example[];mistake:{code:string;fix:string;why:string};application:string;tasks:Task[];quiz:Question[]};
export type Project = {id:string;title:string;chapters:number[];use:string;requirements:string[];steps:string[];starter:string;solution:string;input:string;output:string;tests:string[];mistake:string;improvements:string[]};
