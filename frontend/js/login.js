document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const message = document.getElementById('message');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const mailid = form.mailid.value.trim();
    const password = form.password.value.trim();

    if (!mailid || !password) {
      message.textContent = 'Please fill in both fields.';
      message.classList.add('error');
      return;
    }

    // Dummy role-based redirection
    if (mailid === "admin@gmail.com" && password === "admin") {
      window.location.href = "admin_dashboard.html";
    } else if (mailid === "voter@gmail.com" && password === "voter") {
      window.location.href = "voter_dashboard.html";
    } else if (mailid === "auditor@gmail.com" && password === "auditor") {
      window.location.href = "auditor_dashboard.html";
    } else {
      message.textContent = 'Invalid credentials. Try again.';
      message.classList.add('error');
    }
  });
});
