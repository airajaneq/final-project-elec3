"use strict";

/**
 * Calculator State and Logic
 * Maintains calculator state and provides computation functionality
 */
class CalculatorState {
  constructor() {
    this.reset();
  }

  reset() {
    this.firstOperand = null;
    this.secondOperand = null;
    this.operator = null;
    this.currentInput = "0";
    this.isEvaluated = false;
    this.hasError = false;
  }

  get hasError() {
    return this._hasError;
  }

  set hasError(value) {
    this._hasError = value;
  }

  isErrorState() {
    return this.hasError || this.currentInput === "Error";
  }

  getCurrentNumber() {
    if (this.currentInput === "." || this.currentInput === "-.") return 0;
    return Number(this.currentInput);
  }
}

/**
 * Calculator Display Manager
 * Handles all display updates and formatting
 */
class DisplayManager {
  constructor(expressionEl, resultEl) {
    this.expressionEl = expressionEl;
    this.resultEl = resultEl;
  }

  formatNumber(num) {
    if (!Number.isFinite(num)) return "Error";
    const rounded = Math.round((num + Number.EPSILON) * 1e12) / 1e12;
    return String(rounded);
  }

  updateDisplay(state) {
    const parts = [];
    if (state.firstOperand !== null) parts.push(this.formatNumber(state.firstOperand));
    if (state.operator) parts.push(state.operator);
    if (state.secondOperand !== null && !state.isEvaluated) 
      parts.push(this.formatNumber(state.secondOperand));

    this.expressionEl.textContent = parts.join(" ");
    this.resultEl.textContent = state.currentInput;
  }
}

/**
 * Calculator Logic Engine
 * Performs calculations and manages state transitions
 */
class Calculator {
  constructor(displayManager, keyboardElement) {
    this.display = displayManager;
    this.state = new CalculatorState();
    this.keyElement = keyboardElement;
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.keyElement.addEventListener("click", (e) => this.handleButtonClick(e));
    document.addEventListener("keydown", (e) => this.handleKeyPress(e));
    this.display.updateDisplay(this.state);
  }

  handleButtonClick(event) {
    const btn = event.target.closest("button");
    if (!btn) return;

    if (btn.dataset.digit) this.appendDigit(btn.dataset.digit);
    else if (btn.dataset.op) this.setOperator(btn.dataset.op);
    else if (btn.dataset.action === "dot") this.appendDecimal();
    else if (btn.dataset.action === "clear") this.clear();
    else if (btn.dataset.action === "backspace") this.backspace();
    else if (btn.dataset.action === "sign") this.toggleSign();
    else if (btn.dataset.action === "equals") this.evaluate();
  }

  handleKeyPress(event) {
    const key = event.key;
    if (key >= "0" && key <= "9") this.appendDigit(key);
    else if (key === ".") this.appendDecimal();
    else if (key === "Enter" || key === "=") {
      event.preventDefault();
      this.evaluate();
    } else if (key === "Backspace" || key === "Delete") this.backspace();
    else if (key === "Escape") this.clear();
    else if (["+", "-", "*", "/"].includes(key)) this.setOperator(key);
  }

  appendDigit(digit) {
    if (this.state.isErrorState() || this.state.isEvaluated) {
      this.state.firstOperand = null;
      this.state.secondOperand = null;
      this.state.operator = null;
      this.state.currentInput = "0";
      this.state.isEvaluated = false;
      this.state.hasError = false;
    }

    if (this.state.currentInput === "0") {
      this.state.currentInput = digit;
    } else if (this.state.currentInput === "-0") {
      this.state.currentInput = "-" + digit;
    } else {
      this.state.currentInput += digit;
    }

    this.display.updateDisplay(this.state);
  }

  appendDecimal() {
    if (this.state.isErrorState() || this.state.isEvaluated) {
      this.resetAfterEvaluation();
    }

    if (!this.state.currentInput.includes(".")) {
      this.state.currentInput += ".";
    }
    this.display.updateDisplay(this.state);
  }

  toggleSign() {
    if (this.state.isErrorState()) return;
    if (this.state.currentInput === "0" || this.state.currentInput === "0.") return;

    this.state.currentInput = this.state.currentInput.startsWith("-")
      ? this.state.currentInput.slice(1)
      : "-" + this.state.currentInput;

    this.display.updateDisplay(this.state);
  }

  backspace() {
    if (this.state.isErrorState() || this.state.isEvaluated) return;

    if (this.state.currentInput.length <= 1 || 
        (this.state.currentInput.length === 2 && this.state.currentInput.startsWith("-"))) {
      this.state.currentInput = "0";
    } else {
      this.state.currentInput = this.state.currentInput.slice(0, -1);
      if (this.state.currentInput === "-") this.state.currentInput = "0";
    }

    this.display.updateDisplay(this.state);
  }

  setOperator(op) {
    if (this.state.isErrorState()) return;

    const num = this.state.getCurrentNumber();

    if (this.state.isEvaluated) {
      this.state.isEvaluated = false;
      this.state.secondOperand = null;
    }

    if (this.state.firstOperand === null) {
      this.state.firstOperand = num;
      this.state.operator = op;
      this.state.currentInput = "0";
      this.display.updateDisplay(this.state);
      return;
    }

    if (this.state.operator && this.state.currentInput !== "0") {
      this.state.secondOperand = num;
      const result = this.compute(this.state.firstOperand, this.state.operator, this.state.secondOperand);

      if (!Number.isFinite(result)) {
        this.setError();
        return;
      }

      this.state.firstOperand = result;
      this.state.secondOperand = null;
      this.state.operator = op;
      this.state.currentInput = "0";
      this.display.updateDisplay(this.state);
      return;
    }

    this.state.operator = op;
    this.display.updateDisplay(this.state);
  }

  compute(a, op, b) {
    switch (op) {
      case "+": return a + b;
      case "-": return a - b;
      case "*": return a * b;
      case "/": return b === 0 ? NaN : a / b;
      default: return NaN;
    }
  }

  evaluate() {
    if (this.state.isErrorState() || !this.state.operator || this.state.firstOperand === null) return;

    const num = this.state.getCurrentNumber();
    const b = this.state.isEvaluated ? (this.state.secondOperand ?? num) : num;
    const result = this.compute(this.state.firstOperand, this.state.operator, b);

    if (!Number.isFinite(result)) {
      this.setError();
      return;
    }

    this.state.secondOperand = b;
    this.state.firstOperand = result;
    this.state.currentInput = this.display.formatNumber(result);
    this.state.isEvaluated = true;
    this.display.updateDisplay(this.state);
  }

  resetAfterEvaluation() {
    this.state.firstOperand = null;
    this.state.secondOperand = null;
    this.state.operator = null;
    this.state.currentInput = "0";
    this.state.isEvaluated = false;
    this.state.hasError = false;
  }

  setError() {
    this.state.currentInput = "Error";
    this.state.hasError = true;
    this.state.firstOperand = null;
    this.state.secondOperand = null;
    this.state.operator = null;
    this.display.updateDisplay(this.state);
  }

  clear() {
    this.resetAfterEvaluation();
    this.display.updateDisplay(this.state);
  }
}

// Initialize Calculator
const displayManager = new DisplayManager(
  document.getElementById("expression"),
  document.getElementById("result")
);

new Calculator(displayManager, document.getElementById("keys"));
