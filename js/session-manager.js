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
  }
};

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SessionManager;
}
