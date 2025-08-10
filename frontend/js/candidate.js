// js/candidate.js

document.addEventListener('DOMContentLoaded', () => {
  const candidateForm = document.getElementById('candidateForm');

  if (candidateForm) {
    candidateForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('candidateName').value.trim();
      const party = document.getElementById('candidateParty').value.trim();
      const constituency = document.getElementById('candidateConstituency').value.trim();

      if (!name || !party || !constituency) {
        alert("All fields are required.");
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/candidate/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, party, constituency })
        });

        const result = await response.json();

        if (response.ok) {
          alert("Candidate added successfully!");
          candidateForm.reset();
        } else {
          alert(result.message || "Candidate addition failed.");
        }

      } catch (error) {
        console.error("Error adding candidate:", error);
        alert("Error connecting to server.");
      }
    });
  }
});
