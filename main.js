import {problems} from './data/problems.js';
import {pickRandom} from './util.js';

class Page {
  constructor() {
    this.problemDiv = document.getElementById('problem');
    this.problemControls = document.getElementById('problem-controls');
  }

  setProblem() {
    this.problemDiv.innerText = pickRandom(problems);
  }

  init() {
    this.setProblem();
    const spinners = this.problemControls.getElementsByClassName('spin');
    for (const spinner of spinners) {
      spinner.addEventListener('click', () => this.setProblem());
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new Page().init();
});