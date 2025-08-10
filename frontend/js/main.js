document.addEventListener('DOMContentLoaded', () => {
  console.log("Main JS loaded. Initializing frontend...");

  // Optional role routing logic
  const role = localStorage.getItem('role');
  if (role) {
    window.location.href = `login.html?role=${role}`;
  }
});
