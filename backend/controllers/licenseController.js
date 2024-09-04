// const Employee = require('../models/Employee');
// const jsBarcode = require('jsbarcode');
// const { createCanvas } = require('canvas');

// exports.createLicense = async (req, res) => {
//   const { name, position, issueDate, expiryDate } = req.body;

//   // Check for duplicate ID
//   const existingEmployee = await Employee.findOne({ name });
//   if (existingEmployee) {
//     return res.status(400).json({ message: 'Employee already has a license' });
//   }

//   // Generate barcode for the employee
//   const canvas = createCanvas();
//   jsBarcode(canvas, name, { format: 'CODE128' });
//   const barcodeData = canvas.toDataURL(); // Convert barcode to base64 image

//   const newEmployee = new Employee({
//     name,
//     position,
//     issueDate,
//     expiryDate,
//     barcode: barcodeData,
//     documents: [], // Initialize an empty array for document paths
//   });

//   await newEmployee.save();
//   res.status(201).json({ message: 'License created successfully', employee: newEmployee });
// };


// NEW CODE======================

const Employee = require('../models/Employee');
const jsBarcode = require('jsbarcode');
const fs = require('fs');
const { createCanvas } = require('canvas');
const excel = require('excel4node');

// Function to check if an employee's ID is already issued
async function checkDuplicateEmployee(name) {
    const existingEmployee = await Employee.findOne({ name });
    return existingEmployee;
}

// Function to generate barcode
function generateBarcode(data) {
    const canvas = createCanvas();
    jsBarcode(canvas, data, { format: 'CODE128' });
    return canvas.toDataURL('image/png');
}

// Function to create an Excel file if doesn't exist and append data if it exists
async function appendToExcelFile(employee) {
    const workbook = new excel.Workbook();
    const sheet = workbook.addWorksheet('Employees');

    sheet.cell(1, 1).string('Employee Name');
    sheet.cell(1, 1).string('Employee ID');
    sheet.cell(1, 2).string('Position');
    sheet.cell(1, 3).string('Issue Date');
    sheet.cell(1, 4).string('Expiry Date');

    // Assuming you save it in the backend folder
    const filePath = './backend/licenseRecords.xlsx';

    try {
        if (!fs.existsSync(filePath)) {
            await workbook.write(filePath);
        }

        // Append employee data
        const row = sheet.rowCount + 1;
        sheet.cell(row, 1).string(employee.name);
        sheet.cell(row, 2).string(employee.employeeId);
        sheet.cell(row, 3).string(employee.position);
        sheet.cell(row, 4).date(employee.issueDate);
        sheet.cell(row, 5).date(employee.expiryDate);

        await workbook.write(filePath);

    } catch (error) {
        console.error('Error writing to Excel file:', error);
    }
}

// Function to create a driving license card
async function createLicense(req, res) {
    const { name, employeeId, position, issueDate, expiryDate } = req.body;

    const existingEmployee = await checkDuplicateEmployee(name);

    if (existingEmployee) {
        return res.status(400).json({ message: 'A card has already been issued for this employee.' });
    }

    const barcode = generateBarcode(name);

    const newEmployee = new Employee({
        name,
        employeeId,
        position,
        issueDate,
        expiryDate,
        barcode,
        documents: {
            iqama: '', // Set based on the user's uploads
            drivingLicense: '',
            certificates: []
        }
    });

    try {
        await newEmployee.save();
        // await appendToExcelFile(newEmployee);

        res.status(201).json({ message: 'License created successfully', employee: newEmployee });
    } catch (error) {
        res.status(500).json({ message: 'Error creating license', error });
    }
}

// Function to handle barcode scanning and open relevant documents
async function getDocumentsByBarcode(req, res) {
    const { barcode } = req.params;
    try {
        const employee = await Employee.findOne({ "employeeId": barcode });

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching documents', error });
    }
}

// Function to get the dashboard overview
async function getDashboardOverview(req, res) {
    try {
        const totalEmployees = await Employee.countDocuments({});
        const pendingEmployees = await Employee.countDocuments({ expiryDate: { $gt: new Date() } });
        const expiredEmployees = await Employee.countDocuments({ expiryDate: { $lt: new Date() } });

        res.status(200).json({
            totalIssued: totalEmployees,
            pending: pendingEmployees,
            expired: expiredEmployees
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching dashboard data', error });
    }
}

module.exports = {
    createLicense,
    getDocumentsByBarcode,
    getDashboardOverview
};
