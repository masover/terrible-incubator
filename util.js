// "util" files are considered a code smell
// however, this project is self-identified as "Terrible"
// so what were you expecting?

// Surely this is already in JS somewhere?
export function pickRandom(list) {
  return list[Math.floor(Math.random()*list.length)];
}