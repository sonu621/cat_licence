// const express = require('express');
// const router = express.Router();
// const { createLicense } = require('../controllers/licenseController');

// // Route to create a driving license
// router.post('/create', createLicense);

// module.exports = router;

// const XLSX = require('xlsx');

// // License creation logic...
// router.post('/create', async (req, res) => {
//   // Existing license creation logic
//   const { name, position, issueDate, expiryDate, empId } = req.body;

//   // Check for duplicate Employee ID
//   const existingEmployee = await Employee.findOne({ empId });
//   if (existingEmployee) {
//     return res.status(400).json({ message: 'Employee already has a license' });
//   }

//   // Create new employee record
//   const newEmployee = new Employee({
//     name,
//     position,
//     issueDate,
//     expiryDate,
//     empId,
//     // Add barcode, etc. if necessary
//   });
//   await newEmployee.save();

//   // Record keeping logic (add to Excel file)
//   generateAndSaveExcel({
//     name,
//     position,
//     issueDate,
//     expiryDate,
//     empId,
//   });

//   res.status(201).json({ message: 'License created successfully', employee: newEmployee });
// });

// // Function to generate and save Excel file
// function generateAndSaveExcel(employeeData) {
//   let workbook;
//   try {
//     // Load existing workbook if it exists
//     workbook = XLSX.readFile('employee_records.xlsx');
//   } catch (error) {
//     // Create new workbook if file doesn't exist
//     workbook = XLSX.utils.book_new();
//   }

//   const worksheetData = [
//     [employeeData.name, employeeData.position, employeeData.issueDate, employeeData.expiryDate, employeeData.empId],
//   ];

//   // Get the first worksheet or create one
//   let worksheet = workbook.Sheets['Employees'] || XLSX.utils.aoa_to_sheet([]);
//   XLSX.utils.sheet_add_aoa(worksheet, worksheetData, { origin: -1 }); // Append new data

//   // Add or update the worksheet
//   XLSX.utils.book_append_sheet(workbook, worksheet, 'Employees');

//   // Write to the Excel file
//   XLSX.writeFile(workbook, 'employee_records.xlsx');
// }


//NEW CODE++++===================

const express = require('express');
const router = express.Router();
const {
    createLicense,
    getDocumentsByBarcode,
    getDashboardOverview
} = require('../controllers/licenseController');

// Route to create a new driving license card
router.post('/create', createLicense);

// Route to scan a barcode and fetch relevant documents
router.get('/documents/:barcode', getDocumentsByBarcode);

// Route to get dashboard overview
router.get('/dashboard', getDashboardOverview);

module.exports = router;
