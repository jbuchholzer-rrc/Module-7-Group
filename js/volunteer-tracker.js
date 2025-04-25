// Grab references to DOM elements
const volunteerForm = document.getElementById('volunteer-form');
const submissionFeedback = document.getElementById('submission-feedback');
const submissionDetails = document.getElementById('submission-details');

// Error message elements
const charityNameError = document.getElementById('charity-name-error');
const hoursError = document.getElementById('hours-error');
const dateError = document.getElementById('date-error');
const ratingError = document.getElementById('rating-error');

// Temporary data store (would be replaced with actual API calls in production)
let volunteerData = [];

// Form validation functions
function validateRequired(value, fieldName) {
    if (!value || value.trim() === '') {
        return `${fieldName} is required`;
    }
    return '';
}

function validateHours(hours) {
    if (!hours) {
        return 'Hours volunteered is required';
    }
    
    const numHours = parseFloat(hours);
    if (isNaN(numHours)) {
        return 'Hours must be a valid number';
    }
    
    if (numHours <= 0) {
        return 'Hours must be greater than zero';
    }
    
    return '';
}

function validateRating(rating) {
    if (!rating) {
        return 'Please rate your volunteer experience';
    }
    
    const numRating = parseInt(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
        return 'Rating must be between 1 and 5 stars';
    }
    
    return '';
}

function validateDate(date) {
    if (!date) {
        return 'Date is required';
    }
    
    // Optional: Additional date validation logic here
    // For example, preventing future dates:
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate > today) {
        return 'Date cannot be in the future';
    }
    
    return '';
}

// Clear all error messages
function clearErrors() {
    charityNameError.textContent = '';
    hoursError.textContent = '';
    dateError.textContent = '';
    ratingError.textContent = '';
}

// Display form validation errors
function showErrors(errors) {
    if (errors.charityName) {
        charityNameError.textContent = errors.charityName;
    }
    
    if (errors.hours) {
        hoursError.textContent = errors.hours;
    }
    
    if (errors.date) {
        dateError.textContent = errors.date;
    }
    
    if (errors.rating) {
        ratingError.textContent = errors.rating;
    }
}

// Get the selected rating value
function getSelectedRating() {
    const ratingInputs = document.querySelectorAll('input[name="rating"]');
    for (const input of ratingInputs) {
        if (input.checked) {
            return input.value;
        }
    }
    return null;
}

// Handle form submission
function handleSubmit(event) {
    // Prevent the default form submission
    event.preventDefault();
    
    // Clear any previous errors
    clearErrors();
    
    // Get form values
    const charityName = document.getElementById('charity-name').value;
    const hours = document.getElementById('hours').value;
    const volunteerDate = document.getElementById('volunteer-date').value;
    const rating = getSelectedRating();
    const notes = document.getElementById('volunteer-notes').value;
    
    // Validate the form data
    const errors = {};
    
    const charityNameError = validateRequired(charityName, 'Charity name');
    if (charityNameError) {
        errors.charityName = charityNameError;
    }
    
    const hoursError = validateHours(hours);
    if (hoursError) {
        errors.hours = hoursError;
    }
    
    const dateError = validateDate(volunteerDate);
    if (dateError) {
        errors.date = dateError;
    }
    
    const ratingError = validateRating(rating);
    if (ratingError) {
        errors.rating = ratingError;
    }
    
    // If there are validation errors, show them and stop
    if (Object.keys(errors).length > 0) {
        showErrors(errors);
        return;
    }
    
    // Create data object
    const volunteerEntry = {
        id: Date.now(), // Simple unique ID
        charityName,
        hours: parseFloat(hours),
        date: volunteerDate,
        rating: parseInt(rating),
        notes,
        submittedAt: new Date().toISOString()
    };
    
    // Store the data (would be an API call in a real app)
    volunteerData.push(volunteerEntry);
    
    // Show confirmation with details
    displaySubmissionConfirmation(volunteerEntry);

    // Display on the table summary
    saveToLocalStorage();
    updateVolunteerTable();
    updateSummary();
    
    // Reset the form
    volunteerForm.reset();
    
    // Log data to console (for debugging)
    console.log('Current volunteer data:', volunteerData);
}

