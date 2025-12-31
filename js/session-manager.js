/**
 * PFT/CFT Proctor - Session Manager
 * Handles Marines list, session storage, auto-save
 *
 * Version: 2.0
 * Author: Jesse Morgan
 */

const SessionManager = {
  // Marines in current session
  marines: [],

  // Auto-save timer
  autoSaveTimer: null,
  AUTO_SAVE_INTERVAL: 2000, // 2 seconds like navalletterformat

  // Storage key
  STORAGE_KEY: 'navmc-session',

  /**
   * Initialize session manager
   */
  init() {
    this.loadSession();
    this.startAutoSave();
    console.log('SessionManager initialized');
  },

  /**
   * Start auto-save timer
   */
  startAutoSave() {
    // Clear existing timer
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
    }

    // Save every 2 seconds if there are changes
    this.autoSaveTimer = setInterval(() => {
      this.saveSession();
    }, this.AUTO_SAVE_INTERVAL);

    // Also save on visibility change (user switching tabs)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.saveSession();
      }
    });

    // Save before unload
    window.addEventListener('beforeunload', () => {
      this.saveSession();
    });
  },

  /**
   * Add a Marine to the session
   * @param {Object} marineData - Marine data from form
   * @returns {boolean} Success
   */
  addMarine(marineData) {
    if (!marineData.lastName || !marineData.firstName) {
      Utils.showStatus('error', 'Please enter Marine name (First and Last required)');
      return false;
    }

    if (!marineData.age || marineData.age < 17) {
      Utils.showStatus('error', 'Please enter a valid Date of Birth');
      return false;
    }

    const marine = {
      id: Utils.generateId(),
      ...marineData,
      addedAt: new Date().toISOString()
    };

    this.marines.push(marine);
    this.saveSession();
    this.renderMarinesList();

    Utils.showStatus('success', `Added ${marine.rank} ${marine.lastName}`);
    return true;
  },

  /**
   * Remove a Marine from the session
   * @param {string} id - Marine ID
   */
  removeMarine(id) {
    const marine = this.marines.find(m => m.id === id);
    this.marines = this.marines.filter(m => m.id !== id);
    this.saveSession();
    this.renderMarinesList();

    if (marine) {
      Utils.showStatus('info', `Removed ${marine.rank} ${marine.lastName}`);
    }
  },

  /**
   * Clear all Marines
   */
  clearAll() {
    if (this.marines.length === 0) return;

    if (confirm(`Remove all ${this.marines.length} Marines from the worksheet?`)) {
      this.marines = [];
      this.saveSession();
      this.renderMarinesList();
      Utils.showStatus('info', 'Worksheet cleared');
    }
  },

  /**
   * Get all Marines
   * @returns {Array}
   */
  getMarines() {
    return this.marines;
  },

  /**
   * Get Marine count
   * @returns {number}
   */
  getCount() {
    return this.marines.length;
  },

  /**
   * Render the Marines list in the UI
   */
  renderMarinesList() {
    const listEl = Utils.$('marines-list');
    const countBadge = Utils.$('marine-count-badge');
    const actionsEl = Utils.$('worksheet-actions');

    if (countBadge) countBadge.textContent = this.marines.length;
    if (actionsEl) actionsEl.style.display = this.marines.length > 0 ? 'flex' : 'none';

    if (!listEl) return;

    if (this.marines.length === 0) {
      listEl.innerHTML = `
        <div class="empty-state">
          <div class="empty-state__icon">📋</div>
          <div class="empty-state__text">No Marines added yet</div>
          <button type="button" class="btn btn--outline btn--sm mt-3" onclick="App.loadExample()">
            Load Example Roster
          </button>
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
          <td data-label="PFT" class="font-bold ${pftClass}">${marine.pftTotal || 0}</td>
          <td data-label="CFT" class="font-bold ${cftClass}">${marine.cftTotal || '--'}</td>
          <td data-label="">
            <button class="btn btn--ghost btn--sm" onclick="SessionManager.removeMarine('${marine.id}')" aria-label="Remove ${marine.lastName}">×</button>
          </td>
        </tr>
      `;
    });

    html += '</tbody></table>';
    listEl.innerHTML = html;

    // Dispatch event for preview
    document.dispatchEvent(new CustomEvent('marinesUpdated'));
  },

  /**
   * Save session to localStorage
   */
  saveSession() {
    const session = {
      unit: Utils.getValue('session-unit'),
      date: Utils.getValue('session-date'),
      monitor: Utils.getValue('session-monitor'),
      marines: this.marines,
      savedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(session));
    } catch (e) {
      console.warn('Failed to save session:', e);
    }
  },

  /**
   * Load session from localStorage
   */
  loadSession() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (!saved) return;

      const session = JSON.parse(saved);

      if (session.unit) Utils.setValue('session-unit', session.unit);
      if (session.date) Utils.setValue('session-date', session.date);
      if (session.monitor) Utils.setValue('session-monitor', session.monitor);
      if (session.marines) this.marines = session.marines;

      this.renderMarinesList();

      console.log(`Restored session with ${this.marines.length} Marines`);
    } catch (e) {
      console.warn('Failed to load session:', e);
    }
  },

  /**
   * Export session to file
   */
  exportSession() {
    const session = {
      unit: Utils.getValue('session-unit'),
      date: Utils.getValue('session-date'),
      monitor: Utils.getValue('session-monitor'),
      marines: this.marines,
      exportedAt: new Date().toISOString(),
      version: '2.0'
    };

    const blob = new Blob([JSON.stringify(session, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pft-cft-session-${session.date || 'draft'}.json`;
    a.click();
    URL.revokeObjectURL(url);

    Utils.showStatus('success', 'Session exported');
  },

  /**
   * Import session from file
   * @param {File} file - JSON file
   */
  async importSession(file) {
    try {
      const text = await file.text();
      const session = JSON.parse(text);

      if (session.unit) Utils.setValue('session-unit', session.unit);
      if (session.date) Utils.setValue('session-date', session.date);
      if (session.monitor) Utils.setValue('session-monitor', session.monitor);
      if (session.marines) {
        this.marines = session.marines;
        this.saveSession();
        this.renderMarinesList();
      }

      Utils.showStatus('success', `Imported ${this.marines.length} Marines`);
    } catch (e) {
      Utils.showStatus('error', 'Failed to import session file');
      console.error('Import error:', e);
    }
  },

  /**
   * Get session data for PDF generation
   * @returns {Object}
   */
  getSessionData() {
    return {
      unit: Utils.getValue('session-unit'),
      date: Utils.getValue('session-date'),
      monitor: Utils.getValue('session-monitor'),
      marines: this.marines
    };
  },

  /**
   * Load example roster for demonstration
   */
  loadExampleRoster() {
    // Confirm if existing data
    if (this.marines.length > 0) {
      if (!confirm('This will replace your current worksheet. Continue?')) {
        return;
      }
    }

    // Set example session info
    const today = new Date().toISOString().split('T')[0];
    Utils.setValue('session-unit', '1st Bn, 5th Marines');
    Utils.setValue('session-date', today);
    Utils.setValue('session-monitor', 'SSgt Rodriguez');

    // Example Marines with varied scores, ages, genders
    const exampleMarines = [
      {
        id: Utils.generateId(),
        rank: 'Sgt', lastName: 'Johnson', firstName: 'Marcus', mi: 'A',
        edipi: '1234567890', dob: '1995-03-15', gender: 'male', age: 29,
        height: 71, weight: 185,
        upperEvent: 'pullups', pullups: 23, pushups: 0,
        plankMin: 4, plankSec: 15,
        cardioEvent: 'run', runMin: 19, runSec: 30, rowMin: 0, rowSec: 0,
        altitude: false,
        pftUpper: 100, pftPlank: 100, pftCardio: 98, pftTotal: 298,
        mtcMin: 2, mtcSec: 45, al: 115, manufMin: 2, manufSec: 38, cftAltitude: false,
        cftMtc: 100, cftAl: 100, cftManuf: 100, cftTotal: 300,
        pftClass: '1st Class', cftClass: '1st Class',
        addedAt: new Date().toISOString()
      },
      {
        id: Utils.generateId(),
        rank: 'LCpl', lastName: 'Williams', firstName: 'Sarah', mi: 'E',
        edipi: '2345678901', dob: '2000-07-22', gender: 'female', age: 24,
        height: 65, weight: 140,
        upperEvent: 'pullups', pullups: 11, pushups: 0,
        plankMin: 3, plankSec: 45,
        cardioEvent: 'run', runMin: 23, runSec: 15, rowMin: 0, rowSec: 0,
        altitude: false,
        pftUpper: 100, pftPlank: 80, pftCardio: 92, pftTotal: 272,
        mtcMin: 3, mtcSec: 20, al: 75, manufMin: 3, manufSec: 15, cftAltitude: false,
        cftMtc: 95, cftAl: 90, cftManuf: 88, cftTotal: 273,
        pftClass: '1st Class', cftClass: '1st Class',
        addedAt: new Date().toISOString()
      },
      {
        id: Utils.generateId(),
        rank: 'Cpl', lastName: 'Martinez', firstName: 'Diego', mi: 'R',
        edipi: '3456789012', dob: '1998-11-08', gender: 'male', age: 26,
        height: 68, weight: 175,
        upperEvent: 'pullups', pullups: 18, pushups: 0,
        plankMin: 3, plankSec: 30,
        cardioEvent: 'run', runMin: 21, runSec: 45, rowMin: 0, rowSec: 0,
        altitude: false,
        pftUpper: 90, pftPlank: 75, pftCardio: 85, pftTotal: 250,
        mtcMin: 3, mtcSec: 05, al: 98, manufMin: 2, manufSec: 55, cftAltitude: false,
        cftMtc: 88, cftAl: 85, cftManuf: 92, cftTotal: 265,
        pftClass: '1st Class', cftClass: '1st Class',
        addedAt: new Date().toISOString()
      },
      {
        id: Utils.generateId(),
        rank: 'PFC', lastName: 'Thompson', firstName: 'James', mi: 'L',
        edipi: '4567890123', dob: '2002-04-30', gender: 'male', age: 22,
        height: 72, weight: 195,
        upperEvent: 'pushups', pullups: 0, pushups: 65,
        plankMin: 2, plankSec: 50,
        cardioEvent: 'run', runMin: 24, runSec: 00, rowMin: 0, rowSec: 0,
        altitude: false,
        pftUpper: 60, pftPlank: 55, pftCardio: 68, pftTotal: 183,
        mtcMin: 3, mtcSec: 25, al: 82, manufMin: 3, manufSec: 30, cftAltitude: false,
        cftMtc: 78, cftAl: 72, cftManuf: 75, cftTotal: 225,
        pftClass: '2nd Class', cftClass: '2nd Class',
        addedAt: new Date().toISOString()
      },
      {
        id: Utils.generateId(),
        rank: 'SSgt', lastName: 'Chen', firstName: 'Michelle', mi: 'K',
        edipi: '5678901234', dob: '1990-09-12', gender: 'female', age: 34,
        height: 64, weight: 135,
        upperEvent: 'pullups', pullups: 8, pushups: 0,
        plankMin: 4, plankSec: 00,
        cardioEvent: 'run', runMin: 25, runSec: 30, rowMin: 0, rowSec: 0,
        altitude: false,
        pftUpper: 85, pftPlank: 90, pftCardio: 78, pftTotal: 253,
        mtcMin: 3, mtcSec: 35, al: 68, manufMin: 3, manufSec: 28, cftAltitude: false,
        cftMtc: 88, cftAl: 82, cftManuf: 85, cftTotal: 255,
        pftClass: '1st Class', cftClass: '1st Class',
        addedAt: new Date().toISOString()
      },
      {
        id: Utils.generateId(),
        rank: 'GySgt', lastName: 'Davis', firstName: 'Robert', mi: 'W',
        edipi: '6789012345', dob: '1985-01-25', gender: 'male', age: 39,
        height: 70, weight: 190,
        upperEvent: 'pullups', pullups: 15, pushups: 0,
        plankMin: 3, plankSec: 20,
        cardioEvent: 'run', runMin: 23, runSec: 30, rowMin: 0, rowSec: 0,
        altitude: false,
        pftUpper: 78, pftPlank: 68, pftCardio: 75, pftTotal: 221,
        mtcMin: 3, mtcSec: 15, al: 88, manufMin: 3, manufSec: 10, cftAltitude: false,
        cftMtc: 82, cftAl: 78, cftManuf: 80, cftTotal: 240,
        pftClass: '2nd Class', cftClass: '1st Class',
        addedAt: new Date().toISOString()
      },
      {
        id: Utils.generateId(),
        rank: 'Capt', lastName: 'Anderson', firstName: 'Emily', mi: 'J',
        edipi: '7890123456', dob: '1993-06-18', gender: 'female', age: 31,
        height: 66, weight: 145,
        upperEvent: 'pullups', pullups: 10, pushups: 0,
        plankMin: 4, plankSec: 30,
        cardioEvent: 'run', runMin: 22, runSec: 45, rowMin: 0, rowSec: 0,
        altitude: false,
        pftUpper: 95, pftPlank: 100, pftCardio: 95, pftTotal: 290,
        mtcMin: 3, mtcSec: 10, al: 82, manufMin: 3, manufSec: 05, cftAltitude: false,
        cftMtc: 100, cftAl: 95, cftManuf: 95, cftTotal: 290,
        pftClass: '1st Class', cftClass: '1st Class',
        addedAt: new Date().toISOString()
      },
      {
        id: Utils.generateId(),
        rank: 'Pvt', lastName: 'Garcia', firstName: 'Anthony', mi: 'M',
        edipi: '8901234567', dob: '2003-12-05', gender: 'male', age: 21,
        height: 69, weight: 170,
        upperEvent: 'pullups', pullups: 12, pushups: 0,
        plankMin: 2, plankSec: 15,
        cardioEvent: 'run', runMin: 26, runSec: 30, rowMin: 0, rowSec: 0,
        altitude: false,
        pftUpper: 60, pftPlank: 40, pftCardio: 55, pftTotal: 155,
        mtcMin: 3, mtcSec: 45, al: 72, manufMin: 3, manufSec: 45, cftAltitude: false,
        cftMtc: 68, cftAl: 65, cftManuf: 62, cftTotal: 195,
        pftClass: '3rd Class', cftClass: '2nd Class',
        addedAt: new Date().toISOString()
      }
    ];

    this.marines = exampleMarines;
    this.saveSession();
    this.renderMarinesList();

    Utils.showStatus('success', `Loaded ${exampleMarines.length} example Marines`);
  }
};

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SessionManager;
}
