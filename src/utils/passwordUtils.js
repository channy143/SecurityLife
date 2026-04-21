/**
 * Password Utilities - Password strength analysis and validation
 */

// Calculate password strength score (0-100)
export const calculatePasswordStrength = (password) => {
  let score = 0
  const suggestions = []

  if (!password || password.length === 0) {
    return { score: 0, strength: 'none', suggestions: ['Enter a password'] }
  }

  // Length check (max 40 points)
  if (password.length >= 8) {
    score += 20
  } else {
    suggestions.push('Use at least 8 characters')
  }

  if (password.length >= 12) {
    score += 20
  }

  // Uppercase letters (15 points)
  if (/[A-Z]/.test(password)) {
    score += 15
  } else {
    suggestions.push('Add uppercase letters')
  }

  // Lowercase letters (15 points)
  if (/[a-z]/.test(password)) {
    score += 15
  } else {
    suggestions.push('Add lowercase letters')
  }

  // Numbers (15 points)
  if (/\d/.test(password)) {
    score += 15
  } else {
    suggestions.push('Add numbers')
  }

  // Special characters (15 points)
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    score += 15
  } else {
    suggestions.push('Add special characters (!@#$%^&*)')
  }

  // Determine strength level
  let strength
  if (score < 40) {
    strength = 'weak'
  } else if (score < 70) {
    strength = 'medium'
  } else {
    strength = 'strong'
  }

  // Add suggestion if password is too common (simulated check)
  if (isCommonPassword(password)) {
    score = Math.min(score, 30)
    strength = 'weak'
    suggestions.push('Avoid common passwords')
  }

  return { score, strength, suggestions }
}

// Check if password is in a list of common passwords
const isCommonPassword = (password) => {
  const commonPasswords = [
    'password', '123456', '12345678', 'qwerty', 'abc123',
    'password123', 'admin', 'letmein', 'welcome', 'monkey'
  ]
  return commonPasswords.includes(password.toLowerCase())
}

// Generate a strong random password
export const generateStrongPassword = (length = 16) => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const special = '!@#$%^&*()_+-=[]{}|;:,.<>?'
  
  const allChars = uppercase + lowercase + numbers + special
  let password = ''
  
  // Ensure at least one of each type
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += special[Math.floor(Math.random() * special.length)]
  
  // Fill the rest randomly
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)]
  }
  
  // Shuffle the password
  return password.split('').sort(() => 0.5 - Math.random()).join('')
}

// Validate password meets minimum requirements
export const validatePassword = (password, confirmPassword = null) => {
  const errors = []

  if (!password || password.length < 8) {
    errors.push('Password must be at least 8 characters')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }

  if (confirmPassword !== null && password !== confirmPassword) {
    errors.push('Passwords do not match')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Get color based on strength
export const getStrengthColor = (strength) => {
  const colors = {
    none: 'bg-gray-200',
    weak: 'bg-security-weak',
    medium: 'bg-security-medium',
    strong: 'bg-security-strong'
  }
  return colors[strength] || colors.none
}

// Get label based on strength
export const getStrengthLabel = (strength) => {
  const labels = {
    none: 'Enter Password',
    weak: 'Weak',
    medium: 'Medium',
    strong: 'Strong'
  }
  return labels[strength] || labels.none
}
