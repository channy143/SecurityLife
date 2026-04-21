import { useState } from 'react'

const QuestionCard = ({ question, options, selectedValue, onChange, questionNumber, totalQuestions }) => {
  const [localSelected, setLocalSelected] = useState(selectedValue)

  const handleSelect = (value) => {
    setLocalSelected(value)
    onChange(value)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      {/* Progress indicator */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-500">
          Question {questionNumber} of {totalQuestions}
        </span>
        <div className="w-32 bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {question}
      </h3>

      {/* Options */}
      <div className="space-y-3">
        {options.map((option) => (
          <div
            key={option.value}
            onClick={() => handleSelect(option.value)}
            className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
              (selectedValue === option.value || localSelected === option.value)
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name={`question-${questionNumber}`}
              value={option.value}
              checked={selectedValue === option.value}
              onChange={() => handleSelect(option.value)}
              className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500 pointer-events-none"
            />
            <span className="ml-3 text-gray-700">{option.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default QuestionCard
