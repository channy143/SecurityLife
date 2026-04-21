import { getStrengthColor, getStrengthLabel } from '../../utils/passwordUtils'

const PasswordStrengthBar = ({ score, strength }) => {
  const colorClass = getStrengthColor(strength)
  const label = getStrengthLabel(strength)

  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
        <div
          className={`h-3 rounded-full transition-all duration-500 ease-out ${colorClass}`}
          style={{ width: `${score}%` }}
        ></div>
      </div>

      {/* Score and label */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600">Strength: <span className={`font-semibold ${
          strength === 'weak' ? 'text-red-500' :
          strength === 'medium' ? 'text-yellow-500' :
          strength === 'strong' ? 'text-green-500' :
          'text-gray-500'
        }`}>{label}</span></span>
        <span className="text-gray-500">{score}/100</span>
      </div>
    </div>
  )
}

export default PasswordStrengthBar
