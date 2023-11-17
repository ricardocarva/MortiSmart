// routes/excelRoutes.js
const express = require('express');
const router = express.Router();
const ExcelJS = require('exceljs');

router.get('/download-excel', (req, res) => {
  // Logic to generate Excel data
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet 1');
  
  // Add your data to the worksheet
  worksheet.addRow(['Column 1', 'Column 2', 'Column 3']);
  worksheet.addRow(['Data 1', 'Data 2', 'Data 3']);

  // Set up the response headers for Excel file
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=generated-details.xlsx');

  // Send the Excel file to the client
  return workbook.xlsx.write(res)
    .then(() => {
      res.status(200).end();
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

module.exports = router;
