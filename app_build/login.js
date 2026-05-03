// c:\Users\GURUPRASAD\Desktop\antigravity\skills-codelab\app_build\login.js

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('error');
    const btn = document.querySelector('button');

    btn.disabled = true;
    errorMsg.style.display = 'none';

    try {
        // Use the global API_URL from config.js
        const response = await fetch(`${API_URL}/admin-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
            localStorage.setItem('adminToken', data.token);
            window.location.href = 'admin.html';
        } else {
            errorMsg.style.display = 'block';
            errorMsg.textContent = '❌ Invalid email or password';
        }
    } catch (err) {
        errorMsg.style.display = 'block';
        errorMsg.textContent = '❌ Server error. Check your Render URL.';
    } finally {
        btn.disabled = false;
    }
});
