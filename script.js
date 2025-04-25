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

/**
 * Ensures all form fields have valid inputs and highlights any errors to the user.
 * @returns {boolean} True if all fields in the form are valid.
 */
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
 * Display an error message following the input element passed.
 *
 * @param {HTMLElement} inputElement  - The element to append the error message to.
 * @param {string} message - The message to display in the error.
 */
function showInputError(inputElement, message) {
  const container = inputElement.closest(".input-container");
  const errorDisplay = document.createElement("span");
  errorDisplay.innerText = message;
  errorDisplay.className = "error";
  errorDisplay.setAttribute("role", "alert");

  container.appendChild(errorDisplay);
}

function displayDonation({charityName, donationAmount, donationDate, donorMessage}){
  // get the table body to add the donation information to.
  const table = document.querySelector("#donations-table tbody");

  // create the row element.
  const row = document.createElement("tr");
  
  // create the charity name cell.
  const charityNameElement = document.createElement("td");
  charityNameElement.innerText = charityName;

  // create the donation amount cell.
  const donationAmountElement = document.createElement("td");
  donationAmountElement.innerText = `$${donationAmount}`;

  // create the donation date cell.
  const dateDonatedElement = document.createElement("td");
  dateDonatedElement.innerText = donationDate;

  // create the donation message cell.
  const donationMessageElement = document.createElement("td");
  donationMessageElement.innerText = donorMessage;

  // create the delete button cell.
  const buttonContainerElement = document.createElement("td");

  // create the delete button.
  const deleteButton = document.createElement("button");
  deleteButton.innerText = "Delete";
  deleteButton.addEventListener("click", ()=>{
    console.log({charityName, donationAmount, donationDate, donorMessage});
  });

  // add the delete button to the delete button cell.
  buttonContainerElement.appendChild(deleteButton);

  // add cells to the row.
  row.appendChild(charityNameElement);
  row.appendChild(donationAmountElement);
  row.appendChild(dateDonatedElement);
  row.appendChild(donationMessageElement);
  row.appendChild(buttonContainerElement);

  // add row to the table.
  table.appendChild(row);
}