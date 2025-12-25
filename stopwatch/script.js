"use strict";

/**
 * Stopwatch Application
 * A fully-featured stopwatch with start, pause, reset, and lap functionality
 */
class Stopwatch {
  constructor() {
    this.isRunning = false;
    this.startTime = 0;
    this.elapsedTime = 0;
    this.animationFrameId = 0;
    this.laps = [];

    this.timeDisplay = document.getElementById("time");
    this.startPauseBtn = document.getElementById("startPause");
    this.resetBtn = document.getElementById("reset");
    this.lapsSection = document.getElementById("lapsSection");
    this.lapsList = document.getElementById("lapsList");

    this.setupEventListeners();
    this.updateDisplay();
  }

  setupEventListeners() {
    this.startPauseBtn.addEventListener("click", () => this.toggleStartPause());
    this.resetBtn.addEventListener("click", () => this.reset());
    document.addEventListener("keydown", (e) => this.handleKeyPress(e));
    document.addEventListener("visibilitychange", () => this.handleVisibilityChange());
  }

  handleKeyPress(event) {
    const key = event.key.toLowerCase();
    
    if (key === " " || event.code === "Space") {
      event.preventDefault();
      this.toggleStartPause();
    } else if (key === "r") {
      this.reset();
    }
  }

  handleVisibilityChange() {
    if (document.hidden && this.isRunning) {
      // Pause visual updates when tab is hidden
      this.elapsedTime += performance.now() - this.startTime;
      this.startTime = performance.now();
      this.updateDisplay();
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = 0;
      }
    } else if (!document.hidden && this.isRunning && !this.animationFrameId) {
      // Resume animation when tab becomes visible
      this.startTime = performance.now();
      this.animate();
    }
  }

  formatTime(ms) {
    const centiseconds = Math.floor(ms / 10) % 100;
    const seconds = Math.floor(ms / 1000) % 60;
    const minutes = Math.floor(ms / 60000) % 60;
    const hours = Math.floor(ms / 3600000);

    return [
      String(hours).padStart(2, "0"),
      String(minutes).padStart(2, "0"),
      String(seconds).padStart(2, "0"),
      String(centiseconds).padStart(2, "0"),
    ].join(":");
  }

  updateDisplay(timeMs = this.elapsedTime) {
    this.timeDisplay.textContent = this.formatTime(timeMs);
  }

  animate() {
    if (!this.isRunning) return;

    const now = performance.now();
    const totalElapsed = this.elapsedTime + (now - this.startTime);
    this.updateDisplay(totalElapsed);

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  updateButtonStates() {
    this.startPauseBtn.textContent = this.isRunning
      ? "⏸ Pause"
      : this.elapsedTime > 0
        ? "▶ Resume"
        : "▶ Start";

    this.resetBtn.disabled = this.isRunning || this.elapsedTime === 0;
    this.resetBtn.title = this.resetBtn.disabled 
      ? "Reset is disabled" 
      : "Reset the stopwatch";
  }

  toggleStartPause() {
    if (this.isRunning) {
      this.pause();
    } else {
      this.start();
    }
  }

  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.startTime = performance.now();

    if (!this.animationFrameId) {
      this.animationFrameId = requestAnimationFrame(() => this.animate());
    }

    this.updateButtonStates();
  }

  pause() {
    if (!this.isRunning) return;

    this.isRunning = false;

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = 0;
    }

    this.elapsedTime += performance.now() - this.startTime;
    this.updateDisplay();
    this.updateButtonStates();
  }

  reset() {
    if (this.isRunning) return;

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = 0;
    }

    this.startTime = 0;
    this.elapsedTime = 0;
    this.laps = [];
    this.updateDisplay();
    this.updateButtonStates();
    this.hideLapsSection();
  }

  addLap() {
    if (!this.isRunning || this.elapsedTime === 0) return;

    const lapTime = this.elapsedTime;
    this.laps.push(lapTime);
    this.renderLaps();
    this.showLapsSection();
  }

  renderLaps() {
    this.lapsList.innerHTML = "";

    this.laps.forEach((lap, index) => {
      const lapElement = document.createElement("div");
      lapElement.className = "lap-item";
      lapElement.innerHTML = `
        <span class="lap-number">Lap ${this.laps.length - index}</span>
        <span class="lap-time">${this.formatTime(lap)}</span>
      `;
      this.lapsList.appendChild(lapElement);
    });
  }

  showLapsSection() {
    this.lapsSection.classList.remove("hidden");
  }

  hideLapsSection() {
    this.lapsSection.classList.add("hidden");
  }
}

// Initialize Stopwatch
new Stopwatch();

