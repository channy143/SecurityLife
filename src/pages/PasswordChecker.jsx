import { useState } from 'react'
import { calculatePasswordStrength, generateStrongPassword, getStrengthColor } from '../utils/passwordUtils'
import { savePasswordLog } from '../services/passwordService'
import { useAuth } from '../hooks/useAuth'
import PasswordStrengthBar from '../components/password/PasswordStrengthBar'
import Loader from '../components/common/Loader'

const PasswordChecker = () => {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saveStatus, setSaveStatus] = useState('')
  
  const { user } = useAuth()

  // Analyze password in real-time
  const handlePasswordChange = (value) => {
    setPassword(value)
    const result = calculatePasswordStrength(value)
    setAnalysis(result)
    setSaveStatus('')
  }

  // Generate a strong password
  const handleGeneratePassword = () => {
    const newPassword = generateStrongPassword(16)
    setPassword(newPassword)
    const result = calculatePasswordStrength(newPassword)
    setAnalysis(result)
    setSaveStatus('')
  }

  // Save password analysis to database
  const handleSaveResult = async () => {
    if (!user) {
      setSaveStatus('Please login to save results')
      return
    }

    if (!analysis || !password) {
      setSaveStatus('Please enter a password first')
      return
    }

    setLoading(true)
    setSaveStatus('')

    try {
      const { error } = await savePasswordLog(user.id, analysis.score, analysis.strength)
      
      if (error) {
        setSaveStatus('Failed to save result. Please try again.')
      } else {
        setSaveStatus('Result saved successfully!')
      }
    } catch (err) {
      setSaveStatus('An error occurred while saving.')
      console.error('Save error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Password Strength Checker</h1>
          <p className="text-gray-600">
            Analyze your password strength and get personalized recommendations
          </p>
        </div>

        {/* Password Input Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter Password
          </label>
          <div className="relative mb-4">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              className="block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Type or paste your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>

          {/* Generate Password Button */}
          <button
            onClick={handleGeneratePassword}
            className="w-full mb-4 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <span className="flex items-center justify-center">
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Generate Strong Password
            </span>
          </button>

          {/* Strength Bar */}
          {analysis && (
            <div className="mb-4">
              <PasswordStrengthBar score={analysis.score} strength={analysis.strength} />
            </div>
          )}
        </div>

        {/* Analysis Results */}
        {analysis && password && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Analysis Results</h3>
            
            {/* Strength Badge */}
            <div className="flex items-center mb-4">
              <span className="text-gray-600 mr-2">Strength Level:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                analysis.strength === 'weak' ? 'bg-red-100 text-red-700' :
                analysis.strength === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}>
                {analysis.strength.charAt(0).toUpperCase() + analysis.strength.slice(1)}
              </span>
            </div>

            {/* Score */}
            <div className="mb-4">
              <p className="text-gray-600">
                Score: <span className="font-semibold">{analysis.score}/100</span>
              </p>
            </div>

            {/* Suggestions */}
            {analysis.suggestions.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Suggestions to improve:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {analysis.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-sm text-gray-600">{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-6">
              <button
                onClick={handleSaveResult}
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {loading ? <Loader size="small" /> : 'Save Result to My Account'}
              </button>
              
              {!user && (
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Login to save your results and track your progress over time.
                </p>
              )}
              
              {saveStatus && (
                <p className={`text-sm mt-2 text-center ${
                  saveStatus.includes('success') ? 'text-green-600' : 
                  saveStatus.includes('login') ? 'text-blue-600' : 'text-red-600'
                }`}>
                  {saveStatus}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Password Tips */}
        <div className="bg-primary-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-primary-800 mb-4">Password Security Tips</h3>
          <ul className="space-y-2 text-sm text-primary-700">
            <li className="flex items-start">
              <svg className="h-5 w-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Use at least 12 characters for better security
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Include uppercase, lowercase, numbers, and special characters
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Avoid common words, names, and dictionary terms
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Use a unique password for each account
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Consider using a password manager
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default PasswordChecker
