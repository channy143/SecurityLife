/**
 * Score Utilities - Risk calculation and scoring for cyber hygiene assessment
 */

// Cyber hygiene questions and their scoring
export const hygieneQuestions = [
  {
    id: 1,
    question: 'How often do you update your passwords?',
    options: [
      { value: 'never', label: 'Never', score: 0 },
      { value: 'rarely', label: 'Rarely (every few years)', score: 2 },
      { value: 'sometimes', label: 'Sometimes (once a year)', score: 5 },
      { value: 'often', label: 'Often (every 3-6 months)', score: 8 },
      { value: 'always', label: 'Always (monthly or when breached)', score: 10 }
    ]
  },
  {
    id: 2,
    question: 'Do you use the same password for multiple accounts?',
    options: [
      { value: 'yes_all', label: 'Yes, for all accounts', score: 0 },
      { value: 'yes_most', label: 'Yes, for most accounts', score: 2 },
      { value: 'sometimes', label: 'Sometimes', score: 5 },
      { value: 'rarely', label: 'Rarely', score: 8 },
      { value: 'never', label: 'Never - all unique passwords', score: 10 }
    ]
  },
  {
    id: 3,
    question: 'Do you use two-factor authentication (2FA/MFA)?',
    options: [
      { value: 'never', label: 'Never', score: 0 },
      { value: 'rarely', label: 'On 1-2 accounts', score: 3 },
      { value: 'sometimes', label: 'On some important accounts', score: 6 },
      { value: 'often', label: 'On most accounts', score: 8 },
      { value: 'always', label: 'On all supported accounts', score: 10 }
    ]
  },
  {
    id: 4,
    question: 'How do you store your passwords?',
    options: [
      { value: 'plaintext', label: 'Write them down on paper/notes', score: 2 },
      { value: 'browser', label: 'Browser saved passwords only', score: 4 },
      { value: 'memory', label: 'Try to remember them all', score: 3 },
      { value: 'encrypted', label: 'Encrypted file/document', score: 6 },
      { value: 'manager', label: 'Password manager', score: 10 }
    ]
  },
  {
    id: 5,
    question: 'How careful are you with public Wi-Fi?',
    options: [
      { value: 'very_risky', label: 'Use it for everything including banking', score: 0 },
      { value: 'risky', label: 'Use it for browsing and social media', score: 3 },
      { value: 'cautious', label: 'Only for non-sensitive browsing', score: 6 },
      { value: 'careful', label: 'Always use VPN on public Wi-Fi', score: 9 },
      { value: 'avoid', label: 'Avoid public Wi-Fi completely', score: 10 }
    ]
  },
  {
    id: 6,
    question: 'How do you handle suspicious emails?',
    options: [
      { value: 'click', label: 'Click links and open attachments', score: 0 },
      { value: 'sometimes', label: 'Sometimes click if looks legitimate', score: 3 },
      { value: 'cautious', label: 'Usually cautious but occasionally click', score: 6 },
      { value: 'verify', label: 'Verify sender before clicking', score: 9 },
      { value: 'expert', label: 'Never click, always verify independently', score: 10 }
    ]
  },
  {
    id: 7,
    question: 'Do you keep your software and devices updated?',
    options: [
      { value: 'never', label: 'Never update', score: 0 },
      { value: 'delay', label: 'Delay updates for weeks/months', score: 3 },
      { value: 'sometimes', label: 'Update when convenient', score: 5 },
      { value: 'prompt', label: 'Update within a few days', score: 8 },
      { value: 'immediate', label: 'Update immediately when available', score: 10 }
    ]
  },
  {
    id: 8,
    question: 'Do you have antivirus/anti-malware protection?',
    options: [
      { value: 'none', label: 'No protection', score: 0 },
      { value: 'inactive', label: 'Installed but not active', score: 2 },
      { value: 'basic', label: 'Basic free antivirus', score: 5 },
      { value: 'paid', label: 'Paid antivirus software', score: 8 },
      { value: 'comprehensive', label: 'Comprehensive security suite', score: 10 }
    ]
  }
]

// Calculate total score from answers
export const calculateHygieneScore = (answers) => {
  let totalScore = 0
  let maxPossibleScore = 0

  hygieneQuestions.forEach((question) => {
    const selectedValue = answers[question.id]
    const selectedOption = question.options.find(opt => opt.value === selectedValue)
    
    if (selectedOption) {
      totalScore += selectedOption.score
    }
    
    // Maximum score for this question is the highest option score
    const maxQuestionScore = Math.max(...question.options.map(opt => opt.score))
    maxPossibleScore += maxQuestionScore
  })

  // Convert to percentage (0-100)
  const percentage = Math.round((totalScore / maxPossibleScore) * 100)
  
  return {
    score: totalScore,
    maxScore: maxPossibleScore,
    percentage
  }
}

// Determine risk level based on score
export const determineRiskLevel = (percentage) => {
  if (percentage >= 80) {
    return 'Low Risk'
  } else if (percentage >= 50) {
    return 'Medium Risk'
  } else {
    return 'High Risk'
  }
}

// Generate personalized recommendations based on answers
export const generateRecommendations = (answers, percentage) => {
  const recommendations = []

  // Analyze specific answers and provide targeted recommendations
  if (answers[1] === 'never' || answers[1] === 'rarely') {
    recommendations.push('Set calendar reminders to update passwords every 3-6 months')
  }

  if (answers[2] === 'yes_all' || answers[2] === 'yes_most') {
    recommendations.push('Use a password manager to create unique passwords for each account')
  }

  if (answers[3] === 'never' || answers[3] === 'rarely') {
    recommendations.push('Enable two-factor authentication on all critical accounts (email, banking)')
  }

  if (answers[4] !== 'manager') {
    recommendations.push('Consider using a reputable password manager like Bitwarden or 1Password')
  }

  if (answers[5] === 'very_risky' || answers[5] === 'risky') {
    recommendations.push('Avoid accessing sensitive accounts on public Wi-Fi, or always use a VPN')
  }

  if (answers[6] === 'click' || answers[6] === 'sometimes') {
    recommendations.push('Be cautious with email links - verify sender addresses and hover before clicking')
  }

  if (answers[7] === 'never' || answers[7] === 'delay') {
    recommendations.push('Enable automatic updates for your operating system and applications')
  }

  if (answers[8] === 'none' || answers[8] === 'inactive') {
    recommendations.push('Install and activate reputable antivirus software')
  }

  // Add general recommendations based on overall score
  if (percentage < 50) {
    recommendations.push('Your digital security needs immediate attention - prioritize these recommendations')
  } else if (percentage < 80) {
    recommendations.push('You have a decent foundation - focus on the specific areas highlighted above')
  } else {
    recommendations.push('Great job! Continue your security practices and stay informed about new threats')
  }

  return recommendations
}

// Get color based on risk level
export const getRiskColor = (riskLevel) => {
  const colors = {
    'Low Risk': 'bg-security-strong',
    'Medium Risk': 'bg-security-medium',
    'High Risk': 'bg-security-weak'
  }
  return colors[riskLevel] || 'bg-gray-200'
}

// Get text color based on risk level
export const getRiskTextColor = (riskLevel) => {
  const colors = {
    'Low Risk': 'text-green-600',
    'Medium Risk': 'text-yellow-600',
    'High Risk': 'text-red-600'
  }
  return colors[riskLevel] || 'text-gray-600'
}
