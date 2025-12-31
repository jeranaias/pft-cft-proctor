/**
 * PFT/CFT Proctor App - NAVMC 11622 Generator
 * Main Application Logic - Mobile Optimized
 */

const App = {
  // Marines in the current worksheet
  marines: [],

  // Current event selections
  upperEvent: 'pullups',
  cardioEvent: 'run',

  // Current calculated scores
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
   * Toggle collapsible section
   */
  toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.classList.toggle('section--collapsed');
    }
  },

  /**
   * Set upper body event type
   */
  setUpperEvent(type) {
    this.upperEvent = type;

    // Update toggle buttons
    document.getElementById('btn-pullups').classList.toggle('toggle-btn--active', type === 'pullups');
    document.getElementById('btn-pushups').classList.toggle('toggle-btn--active', type === 'pushups');

    // Show/hide inputs
    document.getElementById('pullups-event').classList.toggle('hidden', type !== 'pullups');
    document.getElementById('pushups-event').classList.toggle('hidden', type !== 'pushups');

    this.calculateScores();
  },

  /**
   * Set cardio event type
   */
  setCardioEvent(type) {
    this.cardioEvent = type;

    // Update toggle buttons
    document.getElementById('btn-run').classList.toggle('toggle-btn--active', type === 'run');
    document.getElementById('btn-row').classList.toggle('toggle-btn--active', type === 'row');

    // Show/hide inputs
    document.getElementById('run-event').classList.toggle('hidden', type !== 'run');
    document.getElementById('row-event').classList.toggle('hidden', type !== 'row');

    this.calculateScores();
  },

  /**
   * Adjust count input with +/- buttons
   */
  adjustCount(type, delta) {
    const inputMap = {
      'pullups': 'marine-pullups',
      'pushups': 'marine-pushups',
      'al': 'marine-al'
    };

    const input = document.getElementById(inputMap[type]);
    if (!input) return;

    let value = parseInt(input.value) || 0;
    value = Math.max(0, value + delta);

    // Apply max limits
    const maxMap = { 'pullups': 50, 'pushups': 150, 'al': 200 };
    value = Math.min(value, maxMap[type] || 999);

    input.value = value;

    // Trigger recalculation
    if (type === 'al') {
      this.calculateCFTScores();
    } else {
      this.calculateScores();
    }
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
   * Get current age
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
   * Calculate PFT scores in real-time
   */
  calculateScores() {
    const gender = this.getCurrentGender();
    const age = this.getCurrentAge();
    const ageBracket = ScoringTables.getAgeBracket(age);

    // Upper body
    let upperScore = 0;
    if (this.upperEvent === 'pullups') {
      const pullups = parseInt(document.getElementById('marine-pullups').value) || 0;
      upperScore = Calculator.calculatePullups(gender, ageBracket, pullups);
      document.getElementById('pullups-score').textContent = `${upperScore} pts`;
    } else {
      const pushups = parseInt(document.getElementById('marine-pushups').value) || 0;
      upperScore = Calculator.calculatePushups(gender, ageBracket, pushups);
      document.getElementById('pushups-score').textContent = `${upperScore} pts`;
    }

    // Plank
    const plankMin = parseInt(document.getElementById('marine-plank-min').value) || 0;
    const plankSec = parseInt(document.getElementById('marine-plank-sec').value) || 0;
    const plankSeconds = (plankMin * 60) + plankSec;
    const plankScore = Calculator.calculatePlank(plankSeconds);
    document.getElementById('plank-score').textContent = `${plankScore} pts`;

    // Cardio
    const isAltitude = document.getElementById('marine-altitude').checked;
    let cardioScore = 0;

    if (this.cardioEvent === 'run') {
      const runMin = parseInt(document.getElementById('marine-run-min').value) || 0;
      const runSec = parseInt(document.getElementById('marine-run-sec').value) || 0;
      const runSeconds = (runMin * 60) + runSec;
      if (runSeconds > 0) {
        cardioScore = Calculator.calculateRun(gender, ageBracket, runSeconds, isAltitude);
      }
      document.getElementById('run-score').textContent = `${cardioScore} pts`;
    } else {
      const rowMin = parseInt(document.getElementById('marine-row-min').value) || 0;
      const rowSec = parseInt(document.getElementById('marine-row-sec').value) || 0;
      const rowSeconds = (rowMin * 60) + rowSec;
      if (rowSeconds > 0) {
        cardioScore = Calculator.calculateRow(gender, ageBracket, rowSeconds);
      }
      document.getElementById('row-score').textContent = `${cardioScore} pts`;
    }

    // Total
    const total = upperScore + plankScore + cardioScore;
    document.getElementById('pft-total').textContent = total;
    document.getElementById('pft-header-score').textContent = `${total} pts`;

    // Update header score color
    const headerScore = document.getElementById('pft-header-score');
    headerScore.classList.remove('section__score--success', 'section__score--warning', 'section__score--error');
    if (total >= 235) {
      headerScore.classList.add('section__score--success');
    } else if (total >= 150) {
      // default color
    } else if (total > 0) {
      headerScore.classList.add('section__score--error');
    }

    // Classification
    const classification = Calculator.getClassification(total);
    const classEl = document.getElementById('pft-class');
    const hasScores = upperScore > 0 || plankScore > 0 || cardioScore > 0;

    if (hasScores) {
      classEl.textContent = `${classification.class} Class`;
    } else {
      classEl.textContent = 'Enter scores above';
    }

    // Store current PFT result
    this.currentPFT = {
      upperBody: {
        score: upperScore,
        isPullups: this.upperEvent === 'pullups',
        value: this.upperEvent === 'pullups' ?
          (parseInt(document.getElementById('marine-pullups').value) || 0) :
          (parseInt(document.getElementById('marine-pushups').value) || 0)
      },
      plank: { score: plankScore, time: `${plankMin}:${String(plankSec).padStart(2, '0')}` },
      cardio: {
        score: cardioScore,
        isRun: this.cardioEvent === 'run',
        time: this.cardioEvent === 'run' ?
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
    document.getElementById('cft-header-score').textContent = `${total} pts`;

    // Update header score color
    const headerScore = document.getElementById('cft-header-score');
    headerScore.classList.remove('section__score--success', 'section__score--warning', 'section__score--error');
    if (total >= 235) {
      headerScore.classList.add('section__score--success');
    } else if (total >= 150) {
      // default color
    } else if (total > 0) {
      headerScore.classList.add('section__score--error');
    }

    // Classification
    const classification = Calculator.getClassification(total);
    const classEl = document.getElementById('cft-class');
    const hasScores = mtcScore > 0 || alScore > 0 || manufScore > 0;

    if (hasScores) {
      const passStatus = total >= 150 ? 'PASS' : 'FAIL';
      classEl.textContent = `${classification.class} Class - ${passStatus}`;
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
      phaDate: document.getElementById('marine-pha')?.value || '',

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

    // Scroll to worksheet
    document.getElementById('worksheet-section').scrollIntoView({ behavior: 'smooth' });
  },

  /**
   * Render the marines list
   */
  renderMarinesList() {
    const listEl = document.getElementById('marines-list');
    const countBadge = document.getElementById('marine-count-badge');
    const actionsEl = document.getElementById('worksheet-actions');

    countBadge.textContent = this.marines.length;
    actionsEl.style.display = this.marines.length > 0 ? 'flex' : 'none';

    if (this.marines.length === 0) {
      listEl.innerHTML = `
        <div class="empty-state">
          <div class="empty-state__icon">&#128221;</div>
          <div class="empty-state__text">No Marines added yet</div>
        </div>
      `;
      return;
    }

    let html = '<table class="marines-table"><thead><tr>';
    html += '<th>Marine</th><th>PFT</th><th>CFT</th><th></th>';
    html += '</tr></thead><tbody>';

    this.marines.forEach((marine) => {
      const pftClass = marine.pftTotal >= 235 ? 'text-success' : marine.pftTotal >= 150 ? '' : 'text-error';
      const cftClass = marine.cftTotal >= 235 ? 'text-success' : marine.cftTotal >= 150 ? '' : 'text-error';

      html += `
        <tr>
          <td data-label="Marine">
            <div class="marine-name">${marine.rank} ${marine.lastName}, ${marine.firstName}</div>
            <div class="marine-details">${marine.gender === 'male' ? 'M' : 'F'} / ${marine.age}yo</div>
          </td>
          <td data-label="PFT" class="font-bold ${pftClass}">${marine.pftTotal}</td>
          <td data-label="CFT" class="font-bold ${cftClass}">${marine.cftTotal || '--'}</td>
          <td data-label="">
            <button class="btn btn--ghost btn--sm" onclick="App.removeMarine('${marine.id}')">Remove</button>
          </td>
        </tr>
      `;
    });

    html += '</tbody></table>';
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

    // Reset count inputs
    document.getElementById('marine-pullups').value = '0';
    document.getElementById('marine-pushups').value = '0';
    document.getElementById('marine-al').value = '0';

    // Reset time inputs
    document.getElementById('marine-plank-min').value = '0';
    document.getElementById('marine-plank-sec').value = '00';
    document.getElementById('marine-run-min').value = '0';
    document.getElementById('marine-run-sec').value = '00';
    document.getElementById('marine-row-min').value = '0';
    document.getElementById('marine-row-sec').value = '00';
    document.getElementById('marine-mtc-min').value = '0';
    document.getElementById('marine-mtc-sec').value = '00';
    document.getElementById('marine-manuf-min').value = '0';
    document.getElementById('marine-manuf-sec').value = '00';

    // Reset events to defaults
    this.setUpperEvent('pullups');
    this.setCardioEvent('run');

    // Reset score displays
    document.getElementById('pullups-score').textContent = '0 pts';
    document.getElementById('pushups-score').textContent = '0 pts';
    document.getElementById('plank-score').textContent = '0 pts';
    document.getElementById('run-score').textContent = '0 pts';
    document.getElementById('row-score').textContent = '0 pts';
    document.getElementById('pft-total').textContent = '0';
    document.getElementById('pft-header-score').textContent = '0 pts';
    document.getElementById('pft-class').textContent = 'Enter scores above';

    document.getElementById('mtc-score').textContent = '0 pts';
    document.getElementById('al-score').textContent = '0 pts';
    document.getElementById('manuf-score').textContent = '0 pts';
    document.getElementById('cft-total').textContent = '0';
    document.getElementById('cft-header-score').textContent = '0 pts';
    document.getElementById('cft-class').textContent = 'Enter scores above';

    // Reset checkboxes
    document.getElementById('marine-altitude').checked = false;
    document.getElementById('marine-cft-altitude').checked = false;

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
   * Preview NAVMC 11622 PDF
   */
  previewNAVMC() {
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

    // Generate PDF and show in modal
    const doc = NAVMCGenerator.generate(sessionData);
    const pdfDataUri = doc.output('datauristring');

    const modal = document.getElementById('preview-modal');
    const content = document.getElementById('preview-content');

    content.innerHTML = `
      <iframe
        src="${pdfDataUri}"
        style="width: 100%; height: 70vh; min-height: 400px; border: 1px solid var(--border-light); border-radius: var(--radius-md);"
      ></iframe>
      <div class="flex gap-3 mt-4 justify-center">
        <button class="btn btn--primary" onclick="App.generateNAVMC(); App.closePreview();">Download PDF</button>
        <button class="btn btn--outline" onclick="App.closePreview();">Close</button>
      </div>
    `;

    modal.classList.remove('hidden');
    modal.style.display = 'flex';
  },

  /**
   * Close preview modal
   */
  closePreview() {
    const modal = document.getElementById('preview-modal');
    modal.classList.add('hidden');
    modal.style.display = 'none';
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
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => App.init());
