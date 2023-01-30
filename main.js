import {problems} from './data/problems.js';
import {pickRandom} from './util.js';
import {generateSolution} from './solutions.js';

function addToEach(elements, event, listener) {
  for (const el of elements) {
    el.addEventListener(event, listener);
  }
}

function li(text) {
  const el = document.createElement('li');
  el.innerText = text;
  return el;
}

class Page {
  constructor() {
    this.problemEl = document.getElementById('problem');
    this.problemControls = document.getElementById('problem-controls');
    this.spinnerSolutionEl = document.querySelector('#solution-spinner .solution');
    this.lockedSolutionEl = document.querySelector('#solution-locked .solution');
    this.lockedSolutionContainer = document.getElementById('solution-locked');
    this.solutionControls = document.getElementById('solution-controls');
    this.countdownEl = document.getElementById('countdown');
    this.rejectedUl = document.querySelector('#rejected-solutions ul');
    this.acceptedUl = document.querySelector('#accepted-solutions ul');
    this.nameForm = document.getElementById('name-input-form');
    this.nameInput = document.getElementById('name-input');
    this.solutionName = document.getElementById('solution-name');
    this.solutionDescription = document.getElementById('solution-description');
    this.previousSolutions = new Set();
    this.rejectedSolutions = [];
    this.acceptedSolutions = [];
    this.solutionTime = 5 * 1000; // 30 seconds
  }

  setClass(cls, el = document.body) {
    const list = el.classList;
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
    this.setClass('init');
  }

  proposeSolution() {
    this.proposedSolution = generateSolution();
    while (this.previousSolutions.has(this.proposedSolution)) {
      this.proposedSolution = generateSolution();
    }
    this.previousSolutions.add(this.proposedSolution);
    this.spinnerSolutionEl.innerText = this.proposedSolution;
  }

  acceptProblem() {
    this.setClass('problem-is-set');
    this.proposeSolution();
    addToEach(
      this.solutionControls.getElementsByClassName('no'),
      'click', () => this.rejectAndPropose());
    addToEach(
      this.solutionControls.getElementsByClassName('ok'),
      'click', () => this.acceptAndPropose());
    this.countdownStart = new Date();
    this.updateCountdown();
    this.solutionCountdownInterval = setInterval(() => this.updateCountdown(), 1000);
    setTimeout(() => this.lockSolution(), this.solutionTime);
  }

  rejectAndPropose() {
    this.rejectSolution();
    this.proposeSolution();
  }

  acceptAndPropose() {
    this.acceptSolution();
    this.proposeSolution();
  }

  rejectSolution() {
    this.rejectedSolutions.push(this.proposedSolution);
    this.rejectedUl.appendChild(li(this.proposedSolution));
  }

  acceptSolution() {
    this.acceptedSolutions.push(this.proposedSolution);
    this.acceptedUl.appendChild(li(this.proposedSolution));
    this.proposeSolution();
  }

  updateCountdown() {
    const delta = new Date() - this.countdownStart;
    const timeLeft = Math.max(0, this.solutionTime - delta);
    this.countdownEl.innerText = Math.ceil(timeLeft / 1000);
  }

  lockSolution() {
    clearInterval(this.solutionCountdownInterval);
    this.setClass('solution-locked');
    // If it's not accepted by now, reject it by default.
    this.rejectSolution();
    if (this.acceptedSolutions.length > 0) {
      this.setClass('because-accepted', this.lockedSolutionContainer);
    } else {
      this.setClass('because-stubborn', this.lockedSolutionContainer);
      this.acceptedSolutions = this.rejectedSolutions;
      this.rejectedSolutions = [];
    }
    this.solution = pickRandom(this.acceptedSolutions);
    this.lockedSolutionEl.innerText = this.solution;

    this.nameForm.addEventListener('submit', (e) => this.setName(e));
    this.nameInput.focus();
  }

  setName(submitEvent) {
    submitEvent.preventDefault();
    this.setClass('solution-named');
    this.name = this.nameInput.value;
    this.solutionName.innerText = this.name;
    this.solutionDescription.innerText = this.solution;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new Page().init();
});