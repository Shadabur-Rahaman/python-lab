import {core} from './core';
import {professional} from './professional';
import {apis} from './apis';
export {categories, type Topic, type Category} from './schema';
export const syntaxTopics = [...core, ...professional, ...apis];
