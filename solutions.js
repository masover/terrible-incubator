import {groups} from './data/groups.js';
import {nouns} from './data/nouns.js';

// Generated by ChatGPT
// Modified to conjugate function/functions/functioning
const templates = [
  "A {product_type} for {group} that {functions}",
  "A {product_type} to {function} for {group}",
  "A {functioning} {product_type} for {group}",
  "A {product_type} to {function} with {group}",
  "A {group} {product_type} that {functions}",
  "A {product_type} for {group} to {function}",
  // "A {group} {function} {product_type}",  unsure how this _can_ work
  "A {product_type} that {functions} for {group}",
  // "{function} {group} with a new {product_type}",  manually rejected, doesn't make sense
  "A {group} {product_type} for {functioning}",

  // Added by a human (after I realized the 'group's aren't always as fun)
  "A {product_type} to {function}",
  "A {product_type} for {functioning}",
  "A {functioning} {product_type}",
  // Similarly, sometimes "A service for bees" is fun on its own:
  "A {product_type} for {group}",
];

// Generated by ChatGPT
const functionTemplates = [
  "{verb} {noun}",
  "{verb} and {verb} {noun}",
  "{verb} {noun} for {group}",
  "{verb} {noun} and {verb} {noun}",
  "{verb} {noun} of {noun}",
];

// Generated by ChatGPT
const product_types = [
  "app",
  "service",
  "device",
  "platform",
  "program",
  "system",
  "tool",
  "gadget",
  "invention",
  // "creation",  Doesn't actually work well
  // Added by human:
  "social network"
];

// Generated by ChatGPT
// then removed 's' by hand
// (we'll add it back later)
const verbList = [
  "track",
  "monitor",
  "provide",
  "deliver",
  "offer",
  "facilitate",
  "support",
  "manage",
  "enhance",
  "optimize",
];

// This is a bit simple, but we know these conjugations work
// with the above (very short) list of words.
const verbsList = [];
for (const verb of verbList) {
  verbsList.push(`${verb}s`);
}

const verbingList = [];
const endWithE = /e?$/;
for (const verb of verbList) {
  verbingList.push(verb.replace(endWithE, 'ing'));
}
console.log(verbingList);

const simpleReplacements = {
  verb: verbList,
  verbs: verbsList,
  verbing: verbingList,
  noun: nouns,
  group: groups,
  product_type: product_types,
};

// Surely this is already in JS somewhere?
function pickRandom(list) {
  return list[Math.floor(Math.random()*list.length)];
}

const isAn = /^A ([aeiou])/
export function generateSolution() {
  // Performance here could be improved
  // ...but this will be invoked on a device in response to user action
  // ...in other words, I can't think of a practical reason to optimize this
  let out = pickRandom(templates);
  // First replace any functions
  out = out.replaceAll('{function}', () => pickRandom(functionTemplates));
  out = out.replaceAll('{functions}', () => verbs(pickRandom(functionTemplates)));
  out = out.replaceAll('{functioning}', () => verbing(pickRandom(functionTemplates)));
  for (const [key, val] of Object.entries(simpleReplacements)) {
    out = out.replaceAll(`{${key}}`, () => pickRandom(val));
  }
  // Finally, a/an:
  out = out.replace(isAn, 'An $1');
  return out;
}

function verbs(template) {
  return template.replaceAll('{verb}', '{verbs}');
}
function verbing(template) {
  return template.replaceAll('{verb}', '{verbing}');
}