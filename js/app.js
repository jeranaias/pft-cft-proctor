/**
 * PFT/CFT Proctor App - NAVMC 11622 Generator
 * Main Application Logic
 */

const App = {
  // Marines in the current worksheet
  marines: [],

  // Current calculated scores (for display)
  currentPFT: null,
  currentCFT: null,

  /**
   * Initialize the application
   */
  init() {
    // Initialize theme
    ThemeManager.init();

    // Set today's date
    const dateInput = document.getElementById('session-date');
    if (dateInput) {
      dateInput.value = new Date().toISOString().split('T')[0];
    }

    // Set up DOB change listener for auto age calculation
    const dobInput = document.getElementById('marine-dob');
    if (dobInput) {
      dobInput.addEventListener('change', () => this.calculateAge());
    }

    // Set up gender change listener to recalculate
    const genderInput = document.getElementById('marine-gender');
    if (genderInput) {
      genderInput.addEventListener('change', () => {
        this.calculateScores();
        this.calculateCFTScores();
      });
    }

    // Load any saved session
    this.loadSession();

    console.log('NAVMC 11622 Generator initialized');
  },

  /**
   * Calculate age from DOB
   */
  calculateAge() {
    const dobInput = document.getElementById('marine-dob');
    const ageInput = document.getElementById('marine-age');

    if (!dobInput || !dobInput.value) {
      if (ageInput) ageInput.value = '';
      return null;
    }

    const dob = new Date(dobInput.value);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    if (ageInput) ageInput.value = age;

    // Recalculate scores with new age
    this.calculateScores();
    this.calculateCFTScores();

    return age;
  },

  /**
   * Get current age (from input or DOB calculation)
   */
  getCurrentAge() {
    const ageInput = document.getElementById('marine-age');
    if (ageInput && ageInput.value) {
      return parseInt(ageInput.value);
    }
    return this.calculateAge() || 21;
  },

  /**
   * Get current gender
   */
  getCurrentGender() {
    const genderInput = document.getElementById('marine-gender');
    return genderInput ? genderInput.value : 'male';
  },

  /**
   * Update upper body event visibility
   */
  updateUpperEvent() {
    const isPullups = document.querySelector('input[name="upper-event"][value="pullups"]').checked;
    document.getElementById('pullups-input').classList.toggle('hidden', !isPullups);
    document.getElementById('pushups-input').classList.toggle('hidden', isPullups);
    this.calculateScores();
  },

  /**
   * Update cardio event visibility
   */
  updateCardioEvent() {
    const isRun = document.querySelector('input[name="cardio-event"][value="run"]').checked;
    document.getElementById('run-input').classList.toggle('hidden', !isRun);
    document.getElementById('row-input').classList.toggle('hidden', isRun);
    this.calculateScores();
  },

  /**
   * Calculate PFT scores in real-time
   */
  calculateScores() {
    const gender = this.getCurrentGender();
    const age = this.getCurrentAge();
    const ageBracket = ScoringTables.getAgeBracket(age);

    // Upper body
    const isPullups = document.querySelector('input[name="upper-event"][value="pullups"]').checked;
    let upperScore = 0;
    if (isPullups) {
      const pullups = parseInt(document.getElementById('marine-pullups').value) || 0;
      upperScore = Calculator.calculatePullups(gender, ageBracket, pullups);
    } else {
      const pushups = parseInt(document.getElementById('marine-pushups').value) || 0;
      upperScore = Calculator.calculatePushups(gender, ageBracket, pushups);
    }
    document.getElementById('upper-score').textContent = `${upperScore} pts`;

    // Plank
    const plankMin = parseInt(document.getElementById('marine-plank-min').value) || 0;
    const plankSec = parseInt(document.getElementById('marine-plank-sec').value) || 0;
    const plankSeconds = (plankMin * 60) + plankSec;
    const plankScore = Calculator.calculatePlank(plankSeconds);
    document.getElementById('plank-score').textContent = `${plankScore} pts`;

    // Cardio
    const isRun = document.querySelector('input[name="cardio-event"][value="run"]').checked;
    const isAltitude = document.getElementById('marine-altitude').checked;
    let cardioScore = 0;

    if (isRun) {
      const runMin = parseInt(document.getElementById('marine-run-min').value) || 0;
      const runSec = parseInt(document.getElementById('marine-run-sec').value) || 0;
      const runSeconds = (runMin * 60) + runSec;
      if (runSeconds > 0) {
        cardioScore = Calculator.calculateRun(gender, ageBracket, runSeconds, isAltitude);
      }
    } else {
      const rowMin = parseInt(document.getElementById('marine-row-min').value) || 0;
      const rowSec = parseInt(document.getElementById('marine-row-sec').value) || 0;
      const rowSeconds = (rowMin * 60) + rowSec;
      if (rowSeconds > 0) {
        cardioScore = Calculator.calculateRow(gender, ageBracket, rowSeconds);
      }
    }
    document.getElementById('cardio-score').textContent = `${cardioScore} pts`;

    // Total
    const total = upperScore + plankScore + cardioScore;
    document.getElementById('pft-total').textContent = total;

    // Classification
    const classification = Calculator.getClassification(total);
    const classEl = document.getElementById('pft-class');
    const hasScores = upperScore > 0 || plankScore > 0 || cardioScore > 0;

    if (hasScores) {
      classEl.textContent = `${classification.class} (Grade: ${classification.grade})`;
    } else {
      classEl.textContent = 'Enter scores above';
    }

    // Store current PFT result
    this.currentPFT = {
      upperBody: { score: upperScore, isPullups, value: isPullups ?
        (parseInt(document.getElementById('marine-pullups').value) || 0) :
        (parseInt(document.getElementById('marine-pushups').value) || 0)
      },
      plank: { score: plankScore, time: `${plankMin}:${String(plankSec).padStart(2, '0')}` },
      cardio: {
        score: cardioScore,
        isRun,
        time: isRun ?
          `${document.getElementById('marine-run-min').value || 0}:${String(document.getElementById('marine-run-sec').value || 0).padStart(2, '0')}` :
          `${document.getElementById('marine-row-min').value || 0}:${String(document.getElementById('marine-row-sec').value || 0).padStart(2, '0')}`
      },
      total,
      classification: classification.class,
      grade: classification.grade
    };
  },

  /**
   * Calculate CFT scores in real-time
   */
  calculateCFTScores() {
    const gender = this.getCurrentGender();
    const age = this.getCurrentAge();
    const ageBracket = ScoringTables.getAgeBracket(age);
    const isAltitude = document.getElementById('marine-cft-altitude').checked;

    // MTC
    const mtcMin = parseInt(document.getElementById('marine-mtc-min').value) || 0;
    const mtcSec = parseInt(document.getElementById('marine-mtc-sec').value) || 0;
    const mtcSeconds = (mtcMin * 60) + mtcSec;
    const mtcScore = mtcSeconds > 0 ? Calculator.calculateMTC(gender, ageBracket, mtcSeconds, isAltitude) : 0;
    document.getElementById('mtc-score').textContent = `${mtcScore} pts`;

    // Ammo Lift
    const alReps = parseInt(document.getElementById('marine-al').value) || 0;
    const alScore = Calculator.calculateAmmoLift(gender, ageBracket, alReps);
    document.getElementById('al-score').textContent = `${alScore} pts`;

    // MANUF
    const manufMin = parseInt(document.getElementById('marine-manuf-min').value) || 0;
    const manufSec = parseInt(document.getElementById('marine-manuf-sec').value) || 0;
    const manufSeconds = (manufMin * 60) + manufSec;
    const manufScore = manufSeconds > 0 ? Calculator.calculateMANUF(gender, ageBracket, manufSeconds, isAltitude) : 0;
    document.getElementById('manuf-score').textContent = `${manufScore} pts`;

    // Total
    const total = mtcScore + alScore + manufScore;
    document.getElementById('cft-total').textContent = total;

    // Classification
    const classification = Calculator.getClassification(total);
    const classEl = document.getElementById('cft-class');
    const hasScores = mtcScore > 0 || alScore > 0 || manufScore > 0;

    if (hasScores) {
      const passStatus = total >= 150 ? 'PASS' : 'FAIL';
      classEl.textContent = `${classification.class} - ${passStatus}`;
    } else {
      classEl.textContent = 'Enter scores above';
    }

    // Store current CFT result
    this.currentCFT = {
      mtc: { score: mtcScore, time: `${mtcMin}:${String(mtcSec).padStart(2, '0')}` },
      al: { score: alScore, reps: alReps },
      manuf: { score: manufScore, time: `${manufMin}:${String(manufSec).padStart(2, '0')}` },
      total,
      classification: classification.class,
      passStatus: total >= 150 ? 'PASS' : 'FAIL'
    };
  },

  /**
   * Add current Marine to worksheet
   */
  addMarineToWorksheet() {
    // Validate required fields
    const lastName = document.getElementById('marine-lastname').value.trim();
    const firstName = document.getElementById('marine-firstname').value.trim();

    if (!lastName || !firstName) {
      alert('Please enter Marine name (First and Last name required)');
      return;
    }

    const age = this.getCurrentAge();
    if (!age || age < 17) {
      alert('Please enter a valid Date of Birth');
      return;
    }

    // Collect all marine data
    const marine = {
      id: Date.now().toString(),
      rank: document.getElementById('marine-rank').value,
      firstName,
      lastName,
      mi: document.getElementById('marine-mi').value.trim().toUpperCase(),
      edipi: document.getElementById('marine-edipi').value.trim(),
      dob: document.getElementById('marine-dob').value,
      age,
      gender: this.getCurrentGender(),
      height: document.getElementById('marine-height').value,
      weight: document.getElementById('marine-weight').value,

      // PFT Data
      pullUps: this.currentPFT?.upperBody.isPullups ? this.currentPFT.upperBody.value : '',
      pullUpsScore: this.currentPFT?.upperBody.isPullups ? this.currentPFT.upperBody.score : '',
      pushUps: !this.currentPFT?.upperBody.isPullups ? this.currentPFT.upperBody.value : '',
      pushUpsScore: !this.currentPFT?.upperBody.isPullups ? this.currentPFT.upperBody.score : '',
      plankTime: this.currentPFT?.plank.time,
      plankScore: this.currentPFT?.plank.score,
      runTime: this.currentPFT?.cardio.isRun ? this.currentPFT.cardio.time : '',
      runScore: this.currentPFT?.cardio.isRun ? this.currentPFT.cardio.score : '',
      rowTime: !this.currentPFT?.cardio.isRun ? this.currentPFT.cardio.time : '',
      rowScore: !this.currentPFT?.cardio.isRun ? this.currentPFT.cardio.score : '',
      pftTotal: this.currentPFT?.total || 0,

      // CFT Data
      mtcTime: this.currentCFT?.mtc.time,
      mtcScore: this.currentCFT?.mtc.score,
      alReps: this.currentCFT?.al.reps,
      alScore: this.currentCFT?.al.score,
      manufTime: this.currentCFT?.manuf.time,
      manufScore: this.currentCFT?.manuf.score,
      cftTotal: this.currentCFT?.total || 0,
      cftPassFail: this.currentCFT?.passStatus || ''
    };

    this.marines.push(marine);
    this.saveSession();
    this.renderMarinesList();
    this.clearMarineForm();
  },

  /**
   * Render the marines list
   */
  renderMarinesList() {
    const listEl = document.getElementById('marines-list');
    const countEl = document.getElementById('marine-count');
    const generateBtn = document.getElementById('generate-btn');
    const clearAllBtn = document.getElementById('clear-all-btn');

    countEl.textContent = this.marines.length;

    // Enable/disable buttons
    generateBtn.disabled = this.marines.length === 0;
    clearAllBtn.disabled = this.marines.length === 0;

    if (this.marines.length === 0) {
      listEl.innerHTML = '<p class="text-secondary text-center p-4">No Marines added yet. Fill out the form above and click "Add Marine to Worksheet".</p>';
      return;
    }

    let html = '';
    this.marines.forEach((marine, index) => {
      const pftClass = Calculator.getClassification(marine.pftTotal).class;
      const cftClass = Calculator.getClassification(marine.cftTotal).class;

      html += `
        <div class="marine-row">
          <div>
            <div class="marine-row__info">${marine.rank} ${marine.lastName}, ${marine.firstName} ${marine.mi}</div>
            <div class="marine-row__details">EDIPI: ${marine.edipi || 'N/A'} | Age: ${marine.age} | ${marine.gender === 'male' ? 'M' : 'F'}</div>
          </div>
          <div class="text-center">
            <div class="font-bold ${marine.pftTotal >= 235 ? 'text-success' : marine.pftTotal >= 150 ? '' : 'text-error'}">${marine.pftTotal}</div>
            <div class="text-xs text-secondary">PFT</div>
          </div>
          <div class="text-center">
            <div class="font-bold ${marine.cftTotal >= 235 ? 'text-success' : marine.cftTotal >= 150 ? '' : 'text-error'}">${marine.cftTotal || '--'}</div>
            <div class="text-xs text-secondary">CFT</div>
          </div>
          <div>
            <button class="btn btn--sm btn--ghost" onclick="App.removeMarine('${marine.id}')">Remove</button>
          </div>
        </div>
      `;
    });

    listEl.innerHTML = html;
  },

  /**
   * Remove a Marine from the worksheet
   */
  removeMarine(id) {
    this.marines = this.marines.filter(m => m.id !== id);
    this.saveSession();
    this.renderMarinesList();
  },

  /**
   * Clear all Marines
   */
  clearAllMarines() {
    if (confirm('Remove all Marines from the worksheet?')) {
      this.marines = [];
      this.saveSession();
      this.renderMarinesList();
    }
  },

  /**
   * Clear the Marine input form
   */
  clearMarineForm() {
    document.getElementById('marine-form').reset();
    document.getElementById('marine-age').value = '';
    document.getElementById('pullups-input').classList.remove('hidden');
    document.getElementById('pushups-input').classList.add('hidden');
    document.getElementById('run-input').classList.remove('hidden');
    document.getElementById('row-input').classList.add('hidden');

    // Reset score displays
    document.getElementById('upper-score').textContent = '0 pts';
    document.getElementById('plank-score').textContent = '0 pts';
    document.getElementById('cardio-score').textContent = '0 pts';
    document.getElementById('pft-total').textContent = '0';
    document.getElementById('pft-class').textContent = 'Enter scores above';

    document.getElementById('mtc-score').textContent = '0 pts';
    document.getElementById('al-score').textContent = '0 pts';
    document.getElementById('manuf-score').textContent = '0 pts';
    document.getElementById('cft-total').textContent = '0';
    document.getElementById('cft-class').textContent = 'Enter scores above';

    this.currentPFT = null;
    this.currentCFT = null;
  },

  /**
   * Generate NAVMC 11622 PDF
   */
  generateNAVMC() {
    if (this.marines.length === 0) {
      alert('No Marines in worksheet');
      return;
    }

    const sessionData = {
      unit: document.getElementById('session-unit').value,
      date: document.getElementById('session-date').value,
      monitor: document.getElementById('session-monitor').value,
      marines: this.marines
    };

    // Generate and download
    NAVMCGenerator.downloadPDF(sessionData);
  },

  /**
   * Save session to localStorage
   */
  saveSession() {
    const session = {
      unit: document.getElementById('session-unit').value,
      date: document.getElementById('session-date').value,
      monitor: document.getElementById('session-monitor').value,
      marines: this.marines
    };
    Storage.save('navmc-session', session);
  },

  /**
   * Load session from localStorage
   */
  loadSession() {
    const session = Storage.load('navmc-session');
    if (session) {
      if (session.unit) document.getElementById('session-unit').value = session.unit;
      if (session.date) document.getElementById('session-date').value = session.date;
      if (session.monitor) document.getElementById('session-monitor').value = session.monitor;
      if (session.marines) this.marines = session.marines;
      this.renderMarinesList();
    }
  },

  /**
   * Toggle theme
   */
  toggleTheme() {
    ThemeManager.toggle();
  },

  /**
   * Quick calculate (for the collapsible quick calculator)
   */
  quickCalculate() {
    // Use values from main form but with quick calc gender/age
    const gender = document.getElementById('quick-gender').value;
    const age = parseInt(document.getElementById('quick-age').value) || 21;

    // Just update the displays - the main calculateScores already runs on input
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => App.init());
