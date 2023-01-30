import {problems} from './data/problems.js';
import {pickRandom} from './util.js';
import {generateSolution} from './solutions.js';

function addToEach(elements, event, listener) {
  for (const el of elements) {
    el.addEventListener(event, listener);
  }
}

class Page {
  constructor() {
    this.problemEl = document.getElementById('problem');
    this.problemControls = document.getElementById('problem-controls');
    this.solutionEl = document.getElementById('solution');
    this.previousSolutions = new Set();
  }

  setProblem() {
    this.problem = pickRandom(problems)
    this.problemEl.innerText = this.problem;
  }

  init() {
    this.setProblem();
    addToEach(
      this.problemControls.getElementsByClassName('spin'),
      'click', () => this.setProblem());
    addToEach(
      this.problemControls.getElementsByClassName('ok'),
      'click', () => this.acceptProblem());
  }

  proposeSolution() {
    this.solution = generateSolution();
    while (this.previousSolutions.has(solution)) {
      this.solution = generateSolution();
    }
    this.previousSolutions.add(this.solution);
    this.solutionEl.innerText = this.solution;
  }

  acceptProblem() {
    document.body.classList.add('problem-is-set');
    this.proposeSolution();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new Page().init();
});