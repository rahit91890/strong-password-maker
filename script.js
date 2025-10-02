// Strong Password Maker & Checker - Main JavaScript File

// DOM Elements
const passwordLength = document.getElementById('passwordLength');
const lengthValue = document.getElementById('lengthValue');
const includeUppercase = document.getElementById('includeUppercase');
const includeLowercase = document.getElementById('includeLowercase');
const includeNumbers = document.getElementById('includeNumbers');
const includeSymbols = document.getElementById('includeSymbols');
const generatedPassword = document.getElementById('generatedPassword');
const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');

const checkPassword = document.getElementById('checkPassword');
const checkBtn = document.getElementById('checkBtn');
const togglePassword = document.getElementById('togglePassword');
const toggleIcon = document.getElementById('toggleIcon');
const strengthResult = document.getElementById('strengthResult');
const strengthAlert = document.getElementById('strengthAlert');
const strengthTitle = document.getElementById('strengthTitle');
const strengthDetails = document.getElementById('strengthDetails');
const strengthBar = document.getElementById('strengthBar');
const weaknessSection = document.getElementById('weaknessSection');
const weaknessList = document.getElementById('weaknessList');
const suggestedPassword = document.getElementById('suggestedPassword');
const copySuggestedBtn = document.getElementById('copySuggestedBtn');

// Character sets
const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lowercase = 'abcdefghijklmnopqrstuvwxyz';
const numbers = '0123456789';
const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

// Common weak passwords
const commonPasswords = [
    'password', '123456', '12345678', 'qwerty', 'abc123', 'monkey',
    'letmein', 'trustno1', 'dragon', 'baseball', 'iloveyou', 'master',
    'sunshine', 'ashley', 'bailey', 'passw0rd', 'shadow', 'superman'
];

// Update length value display
passwordLength.addEventListener('input', () => {
    lengthValue.textContent = passwordLength.value;
});

// Generate Password Function
function generatePassword() {
    let charset = '';
    let password = '';
    
    // Build character set based on selected options
    if (includeUppercase.checked) charset += uppercase;
    if (includeLowercase.checked) charset += lowercase;
    if (includeNumbers.checked) charset += numbers;
    if (includeSymbols.checked) charset += symbols;
    
    // Validate at least one option is selected
    if (charset === '') {
        alert('⚠️ Please select at least one character type!');
        return;
    }
    
    const length = parseInt(passwordLength.value);
    
    // Generate password
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    
    // Ensure password meets all selected criteria
    if (includeUppercase.checked && !/[A-Z]/.test(password)) {
        password = ensureCharType(password, uppercase);
    }
    if (includeLowercase.checked && !/[a-z]/.test(password)) {
        password = ensureCharType(password, lowercase);
    }
    if (includeNumbers.checked && !/[0-9]/.test(password)) {
        password = ensureCharType(password, numbers);
    }
    if (includeSymbols.checked && !/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) {
        password = ensureCharType(password, symbols);
    }
    
    generatedPassword.value = password;
    generatedPassword.classList.add('fade-in');
}

// Helper function to ensure character type is included
function ensureCharType(password, charset) {
    const randomIndex = Math.floor(Math.random() * password.length);
    const randomChar = charset[Math.floor(Math.random() * charset.length)];
    return password.substring(0, randomIndex) + randomChar + password.substring(randomIndex + 1);
}

// Generate button click
generateBtn.addEventListener('click', generatePassword);

// Copy to clipboard function
function copyToClipboard(text, button) {
    navigator.clipboard.writeText(text).then(() => {
        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i>';
        button.classList.add('copy-success');
        
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.classList.remove('copy-success');
        }, 2000);
    }).catch(err => {
        alert('Failed to copy: ' + err);
    });
}

// Copy generated password
copyBtn.addEventListener('click', () => {
    if (generatedPassword.value) {
        copyToClipboard(generatedPassword.value, copyBtn);
    }
});

// Copy suggested password
copySuggestedBtn.addEventListener('click', () => {
    if (suggestedPassword.value) {
        copyToClipboard(suggestedPassword.value, copySuggestedBtn);
    }
});

