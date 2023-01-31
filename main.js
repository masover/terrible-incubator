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

function setClass(el, ...classes) {
  const list = el.classList;
  list.remove(...list);
  list.add(...classes);
}

function setBodyClass(...classes) {
  setClass(document.body, ...classes);
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
    this.solutionList = document.getElementById('solution-list');
    this.previousSolutions = new Set();
  }

  setProblem() {
    this.problem = pickRandom(problems)
    setAllText(this.problemElements, this.problem);
  }

  startOver() {
    setBodyClass('init');
    this.solutionList.replaceChildren();
    this.setProblem();
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
    document.getElementById('new-solution').addEventListener(
      'click', () => this.acceptProblem());
    document.getElementById('start-over').addEventListener(
      'click', () => this.startOver());
    document.getElementById('start-presentation').addEventListener(
      'click', () => this.startPresentation());
    document.getElementById('next-slide').addEventListener(
      'click', () => this.nextSlide());
    document.getElementById('finish-presentation').addEventListener(
      'click', () => this.finishPresentation());
    enableForm(this.nameInput, false);
    this.nameForm.addEventListener('submit', (e) => this.setName(e));

    // I want to be able to tweak these at runtime.
    // Ideally, this would be some user-visible control.
    // Instead, it's something I can easily set in the JS console.
    window.solutionSeconds = 30;
    window.presentationSeconds = 60;

    setBodyClass('init');
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
    setBodyClass('problem-is-set');
    this.rejectedSolutions = [];
    this.acceptedSolutions = [];
    this.rejectedUl.replaceChildren();
    this.acceptedUl.replaceChildren();
    this.proposeSolution();
    this.startCountdown(window.solutionSeconds * 1000, () => this.lockSolution());
  }

  startCountdown(countdownTime, whenDone) {
    this.countdownStart = new Date();
    this.countdownTime = countdownTime;
    this.updateCountdown();
    this.countdownInterval = setInterval(() => this.updateCountdown(), 1000);
    this.countdownTimeout = setTimeout(whenDone, countdownTime);
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
    const timeLeft = Math.max(0, this.countdownTime - delta);
    this.countdownEl.innerText = Math.ceil(timeLeft / 1000);
  }

  lockSolution() {
    clearInterval(this.countdownInterval);
    setBodyClass('solution-locked');
    // If it's not accepted by now, reject it by default.
    this.rejectSolution();
    if (this.acceptedSolutions.length > 0) {
      setClass(this.lockedSolutionContainer, 'because-accepted');
    } else {
      setClass(this.lockedSolutionContainer, 'because-stubborn');
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
    setBodyClass('presentation-mode', 'slide0');
    this.name = this.nameInput.value;
    this.solutionName.innerText = this.name;
    this.solutionDescription.innerText = this.solution;
    document.body.classList.add('slide0');
  }

  startPresentation() {
    this.startCountdown(window.presentationSeconds * 1000, () => this.finishPresentation());
    this.curSlide = 0;
    this.nextSlide();
  }

  nextSlide() {
    this.curSlide++;
    document.body.classList.replace(
      `slide${this.curSlide-1}`, `slide${this.curSlide}`);
  }

  finishPresentation() {
    clearInterval(this.countdownInterval);
    clearTimeout(this.countdownTimeout);
    setBodyClass('summarize');
    const li = document.createElement('li');
    const name = document.createElement('span');
    name.classList.add('problem');
    name.innerText = this.name;
    li.appendChild(name);
    const solution = document.createElement('span');
    solution.classList.add('solution');
    solution.innerText = `(${this.solution})`;
    li.appendChild(solution);
    this.solutionList.appendChild(li);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new Page().init();
});