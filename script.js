const form = document.getElementById("donationForm");

form.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent the form from submitting immediately
    
    // Validate form inputs
    const errorMessages = document.querySelectorAll(".error");
      for (const el of errorMessages) {
          el.remove();
      }
  
      if (validateForm()) {
          form.submit();
      } else {
          console.error("Form has errors");
      }
    }
  );

// Validates form inputs before submission
function validateForm() {
    let isValid = true;
  
    // === CHARITY NAME VALIDATION ===
    const charityName = document.getElementById("charityName");
    if (charityName.value.trim() === "") {
      showInputError(charityName, "Charity name is required.");
      isValid = false;
    }
  
    // === DONATION AMOUNT VALIDATION ===
    const donationAmount = document.getElementById("donationAmount");
    const amount = parseFloat(donationAmount.value);
    if (isNaN(amount) || amount <= 0) {
      showInputError(donationAmount, "Please enter a valid donation amount.");
      isValid = false;
    }
  
    // === DONATION DATE VALIDATION ===
    const donationDate = document.getElementById("donationDate");
    if (donationDate.value === "") {
      showInputError(donationDate, "Please select a donation date.");
      isValid = false;
    }
  
    return isValid;
}
  
// Handles the form submission event
document.getElementById("donationForm").addEventListener("submit", function(e) {
    e.preventDefault();
  
    // Validate the form
    if (!validateForm()) return;
  
    // Collect form data into an object
    const donationData = {
    charityName: document.getElementById("charityName").value.trim(),
    donationAmount: parseFloat(document.getElementById("donationAmount").value),
    donationDate: document.getElementById("donationDate").value,
    donorMessage: document.getElementById("donorMessage").value.trim()
    };
  
});

/**
 * Display an error message following the input element passed
 *
 * @param {HTMLElement} inputElement  - The element to append the error message to
 * @param {string} message - The message to display in the error
 */
function showInputError(inputElement, message) {
    const container = inputElement.closest(".input-container");
    const errorDisplay = document.createElement("span");
    errorDisplay.innerText = message;
    errorDisplay.className = "error";
    errorDisplay.setAttribute("role", "alert");

    container.appendChild(errorDisplay);
}
  