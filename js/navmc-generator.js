/**
 * NAVMC 11622 PDF Generator
 * Creates an exact replica of the official PFT/CFT Performance Worksheet
 * Based on NAVMC 11622 (Rev. 01-20) (EF)
 */

const NAVMCGenerator = {
  // Page dimensions (Letter size in mm, landscape)
  PAGE_WIDTH: 279.4,  // 11 inches
  PAGE_HEIGHT: 215.9, // 8.5 inches
  MARGIN: 12.7,       // 0.5 inch margins

  // Colors matching official form exactly
  COLORS: {
    black: [0, 0, 0],
    darkBlue: [0, 32, 96],
    headerTan: [253, 233, 217],    // Tan/cream color for group headers
    colHeaderGray: [242, 242, 242], // Light gray for column headers
    white: [255, 255, 255]
  },

  /**
   * Generate the complete NAVMC 11622 PDF
   */
  generate(sessionData) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'letter'
    });

    // Page 1: Privacy Act Statement
    this.drawPrivacyPage(doc);

    // Page 2: Worksheet
    doc.addPage();
    this.drawWorksheetPage(doc, sessionData);

    return doc;
  },

  /**
   * Page 1 - Privacy Act Statement (exact match to official form)
   */
  drawPrivacyPage(doc) {
    const pageWidth = this.PAGE_WIDTH;
    const margin = this.MARGIN;
    const contentWidth = pageWidth - (margin * 2);
    const centerX = pageWidth / 2;

    // MCO reference (top right) - bold
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('MCO 6100.13', pageWidth - margin, 18, { align: 'right' });

    // Main title - large, bold, centered
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('PFT/CFT PERFORMANCE WORKSHEET', centerX, 45, { align: 'center' });

    // Privacy Act Statement header
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('PRIVACY ACT STATEMENT', centerX, 75, { align: 'center' });

    // Intro paragraph (comes BEFORE the blue line)
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const intro = 'In accordance with the Privacy Act of 1974 (5 U.S.C. 552a/Public Law 93-579), this Notice informs you of the purpose for collection of information on this form. Please read it before completing the form.';
    doc.text(intro, margin, 90, { maxWidth: contentWidth });

    // Dark blue horizontal line (thick)
    doc.setDrawColor(...this.COLORS.darkBlue);
    doc.setLineWidth(2);
    doc.line(margin, 105, pageWidth - margin, 105);
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.1);

    // Authority section
    let yPos = 118;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('AUTHORITY:', margin, yPos);
    doc.setFont('helvetica', 'normal');
    const authority = '10 U.S.C. 5013, Secretary of the Navy; 10 U.S.C. 5041, Headquarters, Marine Corps; 10 U.S.C. 1074f, Medical Tracking System for Members Deployed Overseas; 32 CFR 64.4, Management and Mobilization; DoDI 1215.13, Reserve Component (RC) Member Participation Policy; DoDI 3001.02, Personnel Accountability in Conjunction with Natural and Manmade Disasters; CJCSM 3150.13B, Joint Reporting Structure Personnel Manual; DoDI 6490.03, Deployment Health; SECNAVINST 1770.5, Management and Disposition of Line of Duty Benefits for Members of the Navy and Marine Corps Reserve; MCO 7220.50 B, Marine Corps Policy for paying Reserve Marines; E.O. 9397 (SSN), as amended; and SORN M01040-3.';
    doc.text(authority, margin + 24, yPos, { maxWidth: contentWidth - 24 });

    // Principal Purpose
    yPos = 140;
    doc.setFont('helvetica', 'bold');
    doc.text('PRINCIPAL PURPOSE:', margin, yPos);
    doc.setFont('helvetica', 'normal');
    const purpose = 'Information collected by this form will be used to record physical fitness performance data for compliance with the Marine Corps Physical Fitness and Combat Fitness program and will be entered in Marine Corps Total Force System (MCTFS).';
    doc.text(purpose, margin + 40, yPos, { maxWidth: contentWidth - 40 });

    // Routine Uses
    yPos = 155;
    doc.setFont('helvetica', 'bold');
    doc.text('ROUTINE USES:', margin, yPos);
    doc.setFont('helvetica', 'normal');
    const uses = "Information will be accessed by Commander's, Senior Enlisted Advisors, Officers in Charge, Force Fitness Instructor, Command Physical Training Representative, and S-3 command designated personnel with a need to know in order to comply with the Marine Corps' Body Composition and Military Appearance Program. A complete list and explanation of the applicable routine uses is published in the authorizing SORN available at: http://dpcld.defense.gov/Privacy/SORNsIndex/DOD-wide-SORN-Article-View/Article/570625/m01040-3/).";
    doc.text(uses, margin + 32, yPos, { maxWidth: contentWidth - 32 });

    // Disclosure
    yPos = 180;
    doc.setFont('helvetica', 'bold');
    doc.text('DISCLOSURE:', margin, yPos);
    doc.setFont('helvetica', 'normal');
    const disclosure = 'Voluntary; however, failure to provide the information may result in administrative action that limits promotion, retention, and assignment.';
    doc.text(disclosure, margin + 27, yPos, { maxWidth: contentWidth - 27 });

    // Footer
    this.drawFooter(doc, 1);
  },

  /**
   * Page 2 - The Worksheet
   */
  drawWorksheetPage(doc, sessionData) {
    const { unit, date, monitor, marines } = sessionData;
    const pageWidth = this.PAGE_WIDTH;
    const margin = this.MARGIN;
    const contentWidth = pageWidth - (margin * 2);

    // MCO reference (top right) - bold
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('MCO 6100.13', pageWidth - margin, 12, { align: 'right' });

    // Title - NOT all caps like page 1
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('PFT/CFT Performance Worksheet', pageWidth / 2, 20, { align: 'center' });

    // Unit / Date / Monitor header boxes (matching exact proportions)
    const headerY = 26;
    const headerHeight = 10;
    // Unit is small, Date is large, Monitor is medium
    const unitWidth = contentWidth * 0.15;
    const dateWidth = contentWidth * 0.60;
    const monitorWidth = contentWidth * 0.25;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setLineWidth(0.3);

    // Unit box
    doc.rect(margin, headerY, unitWidth, headerHeight);
    doc.text('Unit', margin + 2, headerY + 4);
    doc.setFont('helvetica', 'bold');
    doc.text(unit || '', margin + 12, headerY + 7);

    // Date box
    doc.setFont('helvetica', 'normal');
    doc.rect(margin + unitWidth, headerY, dateWidth, headerHeight);
    doc.text('Date', margin + unitWidth + 2, headerY + 4);
    doc.setFont('helvetica', 'bold');
    doc.text(this.formatDate(date), margin + unitWidth + (dateWidth / 2), headerY + 7, { align: 'center' });

    // Monitor box
    doc.setFont('helvetica', 'normal');
    doc.rect(margin + unitWidth + dateWidth, headerY, monitorWidth, headerHeight);
    doc.text('Monitor', margin + unitWidth + dateWidth + 2, headerY + 4);
    doc.setFont('helvetica', 'bold');
    doc.text(monitor || '', margin + unitWidth + dateWidth + 18, headerY + 7);

    // Draw the main data table
    this.drawDataTable(doc, marines, headerY + headerHeight + 2);

    // Note
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text('*Note: Risk Factor Worksheet required for Marines age 46 and over.', margin, this.PAGE_HEIGHT - 20);

    // Footer
    this.drawFooter(doc, 2);
  },

  /**
   * Draw the main data table matching official form exactly
   * 27 columns total:
   * - Individual Data: 9 columns
   * - PFT Performance Data: 11 columns (only 3 Score columns)
   * - CFT Performance Data: 7 columns (MTC, Time, AL, Reps, MANUF, Time, Pass/Fail)
   */
  drawDataTable(doc, marines, startY) {
    const margin = this.MARGIN;
    const tableWidth = this.PAGE_WIDTH - (margin * 2);

    // Column widths matching official form proportions
    // Total = ~254mm
    const cols = {
      // Individual Data (9 columns)
      rank: 8,
      firstName: 14,
      mi: 5,
      lastName: 14,
      edipi: 14,
      age: 8,
      gender: 10,
      height: 10,
      weight: 10,
      // PFT Performance Data (11 columns - only 3 Score columns)
      phaDate: 10,
      pullUps: 8,
      pushUps: 8,
      upperScore: 9,    // Score for Pull Ups OR Push Ups
      crunch: 10,
      plank: 9,
      coreScore: 9,     // Score for Crunch/Plank
      run: 14,
      row: 10,
      cardioScore: 9,   // Score for Run OR Row
      pftTotal: 12,
      // CFT Performance Data (7 columns)
      mtc: 8,
      mtcTime: 9,
      al: 6,
      alReps: 8,
      manuf: 11,
      manufTime: 9,
      passFail: 12
    };

    // Calculate x positions
    let x = margin;
    const colPositions = {};
    for (const [key, width] of Object.entries(cols)) {
      colPositions[key] = { x, width };
      x += width;
    }

    // Group header row (tan/cream background)
    const groupHeaderY = startY;
    const groupHeaderHeight = 6;

    // Calculate group widths
    const indDataWidth = cols.rank + cols.firstName + cols.mi + cols.lastName + cols.edipi + cols.age + cols.gender + cols.height + cols.weight;
    const pftDataWidth = cols.phaDate + cols.pullUps + cols.pushUps + cols.upperScore + cols.crunch + cols.plank + cols.coreScore + cols.run + cols.row + cols.cardioScore + cols.pftTotal;
    const cftDataWidth = cols.mtc + cols.mtcTime + cols.al + cols.alReps + cols.manuf + cols.manufTime + cols.passFail;

    doc.setFillColor(...this.COLORS.headerTan);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setLineWidth(0.2);

    // Individual Data header
    doc.rect(margin, groupHeaderY, indDataWidth, groupHeaderHeight, 'FD');
    doc.text('Individual Data', margin + (indDataWidth / 2), groupHeaderY + 4, { align: 'center' });

    // PFT Performance Data header
    doc.rect(margin + indDataWidth, groupHeaderY, pftDataWidth, groupHeaderHeight, 'FD');
    doc.text('PFT Performance Data', margin + indDataWidth + (pftDataWidth / 2), groupHeaderY + 4, { align: 'center' });

    // CFT Performance Data header
    doc.rect(margin + indDataWidth + pftDataWidth, groupHeaderY, cftDataWidth, groupHeaderHeight, 'FD');
    doc.text('CFT Performance Data', margin + indDataWidth + pftDataWidth + (cftDataWidth / 2), groupHeaderY + 4, { align: 'center' });

    // Column header row (light gray background)
    const colHeaderY = groupHeaderY + groupHeaderHeight;
    const colHeaderHeight = 10;

    doc.setFillColor(...this.COLORS.colHeaderGray);
    doc.setFontSize(5.5);

    // Column headers matching exact official form layout
    const headers = [
      // Individual Data
      { key: 'rank', label: 'Rank' },
      { key: 'firstName', label: ['First', 'Name'] },
      { key: 'mi', label: 'MI' },
      { key: 'lastName', label: ['Last', 'Name'] },
      { key: 'edipi', label: 'EDIPI' },
      { key: 'age', label: 'Age*' },
      { key: 'gender', label: 'Gender' },
      { key: 'height', label: 'Height' },
      { key: 'weight', label: 'Weight' },
      // PFT Performance Data (11 columns, 3 Score columns)
      { key: 'phaDate', label: ['PHA', 'Date'] },
      { key: 'pullUps', label: ['Pull', 'Ups'] },
      { key: 'pushUps', label: ['Push', 'Ups'] },
      { key: 'upperScore', label: 'Score' },
      { key: 'crunch', label: 'Crunch' },
      { key: 'plank', label: 'Plank' },
      { key: 'coreScore', label: 'Score' },
      { key: 'run', label: ['3 Mile', 'Run'] },
      { key: 'row', label: '5K Row' },
      { key: 'cardioScore', label: 'Score' },
      { key: 'pftTotal', label: ['PFT', 'Total'] },
      // CFT Performance Data (7 columns)
      { key: 'mtc', label: 'MTC' },
      { key: 'mtcTime', label: 'Time' },
      { key: 'al', label: 'AL' },
      { key: 'alReps', label: 'Reps' },
      { key: 'manuf', label: 'MANUF' },
      { key: 'manufTime', label: 'Time' },
      { key: 'passFail', label: ['Pass/', 'Fail'] }
    ];

    headers.forEach(h => {
      const col = colPositions[h.key];
      doc.rect(col.x, colHeaderY, col.width, colHeaderHeight, 'FD');

      if (Array.isArray(h.label)) {
        doc.text(h.label[0], col.x + col.width / 2, colHeaderY + 3.5, { align: 'center' });
        doc.text(h.label[1], col.x + col.width / 2, colHeaderY + 7, { align: 'center' });
      } else {
        doc.text(h.label, col.x + col.width / 2, colHeaderY + 5.5, { align: 'center' });
      }
    });

    // Data rows
    const dataStartY = colHeaderY + colHeaderHeight;
    const rowHeight = 6;
    const maxRows = 22;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.5);

    for (let i = 0; i < maxRows; i++) {
      const rowY = dataStartY + (i * rowHeight);
      const marine = marines[i] || null;

      // Draw all cells for this row
      Object.entries(colPositions).forEach(([key, col]) => {
        doc.rect(col.x, rowY, col.width, rowHeight);

        if (marine) {
          const value = this.getCellValue(marine, key);
          if (value) {
            doc.text(String(value), col.x + col.width / 2, rowY + 4, { align: 'center' });
          }
        }
      });
    }
  },

  /**
   * Get cell value for a specific column
   */
  getCellValue(marine, key) {
    // Determine which upper body event was used
    const usedPullUps = marine.pullUps && marine.pullUps > 0;
    const usedPushUps = marine.pushUps && marine.pushUps > 0;

    // Determine which cardio event was used
    const usedRun = marine.runTime && marine.runTime !== '';
    const usedRow = marine.rowTime && marine.rowTime !== '';

    const mapping = {
      rank: marine.rank,
      firstName: marine.firstName,
      mi: marine.mi,
      lastName: marine.lastName,
      edipi: marine.edipi,
      age: marine.age,
      gender: marine.gender === 'male' ? 'M' : 'F',
      height: marine.height,
      weight: marine.weight,
      phaDate: this.formatShortDate(marine.phaDate),
      pullUps: marine.pullUps || '',
      pushUps: marine.pushUps || '',
      upperScore: usedPullUps ? marine.pullUpsScore : (usedPushUps ? marine.pushUpsScore : ''),
      crunch: '', // Legacy field
      plank: marine.plankTime || '',
      coreScore: marine.plankScore || '',
      run: marine.runTime || '',
      row: marine.rowTime || '',
      cardioScore: usedRun ? marine.runScore : (usedRow ? marine.rowScore : ''),
      pftTotal: marine.pftTotal || '',
      mtc: '', // Event name column (leave blank, time goes in next column)
      mtcTime: marine.mtcTime || '',
      al: '', // Event name column (leave blank, reps goes in next column)
      alReps: marine.alReps || '',
      manuf: '', // Event name column (leave blank, time goes in next column)
      manufTime: marine.manufTime || '',
      passFail: marine.cftTotal >= 150 ? 'P' : (marine.cftTotal > 0 ? 'F' : '')
    };
    return mapping[key] !== undefined ? mapping[key] : '';
  },

  /**
   * Draw page footer matching official form exactly
   */
  drawFooter(doc, pageNum) {
    const pageWidth = this.PAGE_WIDTH;
    const pageHeight = this.PAGE_HEIGHT;
    const margin = this.MARGIN;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');

    // Form number (bottom left)
    doc.setFont('helvetica', 'bold');
    doc.text('NAVMC 11622 (Rev. 01-20) (EF)', margin, pageHeight - 8);

    // FOUO notice (center, boxed)
    const fouoWidth = 130;
    const fouoX = (pageWidth - fouoWidth) / 2;
    doc.setLineWidth(0.3);
    doc.rect(fouoX, pageHeight - 15, fouoWidth, 11);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('FOR OFFICIAL USE ONLY', pageWidth / 2, pageHeight - 10.5, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.text('Privacy sensitive when filled in. Any misuse or unauthorized', pageWidth / 2, pageHeight - 7.5, { align: 'center' });
    doc.text('disclosure may result in both civil and criminal penalties.', pageWidth / 2, pageHeight - 5, { align: 'center' });

    // Page number (bottom right)
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Page ${pageNum} of 2`, pageWidth - margin, pageHeight - 10, { align: 'right' });
    doc.setFontSize(8);
    doc.text('AEM Designer 6.5', pageWidth - margin, pageHeight - 6, { align: 'right' });
  },

  /**
   * Format date as DD Mon YYYY
   */
  formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  },

  /**
   * Format date as MM/DD/YY
   */
  formatShortDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${month}/${day}/${year}`;
  },

  /**
   * Download PDF
   */
  downloadPDF(sessionData, filename = 'NAVMC_11622_PFT-CFT.pdf') {
    const doc = this.generate(sessionData);
    doc.save(filename);
  },

  /**
   * Open for printing
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
