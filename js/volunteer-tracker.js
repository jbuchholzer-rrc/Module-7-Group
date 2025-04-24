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

// Add event listener for form submission
volunteerForm.addEventListener('submit', handleSubmit);

// Initialize any components if needed
function init() {
    // Clear any previously stored data (for demo purposes)
    volunteerData = [];
    
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('volunteer-date').value = today;
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', init); 