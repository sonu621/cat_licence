async function fetchDashboardData() {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/license/dashboard');

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

// Call the function to fetch data when the page loads
fetchDashboardData();