import { useState } from 'react'
import { hygieneQuestions, calculateHygieneScore, determineRiskLevel, generateRecommendations, getRiskColor, getRiskTextColor } from '../utils/scoreUtils'
import { saveHygieneResult } from '../services/hygieneService'
import { useAuth } from '../hooks/useAuth'
import QuestionCard from '../components/hygiene/QuestionCard'
import Loader from '../components/common/Loader'

const CyberHygiene = () => {
  const [answers, setAnswers] = useState({})
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saveStatus, setSaveStatus] = useState('')
  
  const { user } = useAuth()

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  const handleNext = () => {
    if (currentQuestion < hygieneQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    
    // Calculate results
    const { score, percentage } = calculateHygieneScore(answers)
    const riskLevel = determineRiskLevel(percentage)
    const recommendations = generateRecommendations(answers, percentage)
    
    const resultData = {
      score,
      percentage,
      riskLevel,
      recommendations
    }
    
    setResult(resultData)
    
    // Save to database if user is logged in
    if (user) {
      try {
        const { error } = await saveHygieneResult(
          user.id,
          score,
          riskLevel,
          JSON.stringify(recommendations)
        )
        
        if (error) {
          setSaveStatus('Failed to save result, but you can still view your assessment.')
        } else {
          setSaveStatus('Result saved successfully!')
        }
      } catch (err) {
        setSaveStatus('Failed to save result, but you can still view your assessment.')
        console.error('Save error:', err)
      }
    } else {
      setSaveStatus('Login to save your results and track your progress.')
    }
    
    setLoading(false)
  }

  const handleRestart = () => {
    setAnswers({})
    setCurrentQuestion(0)
    setResult(null)
    setSaveStatus('')
  }

  // Check if all questions are answered
  const allAnswered = Object.keys(answers).length === hygieneQuestions.length

  // Show results if assessment is complete
  if (result) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Assessment Complete</h1>
            <p className="text-gray-600">Here are your cyber hygiene results</p>
          </div>

          {/* Result Card */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            {/* Score Display */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gray-100 mb-4">
                <span className="text-4xl font-bold text-gray-800">{result.percentage}%</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Security Score</h2>
              <span className={`inline-block px-4 py-2 rounded-full text-lg font-semibold ${getRiskColor(result.riskLevel)} text-white`}>
                {result.riskLevel}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className={`h-4 rounded-full transition-all duration-1000 ${getRiskColor(result.riskLevel)}`}
                  style={{ width: `${result.percentage}%` }}
                ></div>
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="grid grid-cols-3 gap-4 mb-8 text-center">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-800">{result.score}</p>
                <p className="text-sm text-gray-600">Points Earned</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-800">{hygieneQuestions.length * 10}</p>
                <p className="text-sm text-gray-600">Maximum Points</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-800">{result.percentage}%</p>
                <p className="text-sm text-gray-600">Percentage</p>
              </div>
            </div>

            {/* Recommendations */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Personalized Recommendations</h3>
              <div className="space-y-3">
                {result.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start p-3 bg-yellow-50 rounded-lg">
                    <svg className="h-5 w-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <p className="text-gray-700">{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Status */}
            {saveStatus && (
              <p className={`text-sm text-center mb-4 ${
                saveStatus.includes('success') ? 'text-green-600' : 
                saveStatus.includes('Login') ? 'text-blue-600' : 'text-yellow-600'
              }`}>
                {saveStatus}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleRestart}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Retake Assessment
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Print Results
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Cyber Hygiene Assessment</h1>
          <p className="text-gray-600">
            Evaluate your digital security habits and get personalized recommendations
          </p>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {Object.keys(answers).length} of {hygieneQuestions.length} answered
            </span>
            <div className="w-48 bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(Object.keys(answers).length / hygieneQuestions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <QuestionCard
          question={hygieneQuestions[currentQuestion].question}
          options={hygieneQuestions[currentQuestion].options}
          selectedValue={answers[hygieneQuestions[currentQuestion].id]}
          onChange={(value) => handleAnswer(hygieneQuestions[currentQuestion].id, value)}
          questionNumber={currentQuestion + 1}
          totalQuestions={hygieneQuestions.length}
        />

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {currentQuestion < hygieneQuestions.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={!answers[hygieneQuestions[currentQuestion].id]}
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered || loading}
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader size="small" /> : 'Submit Assessment'}
            </button>
          )}
        </div>

        {/* Question Navigation Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {hygieneQuestions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentQuestion
                  ? 'bg-primary-600'
                  : answers[hygieneQuestions[index].id]
                    ? 'bg-green-400'
                    : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default CyberHygiene
