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
    this.countdownEl = document.getElementById('countdown');
    this.previousSolutions = new Set();
    this.rejectedSolutions = [];
    this.acceptedSolutions = [];
    this.solutionTime = 5 * 1000; // 30 seconds
  }

  setBodyClass(cls) {
    const list = document.body.classList;
    list.remove(...list);
    list.add(cls);
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
    this.setBodyClass('init');
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
    this.setBodyClass('problem-is-set');
    this.proposeSolution();
    addToEach(
      this.solutionControls.getElementsByClassName('no'),
      'click', () => this.rejectSolution());
    addToEach(
      this.solutionControls.getElementsByClassName('ok'),
      'click', () => this.acceptSolution());
    this.countdownStart = new Date();
    this.updateCountdown();
    this.solutionCountdownInterval = setInterval(() => this.updateCountdown(), 1000);
    setTimeout(() => this.lockSolution(), this.solutionTime);
  }

  rejectSolution() {
    this.rejectedSolutions.push(this.solution);
    this.proposeSolution();
  }

  acceptSolution() {
    this.acceptedSolutions.push(this.solution);
    this.proposeSolution();
  }

  updateCountdown() {
    const delta = new Date() - this.countdownStart;
    const timeLeft = Math.max(0, this.solutionTime - delta);
    this.countdownEl.innerText = Math.ceil(timeLeft / 1000);
  }

  lockSolution() {
    clearInterval(this.solutionCountdownInterval);
    console.log('TODO: actually lock solution');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new Page().init();
});