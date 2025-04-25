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
  saveDonation(donationData);
  loadAllDonations();
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

/**
 * Creates a table row containing donation information and a delete button.
 * @param {string} donationKey The key to this donation in localStorage.
 * @param {Object} param1 The donation object.
 * @returns {HTMLElement} The created row element.
 */
function createDonationRow(donationKey, {charityName, donationAmount, donationDate, donorMessage}){
  // Create the row element.
  const row = document.createElement("tr");
  row.id = donationKey;
  
  // Create the charity name cell.
  const charityNameElement = document.createElement("td");
  charityNameElement.innerText = charityName;

  // Create the donation amount cell.
  const donationAmountElement = document.createElement("td");
  donationAmountElement.innerText = `$${donationAmount}`;

  // Create the donation date cell.
  const dateDonatedElement = document.createElement("td");
  dateDonatedElement.innerText = donationDate;

  // Create the donation message cell.
  const donationMessageElement = document.createElement("td");
  donationMessageElement.innerText = donorMessage;

  // Create the delete button cell.
  const buttonContainerElement = document.createElement("td");

  // Create the delete button.
  const deleteButton = document.createElement("button");
  deleteButton.innerText = "Delete";
  deleteButton.addEventListener("click", ()=>{
    console.log(donationKey);
  });

  // Add the delete button to the delete button cell.
  buttonContainerElement.appendChild(deleteButton);

  // Add cells to the row.
  row.appendChild(charityNameElement);
  row.appendChild(donationAmountElement);
  row.appendChild(dateDonatedElement);
  row.appendChild(donationMessageElement);
  row.appendChild(buttonContainerElement);

  // Return the row.
  return row;
}

/**
 * Saves an object in localStorage and returns the key used.
 * @param {Object} donation The object containing the donation information.
 * @returns {string} The key to the value stored in localStorage.
 */
function saveDonation(donation){
  // Turn the donation object into a JSON string.
  let donationJSON = JSON.stringify(donation);

  // This number increases until no donation is found with this number.
  let donationId = 0;
  // This stores the key in local storage to check for.
  let donationKey = "";

  // Loops until a vacant spot in local storage is found.
  do {
    donationId ++;
    donationKey = "donation" + donationId;
  } 
  // While getItem does not return null.
  while(localStorage.getItem(donationKey));

  // Add the donation to local storage.
  localStorage.setItem(donationKey, donationJSON);

  // Return the used key.
  return donationKey;
}

/**
 * Gets the donation stored in localStorage as an object.
 * @param {string} donationKey The key to the donation in localStorage.
 * @returns {Object} The donation held in storage.
 */
function loadDonation(donationKey){
  // Get the json string from localStorage.
  let donationJSON = localStorage.getItem(donationKey);

  // Parse the json string into an object.
  const donation = JSON.parse(donationJSON);

  // Return the object.
  return donation;
}

/**
 * Refreshes the donation table with all of the saved donations.
 */
function loadAllDonations(){
  // Get the table body element.
  const table = document.querySelector("#donations-table tbody");

  // Clear the table.
  table.innerHTML = "";

  // Get all keys of localStorage starting with "donation".
  const keys = Object.keys(localStorage).filter(key=>key.startsWith("donation"));

  // Loop through the donation keys.
  keys.forEach(key => {
    // Load the donation.
    const donation = loadDonation(key);

    // Create a row element with the donation information.
    const donationRow = createDonationRow(key, donation);

    // Add the row to the table.
    table.appendChild(donationRow);
  });
}

// Loads the donation into the table when the page is opened.
loadAllDonations();