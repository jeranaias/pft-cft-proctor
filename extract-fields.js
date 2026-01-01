const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

async function extractFields() {
  const pdfBytes = fs.readFileSync('NAVMC_11622_PFT-CFT.pdf');
  const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });

  const form = pdfDoc.getForm();
  const fields = form.getFields();

  console.log(`Found ${fields.length} form fields:\n`);

  fields.forEach((field, index) => {
    const type = field.constructor.name;
    const name = field.getName();
    console.log(`${index + 1}. [${type}] "${name}"`);
  });
}

extractFields().catch(console.error);
