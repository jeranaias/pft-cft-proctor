/**
 * PFT/CFT Proctor App - Main Application
 */

const App = {
  currentTab: 'pft',

  /**
   * Initialize the application
   */
  init() {
    // Initialize theme
    ThemeManager.init();

    // Set up tab navigation
    this.setupTabs();

    // Set up form handlers
    this.setupPFTForm();
    this.setupCFTForm();
    this.setupBCPForm();
    this.setupProctorForm();

    // Load any saved drafts
    this.loadDrafts();

    // Set today's date for proctor mode
    const dateInput = document.getElementById('proctor-date');
    if (dateInput) {
      dateInput.value = new Date().toISOString().split('T')[0];
    }

    // Load existing session
    this.refreshSessionList();
  },

  /**
   * Set up tab navigation
   */
  setupTabs() {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;
        this.switchTab(tabName);
      });
    });
  },

  /**
   * Switch to a tab
   */
  switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab').forEach(tab => {
      tab.classList.toggle('tab--active', tab.dataset.tab === tabName);
    });

    // Update tab panels
    document.querySelectorAll('.tab-panel').forEach(panel => {
      panel.classList.toggle('tab-panel--active', panel.id === `${tabName}-panel`);
    });

    this.currentTab = tabName;
  },

  /**
   * Set up PFT form
   */
  setupPFTForm() {
    const form = document.getElementById('pft-form');
    if (!form) return;

    // Upper body event toggle
    const pullupRadio = document.getElementById('pft-pullups-radio');
    const pushupRadio = document.getElementById('pft-pushups-radio');
    const pullupGroup = document.getElementById('pft-pullup-group');
    const pushupGroup = document.getElementById('pft-pushup-group');

    if (pullupRadio && pushupRadio) {
      pullupRadio.addEventListener('change', () => {
        pullupGroup.classList.remove('hidden');
        pushupGroup.classList.add('hidden');
        this.calculatePFT();
      });

      pushupRadio.addEventListener('change', () => {
        pullupGroup.classList.add('hidden');
        pushupGroup.classList.remove('hidden');
        this.calculatePFT();
      });
    }

    // Cardio event toggle
    const runRadio = document.getElementById('pft-run-radio');
    const rowRadio = document.getElementById('pft-row-radio');
    const runGroup = document.getElementById('pft-run-group');
    const rowGroup = document.getElementById('pft-row-group');

    if (runRadio && rowRadio) {
      runRadio.addEventListener('change', () => {
        runGroup.classList.remove('hidden');
        rowGroup.classList.add('hidden');
        this.calculatePFT();
      });

      rowRadio.addEventListener('change', () => {
        runGroup.classList.add('hidden');
        rowGroup.classList.remove('hidden');
        this.calculatePFT();
      });
    }

    // Add input listeners for auto-calculation
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
      input.addEventListener('input', () => this.calculatePFT());
      input.addEventListener('change', () => this.calculatePFT());
    });

    // Reset button
    const resetBtn = document.getElementById('pft-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetPFTForm());
    }
  },

  /**
   * Calculate and display PFT score
   */
  calculatePFT() {
    const gender = document.getElementById('pft-gender')?.value || 'male';
    const age = parseInt(document.getElementById('pft-age')?.value) || 21;

    const isPullups = document.getElementById('pft-pullups-radio')?.checked;
    const pullups = parseInt(document.getElementById('pft-pullups')?.value) || 0;
    const pushups = parseInt(document.getElementById('pft-pushups')?.value) || 0;

    const plankMin = parseInt(document.getElementById('pft-plank-min')?.value) || 0;
    const plankSec = parseInt(document.getElementById('pft-plank-sec')?.value) || 0;
    const plankSeconds = (plankMin * 60) + plankSec;

    const isRow = document.getElementById('pft-row-radio')?.checked;
    const runMin = parseInt(document.getElementById('pft-run-min')?.value) || 0;
    const runSec = parseInt(document.getElementById('pft-run-sec')?.value) || 0;
    const rowMin = parseInt(document.getElementById('pft-row-min')?.value) || 0;
    const rowSec = parseInt(document.getElementById('pft-row-sec')?.value) || 0;
    const isAltitude = document.getElementById('pft-altitude')?.checked || false;

    const options = {
      plankSeconds,
      isAltitude
    };

    if (isPullups) {
      options.pullups = pullups;
    } else {
      options.pushups = pushups;
    }

    if (isRow) {
      options.isRow = true;
      options.rowSeconds = (rowMin * 60) + rowSec;
    } else {
      options.runSeconds = (runMin * 60) + runSec;
    }

    const result = Calculator.calculatePFTScore(gender, age, options);
    this.displayPFTResult(result);
  },

  /**
   * Display PFT result
   */
  displayPFTResult(result) {
    // Event scores
    document.getElementById('pft-upper-score').textContent = result.upperBody.score;
    document.getElementById('pft-core-score').textContent = result.core.score;
    document.getElementById('pft-cardio-score').textContent = result.cardio.score;

    // Total and classification
    const totalEl = document.getElementById('pft-total');
    const classEl = document.getElementById('pft-class');

    if (totalEl) totalEl.textContent = result.total;
    if (classEl) {
      classEl.textContent = result.classification;
      classEl.className = 'score-display__class';
      if (result.classification === '1st Class') classEl.classList.add('score-display__class--first');
      else if (result.classification === '2nd Class') classEl.classList.add('score-display__class--second');
      else if (result.classification === '3rd Class') classEl.classList.add('score-display__class--third');
      else classEl.classList.add('score-display__class--fail');
    }
  },

  /**
   * Reset PFT form
   */
  resetPFTForm() {
    document.getElementById('pft-form')?.reset();
    document.getElementById('pft-pullup-group')?.classList.remove('hidden');
    document.getElementById('pft-pushup-group')?.classList.add('hidden');
    document.getElementById('pft-run-group')?.classList.remove('hidden');
    document.getElementById('pft-row-group')?.classList.add('hidden');
    this.calculatePFT();
    DraftStorage.clearDraft('pft');
  },

  /**
   * Set up CFT form
   */
  setupCFTForm() {
    const form = document.getElementById('cft-form');
    if (!form) return;

    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
      input.addEventListener('input', () => this.calculateCFT());
      input.addEventListener('change', () => this.calculateCFT());
    });

    const resetBtn = document.getElementById('cft-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetCFTForm());
    }
  },

  /**
   * Calculate and display CFT score
   */
  calculateCFT() {
    const gender = document.getElementById('cft-gender')?.value || 'male';
    const age = parseInt(document.getElementById('cft-age')?.value) || 21;

    const mtcMin = parseInt(document.getElementById('cft-mtc-min')?.value) || 0;
    const mtcSec = parseInt(document.getElementById('cft-mtc-sec')?.value) || 0;
    const ammoLifts = parseInt(document.getElementById('cft-ammo')?.value) || 0;
    const manufMin = parseInt(document.getElementById('cft-manuf-min')?.value) || 0;
    const manufSec = parseInt(document.getElementById('cft-manuf-sec')?.value) || 0;
    const isAltitude = document.getElementById('cft-altitude')?.checked || false;

    const result = Calculator.calculateCFTScore(gender, age, {
      mtcSeconds: (mtcMin * 60) + mtcSec,
      ammoLifts,
      manufSeconds: (manufMin * 60) + manufSec,
      isAltitude
    });

    this.displayCFTResult(result);
  },

  /**
   * Display CFT result
   */
  displayCFTResult(result) {
    document.getElementById('cft-mtc-score').textContent = result.mtc.score;
    document.getElementById('cft-al-score').textContent = result.al.score;
    document.getElementById('cft-manuf-score').textContent = result.manuf.score;

    const totalEl = document.getElementById('cft-total');
    const classEl = document.getElementById('cft-class');

    if (totalEl) totalEl.textContent = result.total;
    if (classEl) {
      classEl.textContent = result.classification;
      classEl.className = 'score-display__class';
      if (result.classification === '1st Class') classEl.classList.add('score-display__class--first');
      else if (result.classification === '2nd Class') classEl.classList.add('score-display__class--second');
      else if (result.classification === '3rd Class') classEl.classList.add('score-display__class--third');
      else classEl.classList.add('score-display__class--fail');
    }
  },

  /**
   * Reset CFT form
   */
  resetCFTForm() {
    document.getElementById('cft-form')?.reset();
    this.calculateCFT();
    DraftStorage.clearDraft('cft');
  },

  /**
   * Set up BCP form
   */
  setupBCPForm() {
    const form = document.getElementById('bcp-form');
    if (!form) return;

    const genderSelect = document.getElementById('bcp-gender');
    const hipsGroup = document.getElementById('bcp-hips-group');

    // Show/hide hips field based on gender
    genderSelect?.addEventListener('change', () => {
      if (genderSelect.value === 'female') {
        hipsGroup?.classList.remove('hidden');
      } else {
        hipsGroup?.classList.add('hidden');
      }
    });

    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
      input.addEventListener('input', () => this.calculateBCP());
      input.addEventListener('change', () => this.calculateBCP());
    });

    const resetBtn = document.getElementById('bcp-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetBCPForm());
    }
  },

  /**
   * Calculate and display BCP assessment
   */
  calculateBCP() {
    const gender = document.getElementById('bcp-gender')?.value || 'male';
    const age = parseInt(document.getElementById('bcp-age')?.value) || 21;
    const height = parseFloat(document.getElementById('bcp-height')?.value) || 70;
    const weight = parseFloat(document.getElementById('bcp-weight')?.value) || 0;
    const neck = parseFloat(document.getElementById('bcp-neck')?.value) || 0;
    const abdomen = parseFloat(document.getElementById('bcp-abdomen')?.value) || 0;
    const hips = parseFloat(document.getElementById('bcp-hips')?.value) || 0;

    const result = BodyFat.assessBCP(gender, age, height, weight, neck, abdomen, hips);
    this.displayBCPResult(result);
  },

  /**
   * Display BCP result
   */
  displayBCPResult(result) {
    const resultDiv = document.getElementById('bcp-result');
    if (!resultDiv) return;

    if (result.error) {
      resultDiv.innerHTML = `<div class="alert alert--error">${result.error}</div>`;
      return;
    }

    let html = '';

    // Weight standard result
    html += `
      <div class="result-box ${result.weightCheck.withinStandard ? 'result-box--pass' : 'result-box--fail'}">
        <div class="result-box__value">${result.weightCheck.withinStandard ? 'WITHIN' : 'OVER'}</div>
        <div class="result-box__label">Weight Standard</div>
        <div class="text-sm mt-2">Max: ${result.weightCheck.maxWeight} lbs | Actual: ${result.weightCheck.actualWeight} lbs</div>
        ${result.weightCheck.overBy > 0 ? `<div class="text-sm text-error">Over by ${result.weightCheck.overBy} lbs</div>` : ''}
      </div>
    `;

    // Body fat result (if tape test required)
    if (result.requiresTape && result.bodyFatCheck) {
      html += `
        <div class="result-box ${result.bodyFatCheck.withinStandard ? 'result-box--pass' : 'result-box--fail'} mt-4">
          <div class="result-box__value">${result.bodyFatCheck.bodyFatPercent}%</div>
          <div class="result-box__label">Body Fat</div>
          <div class="text-sm mt-2">Max Allowed: ${result.bodyFatCheck.maxAllowed}%</div>
          <div class="text-sm">Circumference Value: ${result.bodyFatCheck.circumferenceValue}"</div>
        </div>
      `;
    }

    // Overall status
    html += `
      <div class="result-box ${result.overallStatus === 'PASS' ? 'result-box--pass' : 'result-box--fail'} mt-4">
        <div class="result-box__value">${result.overallStatus}</div>
        <div class="result-box__label">Overall BCP Status</div>
        <div class="text-sm mt-2">${result.message}</div>
      </div>
    `;

    resultDiv.innerHTML = html;
  },

  /**
   * Reset BCP form
   */
  resetBCPForm() {
    document.getElementById('bcp-form')?.reset();
    document.getElementById('bcp-hips-group')?.classList.add('hidden');
    document.getElementById('bcp-result').innerHTML = '';
    DraftStorage.clearDraft('bcp');
  },

  /**
   * Set up Proctor form
   */
  setupProctorForm() {
    const form = document.getElementById('proctor-form');
    if (!form) return;

    // Test type toggle
    const pftRadio = document.getElementById('proctor-pft-radio');
    const cftRadio = document.getElementById('proctor-cft-radio');
    const pftEvents = document.getElementById('proctor-pft-events');
    const cftEvents = document.getElementById('proctor-cft-events');

    pftRadio?.addEventListener('change', () => {
      pftEvents?.classList.remove('hidden');
      cftEvents?.classList.add('hidden');
      SessionStorage.updateSessionInfo({ testType: 'pft' });
    });

    cftRadio?.addEventListener('change', () => {
      pftEvents?.classList.add('hidden');
      cftEvents?.classList.remove('hidden');
      SessionStorage.updateSessionInfo({ testType: 'cft' });
    });

    // Upper body event toggle (within proctor PFT)
    const proctorPullupRadio = document.getElementById('proctor-pullups-radio');
    const proctorPushupRadio = document.getElementById('proctor-pushups-radio');

    proctorPullupRadio?.addEventListener('change', () => {
      document.getElementById('proctor-pullup-group')?.classList.remove('hidden');
      document.getElementById('proctor-pushup-group')?.classList.add('hidden');
    });

    proctorPushupRadio?.addEventListener('change', () => {
      document.getElementById('proctor-pullup-group')?.classList.add('hidden');
      document.getElementById('proctor-pushup-group')?.classList.remove('hidden');
    });

    // Add Marine button
    const addBtn = document.getElementById('proctor-add');
    addBtn?.addEventListener('click', () => this.addMarineToSession());

    // Generate PDF button
    const pdfBtn = document.getElementById('proctor-pdf');
    pdfBtn?.addEventListener('click', () => this.generateSessionPDF());

    // Clear session button
    const clearBtn = document.getElementById('proctor-clear');
    clearBtn?.addEventListener('click', () => {
      if (confirm('Clear all Marines from this session?')) {
        SessionStorage.clearSession();
        this.refreshSessionList();
      }
    });

    // Unit and date changes
    const unitInput = document.getElementById('proctor-unit');
    const dateInput = document.getElementById('proctor-date');

    unitInput?.addEventListener('change', () => {
      SessionStorage.updateSessionInfo({ unit: unitInput.value });
    });

    dateInput?.addEventListener('change', () => {
      SessionStorage.updateSessionInfo({ date: dateInput.value });
    });
  },

  /**
   * Add Marine to session
   */
  addMarineToSession() {
    const session = SessionStorage.getSession();
    const isPFT = document.getElementById('proctor-pft-radio')?.checked;

    // Get Marine info
    const name = document.getElementById('proctor-name')?.value?.trim();
    const rank = document.getElementById('proctor-rank')?.value;
    const edipi = document.getElementById('proctor-edipi')?.value?.trim();
    const dob = document.getElementById('proctor-dob')?.value;
    const gender = document.getElementById('proctor-gender')?.value || 'male';

    if (!name) {
      alert('Please enter Marine name');
      return;
    }

    // Calculate age from DOB
    let age = 21;
    if (dob) {
      const today = new Date();
      const birth = new Date(dob);
      age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
    }

    let results, rawScores;

    if (isPFT) {
      const isPullups = document.getElementById('proctor-pullups-radio')?.checked;
      const pullups = parseInt(document.getElementById('proctor-pullups')?.value) || 0;
      const pushups = parseInt(document.getElementById('proctor-pushups')?.value) || 0;
      const plankMin = parseInt(document.getElementById('proctor-plank-min')?.value) || 0;
      const plankSec = parseInt(document.getElementById('proctor-plank-sec')?.value) || 0;
      const runMin = parseInt(document.getElementById('proctor-run-min')?.value) || 0;
      const runSec = parseInt(document.getElementById('proctor-run-sec')?.value) || 0;
      const isAltitude = document.getElementById('proctor-pft-altitude')?.checked || false;

      const options = {
        plankSeconds: (plankMin * 60) + plankSec,
        runSeconds: (runMin * 60) + runSec,
        isAltitude
      };

      if (isPullups) {
        options.pullups = pullups;
        rawScores = {
          upperBody: `${pullups} pull-ups`,
          plank: `${plankMin}:${String(plankSec).padStart(2, '0')}`,
          cardio: `${runMin}:${String(runSec).padStart(2, '0')}`
        };
      } else {
        options.pushups = pushups;
        rawScores = {
          upperBody: `${pushups} push-ups`,
          plank: `${plankMin}:${String(plankSec).padStart(2, '0')}`,
          cardio: `${runMin}:${String(runSec).padStart(2, '0')}`
        };
      }

      results = Calculator.calculatePFTScore(gender, age, options);
    } else {
      const mtcMin = parseInt(document.getElementById('proctor-mtc-min')?.value) || 0;
      const mtcSec = parseInt(document.getElementById('proctor-mtc-sec')?.value) || 0;
      const ammoLifts = parseInt(document.getElementById('proctor-ammo')?.value) || 0;
      const manufMin = parseInt(document.getElementById('proctor-manuf-min')?.value) || 0;
      const manufSec = parseInt(document.getElementById('proctor-manuf-sec')?.value) || 0;
      const isAltitude = document.getElementById('proctor-cft-altitude')?.checked || false;

      rawScores = {
        mtc: `${mtcMin}:${String(mtcSec).padStart(2, '0')}`,
        ammoLift: `${ammoLifts} lifts`,
        manuf: `${manufMin}:${String(manufSec).padStart(2, '0')}`
      };

      results = Calculator.calculateCFTScore(gender, age, {
        mtcSeconds: (mtcMin * 60) + mtcSec,
        ammoLifts,
        manufSeconds: (manufMin * 60) + manufSec,
        isAltitude
      });
    }

    const marine = {
      name,
      rank,
      edipi,
      dob,
      age,
      gender,
      rawScores,
      results
    };

    SessionStorage.addMarine(marine);
    this.refreshSessionList();
    this.clearProctorMarineForm();
  },

  /**
   * Clear Marine form (keep session info)
   */
  clearProctorMarineForm() {
    document.getElementById('proctor-name').value = '';
    document.getElementById('proctor-edipi').value = '';
    document.getElementById('proctor-dob').value = '';
    document.getElementById('proctor-pullups').value = '';
    document.getElementById('proctor-pushups').value = '';
    document.getElementById('proctor-plank-min').value = '';
    document.getElementById('proctor-plank-sec').value = '';
    document.getElementById('proctor-run-min').value = '';
    document.getElementById('proctor-run-sec').value = '';
    document.getElementById('proctor-mtc-min').value = '';
    document.getElementById('proctor-mtc-sec').value = '';
    document.getElementById('proctor-ammo').value = '';
    document.getElementById('proctor-manuf-min').value = '';
    document.getElementById('proctor-manuf-sec').value = '';
  },

  /**
   * Refresh session list display
   */
  refreshSessionList() {
    const session = SessionStorage.getSession();
    const listEl = document.getElementById('session-list');
    const countEl = document.getElementById('session-count');

    if (countEl) {
      countEl.textContent = session.marines.length;
    }

    if (!listEl) return;

    if (session.marines.length === 0) {
      listEl.innerHTML = '<p class="text-secondary text-sm">No Marines added yet</p>';
      return;
    }

    let html = '';
    session.marines.forEach(marine => {
      html += `
        <div class="session-item">
          <div class="session-item__info">
            <div class="session-item__name">${marine.rank} ${marine.name}</div>
            <div class="session-item__details">Score: ${marine.results.total} - ${marine.results.classification}</div>
          </div>
          <div class="session-item__actions">
            <button class="btn btn--sm btn--ghost" onclick="App.removeMarine('${marine.id}')">Remove</button>
          </div>
        </div>
      `;
    });

    listEl.innerHTML = html;

    // Update session info fields
    const unitInput = document.getElementById('proctor-unit');
    const dateInput = document.getElementById('proctor-date');
    if (unitInput && session.unit) unitInput.value = session.unit;
    if (dateInput && session.date) dateInput.value = session.date;
  },

  /**
   * Remove Marine from session
   */
  removeMarine(marineId) {
    SessionStorage.removeMarine(marineId);
    this.refreshSessionList();
  },

  /**
   * Generate session PDF
   */
  generateSessionPDF() {
    const session = SessionStorage.getSession();

    if (session.marines.length === 0) {
      alert('No Marines in session');
      return;
    }

    const doc = PDFGenerator.generateSessionPDF(session);
    const testType = session.testType.toUpperCase();
    const date = session.date.replace(/-/g, '');
    PDFGenerator.savePDF(doc, `${testType}_Session_${date}.pdf`);
  },

  /**
   * Load drafts from storage
   */
  loadDrafts() {
    // Could implement loading saved form state
  },

  /**
   * Toggle theme
   */
  toggleTheme() {
    ThemeManager.toggle();
  }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => App.init());
