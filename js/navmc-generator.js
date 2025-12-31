/**
 * NAVMC 11622 PDF Generator
 * Creates an exact replica of the official PFT/CFT Performance Worksheet
 * Uses jsPDF to draw the form and fill in data
 */

const NAVMCGenerator = {
  // Page dimensions (Letter size in mm)
  PAGE_WIDTH: 279.4,  // 11 inches
  PAGE_HEIGHT: 215.9, // 8.5 inches (landscape)
  MARGIN: 10,

  // Colors
  COLORS: {
    black: [0, 0, 0],
    gray: [128, 128, 128],
    lightGray: [220, 220, 220],
    headerBg: [200, 200, 200],
    white: [255, 255, 255]
  },

  /**
   * Generate the NAVMC 11622 PDF
   * @param {Object} sessionData - Session data with unit, date, monitor, and marines array
   * @returns {jsPDF} The generated PDF document
   */
  generate(sessionData) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'letter'
    });

    // Generate page 1 (Privacy Act Statement)
    this.drawPrivacyPage(doc);

    // Generate page 2 (Worksheet)
    doc.addPage();
    this.drawWorksheetPage(doc, sessionData);

    return doc;
  },

  /**
   * Generate worksheet only (skip privacy page)
   */
  generateWorksheetOnly(sessionData) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'letter'
    });

    this.drawWorksheetPage(doc, sessionData);
    return doc;
  },

  /**
   * Draw Page 1 - Privacy Act Statement
   */
  drawPrivacyPage(doc) {
    const centerX = this.PAGE_WIDTH / 2;

    // Header
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('MCO 6100.13', this.PAGE_WIDTH - this.MARGIN, 10, { align: 'right' });

    // Title
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('PFT/CFT PERFORMANCE WORKSHEET', centerX, 30, { align: 'center' });

    // Privacy Act Statement Header
    doc.setFontSize(11);
    doc.text('PRIVACY ACT STATEMENT', centerX, 50, { align: 'center' });

    // Privacy text
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const privacyIntro = 'In accordance with the Privacy Act of 1974 (5 U.S.C. 552a/Public Law 93-579), this Notice informs you of the purpose for collection of information on this form. Please read it before completing the form.';
    doc.text(privacyIntro, this.MARGIN, 65, { maxWidth: this.PAGE_WIDTH - (this.MARGIN * 2) });

    // Horizontal line
    doc.setLineWidth(0.5);
    doc.line(this.MARGIN, 80, this.PAGE_WIDTH - this.MARGIN, 80);

    // Authority section
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('AUTHORITY:', this.MARGIN, 90);
    doc.setFont('helvetica', 'normal');
    const authority = '10 U.S.C. 5013, Secretary of the Navy; 10 U.S.C. 5041, Headquarters, Marine Corps; 10 U.S.C. 1074f, Medical Tracking System for Members Deployed Overseas; 32 CFR 64.4, Management and Mobilization; DoDI 1215.13, Reserve Component (RC) Member Participation Policy; DoDI 3001.02, Personnel Accountability in Conjunction with Natural and Manmade Disasters; CJCSM 3150.13B, Joint Reporting Structure Personnel Manual; DoDI 6490.03, Deployment Health; SECNAVINST 1770.5, Management and Disposition of Line of Duty Benefits for Members of the Navy and Marine Corps Reserve; MCO 7220.50 B, Marine Corps Policy for paying Reserve Marines; E.O. 9397 (SSN), as amended; and SORN M01040-3.';
    doc.text(authority, this.MARGIN + 22, 90, { maxWidth: this.PAGE_WIDTH - (this.MARGIN * 2) - 22 });

    // Principal Purpose
    doc.setFont('helvetica', 'bold');
    doc.text('PRINCIPAL PURPOSE:', this.MARGIN, 115);
    doc.setFont('helvetica', 'normal');
    const purpose = 'Information collected by this form will be used to record physical fitness performance data for compliance with the Marine Corps Physical Fitness and Combat Fitness program and will be entered in Marine Corps Total Force System (MCTFS).';
    doc.text(purpose, this.MARGIN + 35, 115, { maxWidth: this.PAGE_WIDTH - (this.MARGIN * 2) - 35 });

    // Routine Uses
    doc.setFont('helvetica', 'bold');
    doc.text('ROUTINE USES:', this.MARGIN, 135);
    doc.setFont('helvetica', 'normal');
    const uses = "Information will be accessed by Commander's, Senior Enlisted Advisors, Officers in Charge, Force Fitness Instructor, Command Physical Training Representative, and S-3 command designated personnel with a need to know in order to comply with the Marine Corps' Body Composition and Military Appearance Program.";
    doc.text(uses, this.MARGIN + 28, 135, { maxWidth: this.PAGE_WIDTH - (this.MARGIN * 2) - 28 });

    // Disclosure
    doc.setFont('helvetica', 'bold');
    doc.text('DISCLOSURE:', this.MARGIN, 160);
    doc.setFont('helvetica', 'normal');
    const disclosure = 'Voluntary; however, failure to provide the information may result in administrative action that limits promotion, retention, and assignment.';
    doc.text(disclosure, this.MARGIN + 25, 160, { maxWidth: this.PAGE_WIDTH - (this.MARGIN * 2) - 25 });

    // Footer
    this.drawFooter(doc, 1);
  },

  /**
   * Draw Page 2 - The actual worksheet
   */
  drawWorksheetPage(doc, sessionData) {
    const { unit, date, monitor, marines } = sessionData;

    // Header
    doc.setFontSize(8);
    doc.text('MCO 6100.13', this.PAGE_WIDTH - this.MARGIN, 8, { align: 'right' });

    // Title
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('PFT/CFT Performance Worksheet', this.PAGE_WIDTH / 2, 15, { align: 'center' });

    // Unit/Date/Monitor row
    const headerY = 22;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');

    // Unit box
    doc.rect(this.MARGIN, headerY, 60, 8);
    doc.text('Unit', this.MARGIN + 1, headerY + 3);
    doc.setFont('helvetica', 'bold');
    doc.text(unit || '', this.MARGIN + 12, headerY + 6);

    // Date box
    doc.setFont('helvetica', 'normal');
    doc.rect(this.MARGIN + 60, headerY, 60, 8);
    doc.text('Date', this.MARGIN + 61, headerY + 3);
    doc.setFont('helvetica', 'bold');
    doc.text(this.formatDate(date), this.MARGIN + 72, headerY + 6);

    // Monitor box
    doc.setFont('helvetica', 'normal');
    doc.rect(this.MARGIN + 120, headerY, 60, 8);
    doc.text('Monitor', this.MARGIN + 121, headerY + 3);
    doc.setFont('helvetica', 'bold');
    doc.text(monitor || '', this.MARGIN + 135, headerY + 6);

    // Draw the main table
    this.drawDataTable(doc, marines, 35);

    // Footer note
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text('*Note: Risk Factor Worksheet required for Marines age 46 and over.', this.MARGIN, this.PAGE_HEIGHT - 15);

    // Footer
    this.drawFooter(doc, 2);
  },

  /**
   * Draw the main data table
   */
  drawDataTable(doc, marines, startY) {
    const tableX = this.MARGIN;
    const tableWidth = this.PAGE_WIDTH - (this.MARGIN * 2);

    // Column definitions (widths in mm)
    const columns = [
      // Individual Data
      { label: 'Rank', width: 12 },
      { label: 'First Name', width: 22 },
      { label: 'MI', width: 8 },
      { label: 'Last Name', width: 22 },
      { label: 'EDIPI', width: 20 },
      { label: 'Age*', width: 10 },
      { label: 'Gender', width: 12 },
      { label: 'Height', width: 12 },
      { label: 'Weight', width: 12 },
      // PFT Performance Data
      { label: 'PHA\nDate', width: 14 },
      { label: 'Pull\nUps', width: 10 },
      { label: 'Score', width: 10, pft: true },
      { label: 'Push\nUps', width: 10 },
      { label: 'Score', width: 10, pft: true },
      { label: 'Plank', width: 12 },
      { label: 'Score', width: 10, pft: true },
      { label: '3 Mile\nRun', width: 14 },
      { label: 'Score', width: 10, pft: true },
      { label: '5K\nRow', width: 12 },
      { label: 'Score', width: 10, pft: true },
      { label: 'PFT\nTotal', width: 12, pft: true },
      // CFT Performance Data
      { label: 'MTC\nTime', width: 12 },
      { label: 'AL\nReps', width: 10 },
      { label: 'MANUF\nTime', width: 14 },
      { label: 'Pass/\nFail', width: 12 }
    ];

    // Calculate positions
    let currentX = tableX;
    columns.forEach(col => {
      col.x = currentX;
      currentX += col.width;
    });

    // Group headers
    const groupHeaderY = startY;
    const groupHeaderHeight = 6;

    // Individual Data header
    doc.setFillColor(...this.COLORS.headerBg);
    const indDataWidth = columns.slice(0, 9).reduce((sum, col) => sum + col.width, 0);
    doc.rect(tableX, groupHeaderY, indDataWidth, groupHeaderHeight, 'FD');
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text('Individual Data', tableX + indDataWidth / 2, groupHeaderY + 4, { align: 'center' });

    // PFT Performance Data header
    const pftDataWidth = columns.slice(9, 21).reduce((sum, col) => sum + col.width, 0);
    doc.rect(tableX + indDataWidth, groupHeaderY, pftDataWidth, groupHeaderHeight, 'FD');
    doc.text('PFT Performance Data', tableX + indDataWidth + pftDataWidth / 2, groupHeaderY + 4, { align: 'center' });

    // CFT Performance Data header
    const cftDataWidth = columns.slice(21).reduce((sum, col) => sum + col.width, 0);
    doc.rect(tableX + indDataWidth + pftDataWidth, groupHeaderY, cftDataWidth, groupHeaderHeight, 'FD');
    doc.text('CFT Performance Data', tableX + indDataWidth + pftDataWidth + cftDataWidth / 2, groupHeaderY + 4, { align: 'center' });

    // Column headers
    const colHeaderY = groupHeaderY + groupHeaderHeight;
    const colHeaderHeight = 10;

    doc.setFontSize(6);
    columns.forEach(col => {
      doc.setFillColor(...this.COLORS.lightGray);
      doc.rect(col.x, colHeaderY, col.width, colHeaderHeight, 'FD');

      // Handle multi-line labels
      const lines = col.label.split('\n');
      lines.forEach((line, i) => {
        doc.text(line, col.x + col.width / 2, colHeaderY + 3 + (i * 3), { align: 'center' });
      });
    });

    // Data rows
    const dataStartY = colHeaderY + colHeaderHeight;
    const rowHeight = 7;
    const maxRows = 18; // Max rows that fit on the page

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);

    for (let i = 0; i < maxRows; i++) {
      const rowY = dataStartY + (i * rowHeight);
      const marine = marines[i] || null;

      // Draw row cells
      columns.forEach(col => {
        doc.rect(col.x, rowY, col.width, rowHeight);

        if (marine) {
          const value = this.getMarineValue(marine, col.label);
          if (value) {
            doc.text(String(value), col.x + col.width / 2, rowY + 4.5, { align: 'center' });
          }
        }
      });
    }
  },

  /**
   * Get value for a specific column from marine data
   */
  getMarineValue(marine, columnLabel) {
    const label = columnLabel.replace('\n', ' ').trim();

    const mapping = {
      'Rank': marine.rank,
      'First Name': marine.firstName,
      'MI': marine.mi,
      'Last Name': marine.lastName,
      'EDIPI': marine.edipi,
      'Age*': marine.age,
      'Gender': marine.gender === 'male' ? 'M' : 'F',
      'Height': marine.height,
      'Weight': marine.weight,
      'PHA Date': marine.phaDate,
      'Pull Ups': marine.pullUps,
      'Push Ups': marine.pushUps,
      'Plank': marine.plankTime,
      '3 Mile Run': marine.runTime,
      '5K Row': marine.rowTime,
      'PFT Total': marine.pftTotal,
      'MTC Time': marine.mtcTime,
      'AL Reps': marine.alReps,
      'MANUF Time': marine.manufTime,
      'Pass/ Fail': marine.cftPassFail
    };

    // Handle score columns
    if (label === 'Score') {
      return ''; // Scores are handled separately based on position
    }

    return mapping[label] || '';
  },

  /**
   * Draw page footer
   */
  drawFooter(doc, pageNum) {
    const footerY = this.PAGE_HEIGHT - 8;

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');

    // Form number
    doc.text('NAVMC 11622 (Rev. 01-20) (EF)', this.MARGIN, footerY);

    // FOUO notice
    doc.setFontSize(6);
    const fouoText = 'FOR OFFICIAL USE ONLY\nPrivacy sensitive when filled in. Any misuse or unauthorized\ndisclosure may result in both civil and criminal penalties.';
    doc.text(fouoText, this.PAGE_WIDTH / 2, footerY - 4, { align: 'center' });

    // Page number
    doc.setFontSize(7);
    doc.text(`Page ${pageNum} of 2`, this.PAGE_WIDTH - this.MARGIN - 20, footerY);
    doc.text('AEM Designer 6.5', this.PAGE_WIDTH - this.MARGIN, footerY + 3, { align: 'right' });
  },

  /**
   * Format date for display (DD Mon YYYY)
   */
  formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = String(date.getDate()).padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  },

  /**
   * Quick method to generate and download
   */
  downloadPDF(sessionData, filename = 'NAVMC_11622_PFT-CFT.pdf') {
    const doc = this.generate(sessionData);
    doc.save(filename);
  },

  /**
   * Open PDF in new window for printing
   */
  printPDF(sessionData) {
    const doc = this.generate(sessionData);
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NAVMCGenerator;
}
