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
    this.solutionControls = document.getElementById('solution-controls');
    this.previousSolutions = new Set();
    this.rejectedSolutions = [];
    this.acceptedSolutions = [];
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
    addToEach(
      this.solutionControls.getElementsByClassName('no'),
      'click', () => this.rejectSolution());
    addToEach(
      this.solutionControls.getElementsByClassName('ok'),
      'click', () => this.acceptSolution());
  }

  rejectSolution() {
    this.rejectedSolutions.push(this.solution);
    this.proposeSolution();
  }

  acceptSolution() {
    this.acceptedSolutions.push(this.solution);
    this.proposeSolution();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new Page().init();
});