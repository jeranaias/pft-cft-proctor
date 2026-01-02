/**
 * NAVMC 11622 PDF Generator
 * Creates an exact replica of the official PFT/CFT Performance Worksheet
 * Based on NAVMC 11622 (Rev. 01-20) (EF)
 */

const NAVMCGenerator = {
  // Page dimensions (Letter size in mm, landscape)
  PAGE_WIDTH: 279.4,  // 11 inches
  PAGE_HEIGHT: 215.9, // 8.5 inches
  MARGIN: 10,         // Margins

  // Colors matching official form exactly
  COLORS: {
    black: [0, 0, 0],
    darkBlue: [0, 32, 96],
    headerTan: [253, 234, 218],    // Light tan/peach for group headers - closer to original
    white: [255, 255, 255],
    linkBlue: [0, 0, 238]          // Standard hyperlink blue
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
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('MCO 6100.13', pageWidth - margin, 15, { align: 'right' });

    // Main title - large, bold, centered
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('PFT/CFT PERFORMANCE WORKSHEET', centerX, 38, { align: 'center' });

    // Privacy Act Statement header
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('PRIVACY ACT STATEMENT', centerX, 62, { align: 'center' });

    // Intro paragraph
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const intro = 'In accordance with the Privacy Act of 1974 (5 U.S.C. 552a/Public Law 93-579), this Notice informs you of the purpose for collection of information on this form. Please read it before completing the form.';
    doc.text(intro, margin, 76, { maxWidth: contentWidth });

    // Dark blue horizontal line (thick)
    doc.setDrawColor(...this.COLORS.darkBlue);
    doc.setLineWidth(3);
    doc.line(margin, 92, pageWidth - margin, 92);
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.1);

    // Authority section
    let yPos = 104;
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.text('AUTHORITY:', margin, yPos);
    doc.setFont('helvetica', 'normal');
    const authority = '10 U.S.C. 5013, Secretary of the Navy; 10 U.S.C. 5041, Headquarters, Marine Corps; 10 U.S.C. 1074f, Medical Tracking System for Members Deployed Overseas; 32 CFR 64.4, Management and Mobilization; DoDI 1215.13, Reserve Component (RC) Member Participation Policy; DoDI 3001.02, Personnel Accountability in Conjunction with Natural and Manmade Disasters; CJCSM 3150.13B, Joint Reporting Structure Personnel Manual; DoDI 6490.03, Deployment Health; SECNAVINST 1770.5, Management and Disposition of Line of Duty Benefits for Members of the Navy and Marine Corps Reserve; MCO 7220.50 B, Marine Corps Policy for paying Reserve Marines; E.O. 9397 (SSN), as amended; and SORN M01040-3.';
    doc.text(authority, margin + 21, yPos, { maxWidth: contentWidth - 21 });

    // Principal Purpose
    yPos = 126;
    doc.setFont('helvetica', 'bold');
    doc.text('PRINCIPAL PURPOSE:', margin, yPos);
    doc.setFont('helvetica', 'normal');
    const purpose = 'Information collected by this form will be used to record physical fitness performance data for compliance with the Marine Corps Physical Fitness and Combat Fitness program and will be entered in Marine Corps Total Force System (MCTFS).';
    doc.text(purpose, margin + 36, yPos, { maxWidth: contentWidth - 36 });

    // Routine Uses
    yPos = 142;
    doc.setFont('helvetica', 'bold');
    doc.text('ROUTINE USES:', margin, yPos);
    doc.setFont('helvetica', 'normal');
    const usesText = "Information will be accessed by Commander's, Senior Enlisted Advisors, Officers in Charge, Force Fitness Instructor, Command Physical Training Representative, and S-3 command designated personnel with a need to know in order to comply with the Marine Corps' Body Composition and Military Appearance Program. A complete list and explanation of the applicable routine uses is published in the authorizing SORN available at : ";
    doc.text(usesText, margin + 28, yPos, { maxWidth: contentWidth - 28 });

    // Add hyperlink text in blue
    doc.setTextColor(...this.COLORS.linkBlue);
    doc.text('http://dpcld.defense.gov/Privacy/SORNsIndex/DOD-wide-SORN-Article-View/Article/570625/', margin + 28, yPos + 14, { maxWidth: contentWidth - 28 });
    doc.text('m01040-3/).', margin + 28, yPos + 17.5);
    doc.setTextColor(0, 0, 0);

    // Disclosure
    yPos = 172;
    doc.setFont('helvetica', 'bold');
    doc.text('DISCLOSURE:', margin, yPos);
    doc.setFont('helvetica', 'normal');
    const disclosure = 'Voluntary; however, failure to provide the information may result in administrative action that limits promotion, retention, and assignment.';
    doc.text(disclosure, margin + 24, yPos, { maxWidth: contentWidth - 24 });

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
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('MCO 6100.13', pageWidth - margin, 11, { align: 'right' });

    // Title - Mixed case like original
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('PFT/CFT Performance Worksheet', pageWidth / 2, 17, { align: 'center' });

    // Unit / Date / Monitor header boxes
    const headerY = 21;
    const headerHeight = 7;

    // Proportions from original: Unit ~4%, Date ~79%, Monitor ~17%
    const unitWidth = contentWidth * 0.04;
    const dateWidth = contentWidth * 0.79;
    const monitorWidth = contentWidth * 0.17;

    doc.setLineWidth(0.3);
    doc.setFontSize(6);

    // Unit box - label at top-left, value centered below
    doc.rect(margin, headerY, unitWidth, headerHeight);
    doc.setFont('helvetica', 'normal');
    doc.text('Unit', margin + 0.8, headerY + 2.5);
    if (unit) {
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text(unit, margin + unitWidth / 2, headerY + 5.5, { align: 'center' });
      doc.setFontSize(6);
      doc.setFont('helvetica', 'normal');
    }

    // Date box - label centered at top, value centered below
    doc.rect(margin + unitWidth, headerY, dateWidth, headerHeight);
    doc.text('Date', margin + unitWidth + (dateWidth / 2), headerY + 2.5, { align: 'center' });
    if (date) {
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text(this.formatDate(date), margin + unitWidth + dateWidth / 2, headerY + 5.5, { align: 'center' });
      doc.setFontSize(6);
      doc.setFont('helvetica', 'normal');
    }

    // Monitor box - label at top-left, value centered below
    doc.rect(margin + unitWidth + dateWidth, headerY, monitorWidth, headerHeight);
    doc.text('Monitor', margin + unitWidth + dateWidth + 0.8, headerY + 2.5);
    if (monitor) {
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.text(monitor, margin + unitWidth + dateWidth + monitorWidth / 2, headerY + 5.5, { align: 'center' });
      doc.setFontSize(6);
      doc.setFont('helvetica', 'normal');
    }

    // Draw the main data table
    this.drawDataTable(doc, marines, headerY + headerHeight);

    // Note at bottom - positioned like original
    doc.setFontSize(5.5);
    doc.setFont('helvetica', 'normal');
    doc.text('*Note: Risk Factor Worksheet required for Marines age 46 and over.', margin, this.PAGE_HEIGHT - 17);

    // Footer
    this.drawFooter(doc, 2);
  },

  /**
   * Draw the main data table matching official form exactly
   */
  drawDataTable(doc, marines, startY) {
    const margin = this.MARGIN;
    const tableWidth = this.PAGE_WIDTH - (margin * 2);

    // Column definitions - widths tuned to match original
    const cols = [
      // Individual Data (9 columns)
      { key: 'rank', width: 9, label: 'Rank' },
      { key: 'firstName', width: 14, label: ['First', 'Name'] },
      { key: 'mi', width: 5, label: 'MI' },
      { key: 'lastName', width: 14, label: ['Last', 'Name'] },
      { key: 'edipi', width: 15, label: 'EDIPI' },
      { key: 'age', width: 8, label: 'Age*' },
      { key: 'gender', width: 10, label: 'Gender' },
      { key: 'height', width: 10, label: 'Height' },
      { key: 'weight', width: 10, label: 'Weight' },
      // PFT Performance Data (11 columns)
      { key: 'phaDate', width: 8, label: ['PHA', 'Date'] },
      { key: 'pullUps', width: 7, label: ['Pull', 'Ups'] },
      { key: 'pushUps', width: 7, label: ['Push', 'Ups'] },
      { key: 'upperScore', width: 8, label: 'Score' },
      { key: 'crunch', width: 10, label: 'Crunch' },
      { key: 'plank', width: 9, label: 'Plank' },
      { key: 'coreScore', width: 8, label: 'Score' },
      { key: 'run', width: 13, label: ['3 Mile', 'Run'] },
      { key: 'row', width: 10, label: '5K Row' },
      { key: 'cardioScore', width: 8, label: 'Score' },
      { key: 'pftTotal', width: 11, label: ['PFT', 'Total'] },
      // CFT Performance Data (8 columns)
      { key: 'mtcTime', width: 10, label: 'MTC' },
      { key: 'mtcScore', width: 7, label: 'Score' },
      { key: 'alReps', width: 7, label: 'AL' },
      { key: 'alScore', width: 7, label: 'Score' },
      { key: 'manufTime', width: 10, label: 'MANUF' },
      { key: 'manufScore', width: 7, label: 'Score' },
      { key: 'cftTotal', width: 9, label: ['CFT', 'Total'] },
      { key: 'passFail', width: 8, label: ['Pass/', 'Fail'] }
    ];

    // Calculate x positions
    let x = margin;
    cols.forEach(col => {
      col.x = x;
      x += col.width;
    });

    // Adjust last column to fill remaining space exactly
    const totalUsed = cols.reduce((sum, col) => sum + col.width, 0);
    const remaining = tableWidth - totalUsed;
    cols[cols.length - 1].width += remaining;

    // Group header row (tan/peach background)
    const groupHeaderY = startY;
    const groupHeaderHeight = 5;

    // Calculate group boundaries
    const indDataEndX = cols[8].x + cols[8].width;
    const pftDataEndX = cols[19].x + cols[19].width;
    const cftDataEndX = cols[cols.length - 1].x + cols[cols.length - 1].width;

    const indDataWidth = indDataEndX - margin;
    const pftDataWidth = pftDataEndX - indDataEndX;
    const cftDataWidth = cftDataEndX - pftDataEndX;

    doc.setFillColor(...this.COLORS.headerTan);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');

    // Draw group headers with thicker border
    doc.setLineWidth(0.4);

    // Individual Data header
    doc.rect(margin, groupHeaderY, indDataWidth, groupHeaderHeight, 'FD');
    doc.text('Individual Data', margin + (indDataWidth / 2), groupHeaderY + 3.3, { align: 'center' });

    // PFT Performance Data header
    doc.rect(indDataEndX, groupHeaderY, pftDataWidth, groupHeaderHeight, 'FD');
    doc.text('PFT Performance Data', indDataEndX + (pftDataWidth / 2), groupHeaderY + 3.3, { align: 'center' });

    // CFT Performance Data header
    doc.rect(pftDataEndX, groupHeaderY, cftDataWidth, groupHeaderHeight, 'FD');
    doc.text('CFT Performance Data', pftDataEndX + (cftDataWidth / 2), groupHeaderY + 3.3, { align: 'center' });

    // Reset line width for column headers
    doc.setLineWidth(0.25);

    // Column header row (white background)
    const colHeaderY = groupHeaderY + groupHeaderHeight;
    const colHeaderHeight = 7;

    doc.setFontSize(4.5);
    doc.setFont('helvetica', 'bold');

    cols.forEach(col => {
      doc.rect(col.x, colHeaderY, col.width, colHeaderHeight);

      if (Array.isArray(col.label)) {
        doc.text(col.label[0], col.x + col.width / 2, colHeaderY + 2.5, { align: 'center' });
        doc.text(col.label[1], col.x + col.width / 2, colHeaderY + 5.2, { align: 'center' });
      } else {
        doc.text(col.label, col.x + col.width / 2, colHeaderY + 4, { align: 'center' });
      }
    });

    // Data rows
    const dataStartY = colHeaderY + colHeaderHeight;
    const rowHeight = 5.2;
    const availableHeight = this.PAGE_HEIGHT - dataStartY - 22; // Leave room for footer
    const maxRows = Math.floor(availableHeight / rowHeight);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(4.5);
    doc.setLineWidth(0.15);

    // Columns that should be left-aligned (names, etc.)
    const leftAlignedCols = ['rank', 'firstName', 'lastName'];

    for (let i = 0; i < maxRows; i++) {
      const rowY = dataStartY + (i * rowHeight);
      const marine = marines[i] || null;

      cols.forEach(col => {
        doc.rect(col.x, rowY, col.width, rowHeight);

        if (marine) {
          const value = this.getCellValue(marine, col.key);
          if (value) {
            if (leftAlignedCols.includes(col.key)) {
              // Left-align with small padding
              doc.text(String(value), col.x + 0.8, rowY + 3.3);
            } else {
              // Center-align
              doc.text(String(value), col.x + col.width / 2, rowY + 3.3, { align: 'center' });
            }
          }
        }
      });
    }

    // Draw thick outer border around entire table
    const tableEndY = dataStartY + (maxRows * rowHeight);
    doc.setLineWidth(0.5);
    doc.rect(margin, groupHeaderY, tableWidth, tableEndY - groupHeaderY);
  },

  /**
   * Get cell value for a specific column
   */
  getCellValue(marine, key) {
    const usedPullUps = marine.pullUps && marine.pullUps > 0;
    const usedPushUps = marine.pushUps && marine.pushUps > 0;
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
      crunch: '',
      plank: marine.plankTime || '',
      coreScore: marine.plankScore || '',
      run: marine.runTime || '',
      row: marine.rowTime || '',
      cardioScore: usedRun ? marine.runScore : (usedRow ? marine.rowScore : ''),
      pftTotal: marine.pftTotal || '',
      mtcTime: marine.mtcTime || '',
      mtcScore: marine.mtcScore || '',
      alReps: marine.alReps || '',
      alScore: marine.alScore || '',
      manufTime: marine.manufTime || '',
      manufScore: marine.manufScore || '',
      cftTotal: marine.cftTotal || '',
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

    // Form number (bottom left) - NO box around it
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text('NAVMC 11622 (Rev. 01-20) (EF)', margin, pageHeight - 6);

    // FOUO notice (center, in a box)
    const fouoWidth = 115;
    const fouoX = (pageWidth - fouoWidth) / 2;
    const fouoY = pageHeight - 13;
    const fouoHeight = 9;

    doc.setLineWidth(0.3);
    doc.rect(fouoX, fouoY, fouoWidth, fouoHeight);

    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text('FOR OFFICIAL USE ONLY', pageWidth / 2, fouoY + 3.5, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.5);
    doc.text('Privacy sensitive when filled in. Any misuse or unauthorized', pageWidth / 2, fouoY + 6, { align: 'center' });
    doc.text('disclosure may result in both civil and criminal penalties.', pageWidth / 2, fouoY + 8, { align: 'center' });

    // Page number (bottom right)
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Page ${pageNum} of 2`, pageWidth - margin, pageHeight - 9, { align: 'right' });
    doc.setFontSize(7);
    doc.text('AEM Designer 6.5', pageWidth - margin, pageHeight - 5, { align: 'right' });
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
