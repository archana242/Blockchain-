// js/voter.js

document.addEventListener('DOMContentLoaded', () => {
  const voterForm = document.getElementById('voterForm');

  if (voterForm) {
    voterForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('voterName').value.trim();
      const email = document.getElementById('voterEmail').value.trim();
      const walletAddress = document.getElementById('walletAddress').value.trim();

      if (!name || !email || !walletAddress) {
        alert("All fields are required.");
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/voter/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, email, walletAddress })
        });

        const result = await response.json();

        if (response.ok) {
          alert("Voter registered successfully!");
          voterForm.reset();
        } else {
          alert(result.message || "Registration failed.");
        }

      } catch (error) {
        console.error("Error registering voter:", error);
        alert("Error connecting to server.");
      }
    });
  }
});
