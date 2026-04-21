import { Link } from 'react-router-dom'
import { Shield, Lock, Key, ArrowRight, CheckCircle } from 'lucide-react'
import { Card3D } from '../components/ui/Card3D'
import { BackgroundLines } from '../components/ui/BackgroundLines'
import { motion } from 'framer-motion'

const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  const features = [
    {
      title: 'Password Security',
      description: 'Check the strength of your passwords in real-time and get personalized suggestions for improvement.',
      icon: <Lock className="h-8 w-8 text-primary-600" />
    },
    {
      title: 'MFA Authentication',
      description: 'Experience multi-factor authentication with our OTP simulation system for enhanced security.',
      icon: <Shield className="h-8 w-8 text-primary-600" />
    },
    {
      title: 'Cyber Hygiene Awareness',
      description: 'Assess your digital security habits and receive tailored recommendations to reduce your risk.',
      icon: <CheckCircle className="h-8 w-8 text-primary-600" />
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section with Background Lines */}
      <BackgroundLines className="bg-gradient-to-br from-slate-900 via-slate-800 to-primary-900 text-white min-h-[80vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex items-center justify-center min-h-[80vh]">
          <motion.div 
            className="text-center w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
              <Shield className="w-4 h-4 text-primary-400" />
              <span className="text-sm font-medium">Security First</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight text-center text-white">
              Protect Your Digital Life
            </h1>
            
            <motion.p 
              className="text-xl md:text-2xl mb-10 text-slate-300 max-w-3xl mx-auto leading-relaxed text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
            >
              Strengthen your cybersecurity with powerful tools for password analysis, 
              MFA protection, and personalized security assessments.
            </motion.p>
            
            <motion.div 
              className="flex justify-center gap-4 flex-wrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 0.5 }}
            >
              <Link
                to="/password-checker"
                className="group bg-white text-slate-900 px-8 py-4 rounded-xl font-semibold hover:bg-primary-50 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <Lock className="w-5 h-5" />
                Check Password Strength
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/cyber-hygiene"
                className="group border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 hover:border-white/50 transition-all duration-300 flex items-center gap-2"
              >
                <Shield className="w-5 h-5" />
                Take Security Test
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </BackgroundLines>

      {/* Features Section with 3D Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Features to Secure Your Digital Life
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Powerful tools designed to protect you from modern cyber threats
          </p>
        </motion.div>
        
        <motion.div 
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card3D className="h-full" intensity={25}>
                <div className="p-8 h-full bg-white rounded-2xl border border-slate-100">
                  <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 w-fit">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              </Card3D>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Stats Section with Spotlight Cards */}
      <div className="bg-slate-900 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { stat: '80%', text: 'of data breaches involve weak or stolen passwords' },
              { stat: '99.9%', text: 'of automated attacks blocked by MFA' },
              { stat: '95%', text: 'of breaches caused by human error' }
            ].map((item, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="text-center p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
              >
                <div className="text-5xl font-bold text-white mb-4">
                  {item.stat}
                </div>
                <p className="text-slate-400 text-lg">{item.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div 
          className="relative rounded-3xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-700 to-blue-600" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZ2LTRoMnY0aC0yem0tNiA2aC00di0yaDR2MnptMC02di00aC00djJoMnYyaDJ6bS02IDZoLTR2LTJoNHYyem0wLTZ2LTRoLTR2MmgydjJoMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50" />
          
          <div className="relative p-12 md:p-16 text-center text-white">
            <motion.h2 
              className="text-4xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Ready to Secure Your Accounts?
            </motion.h2>
            <motion.p 
              className="text-primary-100 mb-10 max-w-2xl mx-auto text-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              Create an account to track your security progress, save assessment results, 
              and access your personalized dashboard.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <Link
                to="/register"
                className="group inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-primary-50 transition-all duration-300 shadow-xl hover:shadow-2xl"
              >
                <Key className="w-5 h-5" />
                Get Started Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Home