// Toggle password visibility
togglePassword.addEventListener('click', () => {
    if (checkPassword.type === 'password') {
        checkPassword.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        checkPassword.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
});

// Check Password Strength
function checkPasswordStrength() {
    const password = checkPassword.value;
    
    if (!password) {
        alert('⚠️ Please enter a password to check!');
        return;
    }
    
    strengthResult.classList.remove('d-none');
    strengthResult.classList.add('fade-in');
    
    let score = 0;
    const weaknesses = [];
    
    // Length check
    if (password.length < 8) {
        weaknesses.push('Password is too short (minimum 8 characters)');
    } else if (password.length >= 8 && password.length < 12) {
        score += 1;
    } else if (password.length >= 12 && password.length < 16) {
        score += 2;
    } else {
        score += 3;
    }
    
    // Uppercase check
    if (!/[A-Z]/.test(password)) {
        weaknesses.push('No uppercase letters');
    } else {
        score += 1;
    }
    
    // Lowercase check
    if (!/[a-z]/.test(password)) {
        weaknesses.push('No lowercase letters');
    } else {
        score += 1;
    }
    
    // Number check
    if (!/[0-9]/.test(password)) {
        weaknesses.push('No numbers');
    } else {
        score += 1;
    }
    
    // Symbol check
    if (!/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) {
        weaknesses.push('No special symbols');
    } else {
        score += 2;
    }
    
    // Common password check
    if (commonPasswords.includes(password.toLowerCase())) {
        weaknesses.push('This is a commonly used password');
        score = Math.max(0, score - 3);
    }
    
    // Sequential characters check
    if (/012|123|234|345|456|567|678|789|abc|bcd|cde|def/.test(password.toLowerCase())) {
        weaknesses.push('Contains sequential characters');
        score = Math.max(0, score - 1);
    }
    
    // Repeated characters check
    if (/(.)\1{2,}/.test(password)) {
        weaknesses.push('Contains repeated characters');
        score = Math.max(0, score - 1);
    }
    
    // Display results
    displayStrengthResult(score, weaknesses, password);
}

// Display strength result
function displayStrengthResult(score, weaknesses, originalPassword) {
    let strengthLevel, strengthClass, percentage, alertClass;
    
    if (score <= 3) {
        strengthLevel = 'Very Weak';
        strengthClass = 'strength-weak';
        alertClass = 'alert-danger';
        percentage = 20;
    } else if (score <= 5) {
        strengthLevel = 'Weak';
        strengthClass = 'strength-fair';
        alertClass = 'alert-warning';
        percentage = 40;
    } else if (score <= 7) {
        strengthLevel = 'Fair';
        strengthClass = 'strength-good';
        alertClass = 'alert-info';
        percentage = 60;
    } else if (score <= 9) {
        strengthLevel = 'Strong';
        strengthClass = 'strength-strong';
        alertClass = 'alert-success';
        percentage = 80;
    } else {
        strengthLevel = 'Very Strong';
        strengthClass = 'strength-very-strong';
        alertClass = 'alert-success';
        percentage = 100;
    }
    
    // Update alert
    strengthAlert.className = `alert ${alertClass}`;
    strengthTitle.textContent = `Password Strength: ${strengthLevel}`;
    
    // Update details
    strengthDetails.innerHTML = `
        <p class="mb-1"><strong>Length:</strong> ${originalPassword.length} characters</p>
        <p class="mb-0"><strong>Score:</strong> ${score}/10</p>
    `;
    
    // Update progress bar
    strengthBar.style.width = `${percentage}%`;
    strengthBar.className = `progress-bar ${strengthClass}`;
    strengthBar.textContent = `${percentage}%`;
    
    // Display weaknesses
    if (weaknesses.length > 0) {
        weaknessSection.classList.remove('d-none');
        weaknessList.innerHTML = weaknesses.map(w => `<li>${w}</li>`).join('');
        
        // Generate stronger password
        const strongerPassword = generateStrongerPassword(originalPassword.length);
        suggestedPassword.value = strongerPassword;
    } else {
        weaknessSection.classList.add('d-none');
    }
}

// Generate stronger password based on weaknesses
function generateStrongerPassword(minLength) {
    const length = Math.max(minLength, 16); // At least 16 characters
    let charset = uppercase + lowercase + numbers + symbols;
    let password = '';
    
    // Ensure at least one of each type
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    
    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
        password += charset[Math.floor(Math.random() * charset.length)];
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
}

// Check button click
checkBtn.addEventListener('click', checkPasswordStrength);

// Check password on Enter key
checkPassword.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkPasswordStrength();
    }
});

// Generate initial password on page load
window.addEventListener('load', () => {
    generatePassword();
});

// Add smooth animations
const animateElements = document.querySelectorAll('.card');
animateElements.forEach((el, index) => {
    setTimeout(() => {
        el.classList.add('fade-in');
    }, index * 100);
});
