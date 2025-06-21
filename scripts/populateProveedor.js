const fs = require('fs');

const inputFile = '/workspaces/BD2-TPO/datasets/proveedor_utf8.csv';
const outputFile = '/workspaces/BD2-TPO/datasets/proveedor_coma.csv';

const data = fs.readFileSync(inputFile);

const lines = data.split('\n');
const outputLines = [];

for (let line of lines) {
  const fields = line.split(';');

  for (let i = 0; i < fields.length; i++) {
    let field = fields[i].trim();

    if (field.includes(',') && !(field.startsWith('"') && field.endsWith('"'))) {
      
      field = '"' + field.replace(/"/g, '""') + '"';
      fields[i] = field;
    }
  }

  outputLines.push(fields.join(','));
}

fs.writeFileSync(outputFile, outputLines.join('\n'));
