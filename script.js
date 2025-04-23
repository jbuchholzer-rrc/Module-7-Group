const form = document.getElementById("donationForm");

form.addEventListener("submit", function (event) {
    event.preventDefault(); // Stop the form from submitting

    // Clear previous error messages
    const errorMessages = document.querySelectorAll(".error");
    errorMessages.forEach((el) => el.remove());

    // Validate form inputs
    if (!validateForm()) {
      console.error("Form has errors");
      return;
  }

  // If validation passes, collect the form data
  const donationData = {
      charityName: document.getElementById("charityName").value.trim(),
      donationAmount: parseFloat(document.getElementById("donationAmount").value),
      donationDate: document.getElementById("donationDate").value,
      donorMessage: document.getElementById("donorMessage").value.trim()
  };
  // console.log("Donation submitted:", donationData); (just to check)
});

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
  