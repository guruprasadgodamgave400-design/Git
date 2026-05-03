// c:\Users\GURUPRASAD\Desktop\antigravity\skills-codelab\app_build\admin.js

async function fetchBookings() {
    const list = document.getElementById('booking-list');
    const table = document.getElementById('booking-table');
    const loading = document.getElementById('loading-msg');
    const noData = document.getElementById('no-data-msg');

    try {
        // Use the global API_URL from config.js
        const response = await fetch(`${API_URL}/bookings`);
        const data = await response.json();

        loading.style.display = 'none';

        if (!data || data.length === 0) {
            noData.style.display = 'block';
            table.style.display = 'none';
        } else {
            noData.style.display = 'none';
            table.style.display = 'table';
            list.innerHTML = data.map(b => `
                <tr>
                    <td>${b.name}</td>
                    <td>${b.email}</td>
                    <td>${b.phone}</td>
                    <td>${b.course}</td>
                </tr>
            `).join('');
        }
    } catch (err) {
        loading.textContent = '❌ Error connecting to backend. Check your Render URL.';
    }
}

function logout() {
    localStorage.removeItem('adminToken');
    window.location.href = 'login.html';
}

fetchBookings();