// Display submission confirmation
function displaySubmissionConfirmation(entry) {
    // Format the date for display
    const formattedDate = new Date(entry.date).toLocaleDateString();
    
    // Create the details HTML
    const detailsHTML = `
        <div class="detail-item">
            <strong>Charity:</strong> ${entry.charityName}
        </div>
        <div class="detail-item">
            <strong>Hours:</strong> ${entry.hours}
        </div>
        <div class="detail-item">
            <strong>Date:</strong> ${formattedDate}
        </div>
        <div class="detail-item">
            <strong>Rating:</strong> ${'★'.repeat(entry.rating)}${'☆'.repeat(5 - entry.rating)}
        </div>
        ${entry.notes ? `
        <div class="detail-item notes">
            <strong>Notes:</strong> ${entry.notes}
        </div>
        ` : ''}
    `;
    
    // Update the details container
    submissionDetails.innerHTML = detailsHTML;
    
    // Show the feedback container
    submissionFeedback.classList.remove('hidden');
    
    // Scroll to the feedback
    submissionFeedback.scrollIntoView({ behavior: 'smooth' });
    
    // Hide feedback after 8 seconds
    setTimeout(() => {
        submissionFeedback.classList.add('hidden');
    }, 8000);
}

// Save data to localStorage
function saveToLocalStorage() {
    localStorage.setItem('volunteerData', JSON.stringify(volunteerData));
}

// Load data from localStorage
function loadFromLocalStorage() {
    const storedData = localStorage.getItem('volunteerData');
    if (storedData) {
        volunteerData = JSON.parse(storedData);
    }
}

// Delete a volunteer entry
function deleteVolunteerEntry(id) {

    volunteerData = volunteerData.filter(entry => entry.id !== id);
    
    saveToLocalStorage();
    
    updateVolunteerTable();
    
    updateSummary();
}

// Update the volunteer hours table
function updateVolunteerTable() {
    const tableBody = document.getElementById('volunteer-table-body');
    
    // Clear the current table content
    tableBody.innerHTML = '';
    
   
    const sortedData = [...volunteerData].sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });
    
    
    sortedData.forEach(entry => {
        const row = document.createElement('tr');
        
        const formattedDate = new Date(entry.date).toLocaleDateString();
        
        const starRating = '★'.repeat(entry.rating) + '☆'.repeat(5 - entry.rating);
        
        const notesDisplay = entry.notes && entry.notes.trim() !== '' 
            ? entry.notes 
            : '<span class="no-notes"> </span>';
       
        row.innerHTML = `
            <td>${entry.charityName}</td>
            <td>${entry.hours}</td>
            <td>${formattedDate}</td>
            <td class="star-rating-display">${starRating}</td>
            <td class="notes-cell">${notesDisplay}</td>
            <td>
                <button class="btn delete-btn" data-id="${entry.id}">Delete</button>
            </td>
        `;
        
        // Add the row to the table
        tableBody.appendChild(row);
    });
    
    // Add event listeners to the delete buttons
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            deleteVolunteerEntry(id);
        });
    });
}

// Update the summary section
function updateSummary() {
    const totalHoursElement = document.getElementById('total-hours');
    
    // Calculate total hours
    const totalHours = volunteerData.reduce((sum, entry) => sum + entry.hours, 0);
    
    // Update the display
    totalHoursElement.textContent = totalHours.toFixed(1);
}


// Add event listener for form submission
volunteerForm.addEventListener('submit', handleSubmit);




// Add event listener for form submission
volunteerForm.addEventListener('submit', handleSubmit);

// Initialize any components if needed
function init() {
    // Clear any previously stored data (for demo purposes)
    volunteerData = [];

     // Load previously stored data
     loadFromLocalStorage();

     // Render the loaded data in the table
     updateVolunteerTable();
 
     // Update the summary
     updateSummary();
    
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('volunteer-date').value = today;
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', init); 