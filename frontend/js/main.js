document.addEventListener('DOMContentLoaded', function () {
    const createLicenseBtn = document.getElementById('licenseForm');
    if (createLicenseBtn) {
        createLicenseBtn.addEventListener('submit', async function (event) {
            event.preventDefault(); // Prevent form submission
            await saveData();
            await createLicense();
        });
    } else {
        console.error('Form with ID "licenseForm" not found.');
    }

    const downloadCardBtn = document.getElementById('downloadCard');
    if (downloadCardBtn) {
        downloadCardBtn.addEventListener('click', downloadLicenseCard);
    } else {
        console.error('Button with ID "downloadCard" not found.');
    }
});

async function createLicense() {
    const name = document.getElementById('name').value;
    const employeeId = document.getElementById('employeeId').value;
    const position = document.getElementById('position').value;
    const issueDate = document.getElementById('issueDate').value;
    const expiryDate = document.getElementById('expiryDate').value;
    const barcode = await getBarCodeData(employeeId);

    if (!name || !employeeId || !position || !issueDate || !expiryDate) {
        alert('Please fill out all fields.');
        return;
    }

    const cardPreview = document.getElementById('card-preview');
    cardPreview.innerHTML = `
        <div class="card-header">
            <h3>C.A.T INTERNAL DRIVING LICENSE</h3>
        </div>
        <div class="card-body">
            <p>Employee Name: ${name}</p>
            <p>Position: ${position}</p>
            <p>Issue Date: ${issueDate}</p>
            <p>Expiry Date: ${expiryDate}</p>
            <div id="barcodeContainer" class="text-center mt-3">
                <img id="barcode" src=${barcode} alt="Barcode"> <!-- Adjust path accordingly -->
            </div>
        </div>
        <div class="card-footer">
            <p>C.A.T INTERNATIONAL L.L.C</p>
            <p>THIS IS NOT A SAUDI ARABIAN GOVERNMENT LICENSE</p>
        </div>
        <div class="card-logo">
            <img src="https://www.catgroup.net/wp-content/uploads/2022/09/Group-53-e1666969625763.png" alt="CAT Logo">
        </div>
    `;
    document.getElementById('card-preview').style.display = 'block';
}

function downloadLicenseCard() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [85.6, 53.98] // Standard credit card size
    });

    const cardPreview = document.getElementById('card-preview');
    const pTags = cardPreview.querySelectorAll('p');

    const name = pTags[0].innerText.split(": ")[1];
    const position = pTags[1].innerText.split(": ")[1];
    const issueDate = pTags[2].innerText.split(": ")[1];
    const expiryDate = pTags[3].innerText.split(": ")[1];

    // Extract barcode image
    const barcodeImg = document.getElementById('barcode');
    const barcodeSrc = barcodeImg.src;

    doc.setFontSize(12);
    doc.text("C.A.T INTERNAL DRIVING LICENSE", 10, 10);

    doc.setFontSize(10);
    doc.text(`Employee Name: ${name}`, 10, 20);
    doc.text(`Position: ${position}`, 10, 25);
    doc.text(`Issue Date: ${issueDate}`, 10, 30);
    doc.text(`Expiry Date: ${expiryDate}`, 10, 35);

    doc.setFontSize(8);
    doc.text("C.A.T INTERNATIONAL L.L.C", 10, 48);
    doc.text("THIS IS NOT A SAUDI ARABIAN GOVERNMENT LICENSE", 10, 50);

    // Add barcode image to the PDF
    const barcodeWidth = 40;
    const barcodeHeight = 15;
    const barcodeXPosition = 60;
    const barcodeYPosition = 35;

    doc.addImage(barcodeSrc, 'PNG', barcodeXPosition, barcodeYPosition, barcodeWidth, barcodeHeight);
    doc.save('driving_license_card.pdf');

    logoImg.onerror = () => {
        console.error('Logo image failed to load.');
        alert('Error loading logo image. Please try again.');
    };
}



async function getBarCodeData(employeeId) {
    try {
        const response = await fetch(`https://cat-licence-6.onrender.com/api/license/documents/${employeeId}`);

        // Check if the response status is OK (status code 200)
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Parse the JSON from the response
        const data = await response.json();

        return data.barcode;
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
    }
}

async function saveData() {
    const name = document.getElementById('name').value;
    const employeeId = document.getElementById('employeeId').value;
    const position = document.getElementById('position').value;
    const issueDate = document.getElementById('issueDate').value;
    const expiryDate = document.getElementById('expiryDate').value;
    const data = {
        name,
        employeeId,
        position,
        issueDate,
        expiryDate
    };
    try {
        const response = await fetch('https://cat-licence-6.onrender.com/api/license/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.status === 201) {
            await fetchDashboardData();
        } else {
            alert(result.message || 'An error occurred');
        }
    } catch (error) {
        console.error('Error creating license:', error);
    }
}

async function fetchDashboardData() {
    try {
        const response = await fetch('https://cat-licence-6.onrender.com/api/license/dashboard');

        // Check if the response status is OK (status code 200)
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Parse the JSON from the response
        const data = await response.json();

        // Update the DOM with the fetched data
        document.getElementById('totalIssued').innerText = data.totalIssued;
        document.getElementById('pending').innerText = data.pending;
        document.getElementById('expired').innerText = data.expired;
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
    }
}
