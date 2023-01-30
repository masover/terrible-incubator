import {problems} from './data/problems.js';
import {pickRandom} from './util.js';

class Page {
  constructor() {
    this.problemDiv = document.getElementById('problem');
  }

  setProblem() {
    this.problemDiv.innerText = pickRandom(problems);
  }

  init() {
    this.setProblem();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new Page().init();
});