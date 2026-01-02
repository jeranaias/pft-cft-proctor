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

  // Colors matching official form
  COLORS: {
    black: [0, 0, 0],
    darkBlue: [0, 32, 96],
    headerGray: [217, 217, 217],
    lightGray: [242, 242, 242],
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
   * Page 1 - Privacy Act Statement
   */
  drawPrivacyPage(doc) {
    const pageWidth = this.PAGE_WIDTH;
    const margin = this.MARGIN;
    const contentWidth = pageWidth - (margin * 2);
    const centerX = pageWidth / 2;

    // MCO reference (top right)
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('MCO 6100.13', pageWidth - margin, 15, { align: 'right' });

    // Main title
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('PFT/CFT PERFORMANCE WORKSHEET', centerX, 35, { align: 'center' });

    // Privacy Act Statement header
    doc.setFontSize(12);
    doc.text('PRIVACY ACT STATEMENT', centerX, 55, { align: 'center' });

    // Intro paragraph
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const intro = 'In accordance with the Privacy Act of 1974 (5 U.S.C. 552a/Public Law 93-579), this Notice informs you of the purpose for collection of information on this form. Please read it before completing the form.';
    doc.text(intro, margin, 70, { maxWidth: contentWidth, align: 'justify' });

    // Dark blue horizontal line
    doc.setDrawColor(...this.COLORS.darkBlue);
    doc.setLineWidth(1.5);
    doc.line(margin, 85, pageWidth - margin, 85);
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.1);

    // Authority section
    let yPos = 95;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('AUTHORITY:', margin, yPos);
    doc.setFont('helvetica', 'normal');
    const authority = '10 U.S.C. 5013, Secretary of the Navy; 10 U.S.C. 5041, Headquarters, Marine Corps; 10 U.S.C. 1074f, Medical Tracking System for Members Deployed Overseas; 32 CFR 64.4, Management and Mobilization; DoDI 1215.13, Reserve Component (RC) Member Participation Policy; DoDI 3001.02, Personnel Accountability in Conjunction with Natural and Manmade Disasters; CJCSM 3150.13B, Joint Reporting Structure Personnel Manual; DoDI 6490.03, Deployment Health; SECNAVINST 1770.5, Management and Disposition of Line of Duty Benefits for Members of the Navy and Marine Corps Reserve; MCO 7220.50 B, Marine Corps Policy for paying Reserve Marines; E.O. 9397 (SSN), as amended; and SORN M01040-3.';
    doc.text(authority, margin + 22, yPos, { maxWidth: contentWidth - 22 });

    // Principal Purpose
    yPos = 120;
    doc.setFont('helvetica', 'bold');
    doc.text('PRINCIPAL PURPOSE:', margin, yPos);
    doc.setFont('helvetica', 'normal');
    const purpose = 'Information collected by this form will be used to record physical fitness performance data for compliance with the Marine Corps Physical Fitness and Combat Fitness program and will be entered in Marine Corps Total Force System (MCTFS).';
    doc.text(purpose, margin + 38, yPos, { maxWidth: contentWidth - 38 });

    // Routine Uses
    yPos = 135;
    doc.setFont('helvetica', 'bold');
    doc.text('ROUTINE USES:', margin, yPos);
    doc.setFont('helvetica', 'normal');
    const uses = "Information will be accessed by Commander's, Senior Enlisted Advisors, Officers in Charge, Force Fitness Instructor, Command Physical Training Representative, and S-3 command designated personnel with a need to know in order to comply with the Marine Corps' Body Composition and Military Appearance Program. A complete list and explanation of the applicable routine uses is published in the authorizing SORN available at: http://dpcld.defense.gov/Privacy/SORNsIndex/DOD-wide-SORN-Article-View/Article/570625/m01040-3/).";
    doc.text(uses, margin + 30, yPos, { maxWidth: contentWidth - 30 });

    // Disclosure
    yPos = 160;
    doc.setFont('helvetica', 'bold');
    doc.text('DISCLOSURE:', margin, yPos);
    doc.setFont('helvetica', 'normal');
    const disclosure = 'Voluntary; however, failure to provide the information may result in administrative action that limits promotion, retention, and assignment.';
    doc.text(disclosure, margin + 26, yPos, { maxWidth: contentWidth - 26 });

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

    // MCO reference (top right)
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('MCO 6100.13', pageWidth - margin, 10, { align: 'right' });

    // Title
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('PFT/CFT Performance Worksheet', pageWidth / 2, 18, { align: 'center' });

    // Unit / Date / Monitor header boxes
    const headerY = 24;
    const headerHeight = 10;
    const unitWidth = contentWidth * 0.25;
    const dateWidth = contentWidth * 0.50;
    const monitorWidth = contentWidth * 0.25;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');

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
    doc.text('*Note: Risk Factor Worksheet required for Marines age 46 and over.', margin, this.PAGE_HEIGHT - 18);

    // Footer
    this.drawFooter(doc, 2);
  },

  /**
   * Draw the main data table matching official form exactly
   */
  drawDataTable(doc, marines, startY) {
    const margin = this.MARGIN;
    const tableWidth = this.PAGE_WIDTH - (margin * 2);

    // Column widths (proportional to official form)
    // Total should equal tableWidth (~254mm)
    const cols = {
      // Individual Data (9 columns)
      rank: 11,
      firstName: 18,
      mi: 7,
      lastName: 18,
      edipi: 18,
      age: 9,
      gender: 12,
      height: 12,
      weight: 12,
      // PFT Performance Data (13 columns)
      phaDate: 12,
      pullUps: 9,
      pullScore: 10,
      pushUps: 9,
      pushScore: 10,
      crunch: 12,
      plank: 10,
      plankScore: 10,
      run: 14,
      runScore: 10,
      row: 10,
      rowScore: 10,
      pftTotal: 14,
      // CFT Performance Data (4 columns)
      mtc: 14,
      alReps: 10,
      manuf: 14,
      passFail: 13
    };

    // Calculate x positions
    let x = margin;
    const colPositions = {};
    for (const [key, width] of Object.entries(cols)) {
      colPositions[key] = { x, width };
      x += width;
    }

    // Group header row
    const groupHeaderY = startY;
    const groupHeaderHeight = 6;

    // Calculate group widths
    const indDataWidth = cols.rank + cols.firstName + cols.mi + cols.lastName + cols.edipi + cols.age + cols.gender + cols.height + cols.weight;
    const pftDataWidth = cols.phaDate + cols.pullUps + cols.pullScore + cols.pushUps + cols.pushScore + cols.crunch + cols.plank + cols.plankScore + cols.run + cols.runScore + cols.row + cols.rowScore + cols.pftTotal;
    const cftDataWidth = cols.mtc + cols.alReps + cols.manuf + cols.passFail;

    doc.setFillColor(...this.COLORS.headerGray);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');

    // Individual Data header
    doc.rect(margin, groupHeaderY, indDataWidth, groupHeaderHeight, 'FD');
    doc.text('Individual Data', margin + (indDataWidth / 2), groupHeaderY + 4, { align: 'center' });

    // PFT Performance Data header
    doc.rect(margin + indDataWidth, groupHeaderY, pftDataWidth, groupHeaderHeight, 'FD');
    doc.text('PFT Performance Data', margin + indDataWidth + (pftDataWidth / 2), groupHeaderY + 4, { align: 'center' });

    // CFT Performance Data header
    doc.rect(margin + indDataWidth + pftDataWidth, groupHeaderY, cftDataWidth, groupHeaderHeight, 'FD');
    doc.text('CFT Performance Data', margin + indDataWidth + pftDataWidth + (cftDataWidth / 2), groupHeaderY + 4, { align: 'center' });

    // Column header row (two-line headers)
    const colHeaderY = groupHeaderY + groupHeaderHeight;
    const colHeaderHeight = 10;

    doc.setFillColor(...this.COLORS.lightGray);
    doc.setFontSize(6);

    // Draw all column headers
    const headers = [
      { key: 'rank', label: 'Rank' },
      { key: 'firstName', label: 'First Name' },
      { key: 'mi', label: 'MI' },
      { key: 'lastName', label: 'Last Name' },
      { key: 'edipi', label: 'EDIPI' },
      { key: 'age', label: 'Age*' },
      { key: 'gender', label: 'Gender' },
      { key: 'height', label: 'Height' },
      { key: 'weight', label: 'Weight' },
      { key: 'phaDate', label: ['PHA', 'Date'] },
      { key: 'pullUps', label: ['Pull', 'Ups'] },
      { key: 'pullScore', label: 'Score' },
      { key: 'pushUps', label: ['Push', 'Ups'] },
      { key: 'pushScore', label: 'Score' },
      { key: 'crunch', label: 'Crunch' },
      { key: 'plank', label: 'Plank' },
      { key: 'plankScore', label: 'Score' },
      { key: 'run', label: ['3 Mile', 'Run'] },
      { key: 'runScore', label: 'Score' },
      { key: 'row', label: '5K Row' },
      { key: 'rowScore', label: 'Score' },
      { key: 'pftTotal', label: ['PFT', 'Total'] },
      { key: 'mtc', label: ['MTC', 'Time'] },
      { key: 'alReps', label: ['AL', 'Reps'] },
      { key: 'manuf', label: ['MANUF', 'Time'] },
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
    const rowHeight = 6.5;
    const maxRows = 20;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);

    for (let i = 0; i < maxRows; i++) {
      const rowY = dataStartY + (i * rowHeight);
      const marine = marines[i] || null;

      // Draw all cells for this row
      Object.entries(colPositions).forEach(([key, col]) => {
        doc.rect(col.x, rowY, col.width, rowHeight);

        if (marine) {
          const value = this.getCellValue(marine, key);
          if (value) {
            doc.text(String(value), col.x + col.width / 2, rowY + 4.5, { align: 'center' });
          }
        }
      });
    }
  },

  /**
   * Get cell value for a specific column
   */
  getCellValue(marine, key) {
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
      pullUps: marine.pullUps,
      pullScore: marine.pullUpsScore,
      pushUps: marine.pushUps,
      pushScore: marine.pushUpsScore,
      crunch: '', // Legacy field, leave blank
      plank: marine.plankTime,
      plankScore: marine.plankScore,
      run: marine.runTime,
      runScore: marine.runScore,
      row: marine.rowTime,
      rowScore: marine.rowScore,
      pftTotal: marine.pftTotal,
      mtc: marine.mtcTime,
      alReps: marine.alReps,
      manuf: marine.manufTime,
      passFail: marine.cftTotal >= 150 ? 'P' : (marine.cftTotal > 0 ? 'F' : '')
    };
    return mapping[key] || '';
  },

  /**
   * Draw page footer
   */
  drawFooter(doc, pageNum) {
    const pageWidth = this.PAGE_WIDTH;
    const pageHeight = this.PAGE_HEIGHT;
    const margin = this.MARGIN;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');

    // Form number (bottom left)
    doc.text('NAVMC 11622 (Rev. 01-20) (EF)', margin, pageHeight - 8);

    // FOUO notice (center, boxed)
    const fouoWidth = 120;
    const fouoX = (pageWidth - fouoWidth) / 2;
    doc.rect(fouoX, pageHeight - 14, fouoWidth, 10);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text('FOR OFFICIAL USE ONLY', pageWidth / 2, pageHeight - 10, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.text('Privacy sensitive when filled in. Any misuse or unauthorized', pageWidth / 2, pageHeight - 7, { align: 'center' });
    doc.text('disclosure may result in both civil and criminal penalties.', pageWidth / 2, pageHeight - 4.5, { align: 'center' });

    // Page number (bottom right)
    doc.setFontSize(8);
    doc.text(`Page ${pageNum} of 2`, pageWidth - margin - 25, pageHeight - 10, { align: 'right' });
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
