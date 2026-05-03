// c:\Users\GURUPRASAD\Desktop\antigravity\skills-codelab\app_build\booking.js

document.getElementById('booking-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const course = document.getElementById('course').value;
    const msg = document.getElementById('form-message');
    const btn = document.querySelector('button[type="submit"]');

    btn.disabled = true;
    btn.textContent = 'Booking...';

    try {
        // Use the global API_URL from config.js
        const response = await fetch(`${API_URL}/book-demo`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phone, course })
        });

        const data = await response.json();

        if (data.success) {
            msg.style.display = 'block';
            msg.style.color = 'green';
            msg.textContent = '✅ Booking Successful!';
            document.getElementById('booking-form').reset();
        } else {
            msg.style.display = 'block';
            msg.style.color = 'red';
            msg.textContent = '❌ Error: ' + data.message;
        }
    } catch (err) {
        msg.style.display = 'block';
        msg.style.color = 'red';
        msg.textContent = '❌ Failed to connect to server. Ensure your Render backend is live.';
    } finally {
        btn.disabled = false;
        btn.textContent = 'Confirm Booking';
    }
});
