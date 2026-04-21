import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, Lock, CheckCircle, History, User, AlertTriangle, FileCheck } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { getLatestPasswordLog, getPasswordLogs } from '../services/passwordService'
import { getLatestHygieneResult, getHygieneResults } from '../services/hygieneService'
import { getLatestMFALog, getMFALogs } from '../services/otpService'
import { getStrengthColor, getStrengthLabel } from '../utils/passwordUtils'
import { getRiskColor, getRiskTextColor } from '../utils/scoreUtils'
import Loader from '../components/common/Loader'
import { CardSpotlight } from '../components/ui/CardSpotlight'

const Dashboard = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [passwordData, setPasswordData] = useState(null)
  const [hygieneData, setHygieneData] = useState(null)
  const [mfaData, setMfaData] = useState(null)
  const [activityLogs, setActivityLogs] = useState([])

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return

      setLoading(true)

      try {
        // Fetch latest password log
        const { data: passwordLog } = await getLatestPasswordLog(user.id)
        setPasswordData(passwordLog)

        // Fetch latest hygiene result
        const { data: hygieneResult } = await getLatestHygieneResult(user.id)
        setHygieneData(hygieneResult)

        // Fetch latest MFA log
        const { data: mfaLog } = await getLatestMFALog(user.id)
        setMfaData(mfaLog)

        // Fetch recent activity
        const { data: passwordHistory } = await getPasswordLogs(user.id, 5)
        const { data: hygieneHistory } = await getHygieneResults(user.id, 5)
        const { data: mfaHistory } = await getMFALogs(user.id, 5)

        // Combine and sort activity logs
        const allLogs = [
          ...(passwordHistory || []).map(log => ({
            type: 'password',
            date: log.created_at,
            title: `Password check: ${log.strength}`,
            details: `Score: ${log.password_score}/100`
          })),
          ...(hygieneHistory || []).map(log => ({
            type: 'hygiene',
            date: log.created_at,
            title: `Security assessment: ${log.risk_level}`,
            details: `Score: ${log.score} points`
          })),
          ...(mfaHistory || []).map(log => ({
            type: 'mfa',
            date: log.created_at,
            title: `MFA verification: ${log.status}`,
            details: log.status === 'success' ? 'Successfully verified' : 'Verification failed'
          }))
        ]

        // Sort by date (newest first)
        allLogs.sort((a, b) => new Date(b.date) - new Date(a.date))
        setActivityLogs(allLogs.slice(0, 10))
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [user])

  const formatDate = (dateString) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return <Loader fullScreen />
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary-100">
              <Shield className="w-6 h-6 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Security Dashboard</h1>
          </div>
          <p className="text-slate-600 ml-11">
            Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}! Here's your security overview.
          </p>
        </motion.div>

        {/* Stats Grid with CardSpotlight */}
        <motion.div 
          className="grid md:grid-cols-3 gap-6 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Password Strength Card */}
          <motion.div variants={itemVariants}>
            <CardSpotlight className="h-full p-6 bg-white" spotlightColor="rgba(59, 130, 246, 0.08)">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800">Password Strength</h3>
                <div className="p-2 rounded-lg bg-blue-100">
                  <Lock className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              {passwordData ? (
                <div>
                  <div className="flex items-center mb-3">
                    <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                      passwordData.strength === 'weak' ? 'bg-red-500' :
                      passwordData.strength === 'medium' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}></span>
                    <span className="text-lg font-semibold capitalize text-slate-700">{passwordData.strength}</span>
                  </div>
                  <p className="text-3xl font-bold text-slate-900 mb-2">{passwordData.password_score}/100</p>
                  <p className="text-sm text-slate-500">Last checked: {formatDate(passwordData.created_at)}</p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-slate-500 mb-3">No password checks yet</p>
                  <a href="/password-checker" className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-1">
                    Check your password →
                  </a>
                </div>
              )}
            </CardSpotlight>
          </motion.div>

          {/* Cyber Hygiene Card */}
          <motion.div variants={itemVariants}>
            <CardSpotlight className="h-full p-6 bg-white" spotlightColor="rgba(168, 85, 247, 0.08)">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800">Cyber Hygiene</h3>
                <div className="p-2 rounded-lg bg-purple-100">
                  <FileCheck className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              {hygieneData ? (
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold text-white mb-3 ${getRiskColor(hygieneData.risk_level)}`}>
                    {hygieneData.risk_level}
                  </span>
                  <p className="text-3xl font-bold text-slate-900 mb-2">{hygieneData.score} pts</p>
                  <p className="text-sm text-slate-500">Last assessed: {formatDate(hygieneData.created_at)}</p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-slate-500 mb-3">No assessments yet</p>
                  <a href="/cyber-hygiene" className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-1">
                    Take the assessment →
                  </a>
                </div>
              )}
            </CardSpotlight>
          </motion.div>

          {/* MFA Status Card */}
          <motion.div variants={itemVariants}>
            <CardSpotlight className="h-full p-6 bg-white" spotlightColor="rgba(34, 197, 94, 0.08)">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800">MFA Status</h3>
                <div className="p-2 rounded-lg bg-green-100">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
              {mfaData ? (
                <div>
                  <div className="flex items-center mb-3">
                    <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                      mfaData.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                    }`}></span>
                    <span className={`text-lg font-semibold capitalize ${
                      mfaData.status === 'success' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {mfaData.status}
                    </span>
                  </div>
                  <p className="text-slate-600 mb-2 text-sm">
                    {mfaData.status === 'success' 
                      ? 'Last MFA verification was successful' 
                      : 'Last MFA verification failed'}
                  </p>
                  <p className="text-sm text-slate-500">{formatDate(mfaData.created_at)}</p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-slate-500 mb-3">No MFA attempts yet</p>
                  <a href="/login" className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-1">
                    Login to test MFA →
                  </a>
                </div>
              )}
            </CardSpotlight>
          </motion.div>
        </motion.div>

        {/* Activity History */}
        <motion.div 
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <History className="w-5 h-5 text-slate-600" />
            <h3 className="text-lg font-semibold text-slate-800">Recent Activity</h3>
          </div>
          
          {activityLogs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Activity
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {activityLogs.map((log, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                            log.type === 'password' ? 'bg-blue-500' :
                            log.type === 'hygiene' ? 'bg-purple-500' :
                            'bg-green-500'
                          }`}></span>
                          <span className="text-sm text-gray-800">{log.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{log.details}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{formatDate(log.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No activity yet. Start using SecureLife features!</p>
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          className="mt-8 grid md:grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <a
            href="/password-checker"
            className="bg-primary-600 text-white rounded-lg p-4 hover:bg-primary-700 transition flex items-center justify-between"
          >
            <span className="font-semibold">Check Password Strength</span>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
          <a
            href="/cyber-hygiene"
            className="bg-primary-600 text-white rounded-lg p-4 hover:bg-primary-700 transition flex items-center justify-between"
          >
            <span className="font-semibold">Take Security Assessment</span>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard
