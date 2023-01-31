import {problems} from './data/problems.js';
import {pickRandom} from './util.js';
import {generateSolution} from './solutions.js';

function addToQuery(query, event, listener) {
  for (const el of document.querySelectorAll(query)) {
    el.addEventListener(event, listener);
  }
}

function enableForm(form, enabled) {
  form.querySelectorAll('button').disabled = !enabled;
  form.querySelectorAll('input').disabled = !enabled;
}

function li(text) {
  const el = document.createElement('li');
  el.innerText = text;
  return el;
}

function setAllText(elements, text) {
  for (const element of elements) {
    element.innerText = text;
  }
}

class Page {
  constructor() {
    this.problemElements = document.querySelectorAll('.problem');
    this.spinnerSolutionEl = document.querySelector('#solution-spinner .solution');
    this.lockedSolutionEl = document.querySelector('#solution-locked .solution');
    this.lockedSolutionContainer = document.getElementById('solution-locked');
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
    setAllText(this.problemElements, this.problem);
  }

  init() {
    this.setProblem();
    // Wire up all click handlers once
    addToQuery(
      '#problem-controls .spin',
      'click', () => this.setProblem());
    addToQuery(
      '#problem-controls .ok',
      'click', () => this.acceptProblem());
    addToQuery(
      '#solution-controls .no',
      'click', () => this.rejectAndPropose());
    addToQuery(
      '#solution-controls .ok',
      'click', () => this.acceptAndPropose());
    enableForm(this.nameInput, false);
    this.nameForm.addEventListener('submit', (e) => this.setName(e));
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
    enableForm(this.nameForm, true);
    this.nameInput.value = '';
    this.nameInput.focus();
  }

  setName(submitEvent) {
    submitEvent.preventDefault();
    enableForm(this.nameForm, false);
    this.setClass('presentation-mode');
    this.name = this.nameInput.value;
    this.solutionName.innerText = this.name;
    this.solutionDescription.innerText = this.solution;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new Page().init();
});