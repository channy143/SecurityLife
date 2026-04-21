# SecureLife

A full-stack web application focused on cybersecurity awareness and protection. SecureLife helps users improve their digital security through password analysis, multi-factor authentication simulation, and cyber hygiene assessment.

## Features

- **Password Strength Checker**: Real-time password analysis with scoring and recommendations
- **MFA with Real Email**: Two-factor authentication that sends actual OTP codes to email (via EmailJS)
- **Cyber Hygiene Assessment**: Comprehensive security habits questionnaire with personalized recommendations
- **User Dashboard**: Track your security progress and view activity history
- **Supabase Integration**: Secure authentication and data persistence

## Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Supabase (Authentication + Database)
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM

## Project Structure

```
securelife/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable UI components (Navbar, Footer, Loader, ProtectedRoute)
│   │   ├── password/        # PasswordStrengthBar component
│   │   ├── mfa/             # OTPInput component
│   │   └── hygiene/         # QuestionCard component
│   ├── pages/               # Route pages
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── OTPVerification.jsx
│   │   ├── PasswordChecker.jsx
│   │   ├── CyberHygiene.jsx
│   │   └── Dashboard.jsx
│   ├── services/            # Business logic and API calls
│   │   ├── supabaseClient.js
│   │   ├── authService.js
│   │   ├── passwordService.js
│   │   ├── hygieneService.js
│   │   └── otpService.js
│   ├── context/             # Global state management
│   │   └── AuthContext.jsx
│   ├── hooks/               # Custom React hooks
│   │   └── useAuth.js
│   ├── utils/               # Helper utilities
│   │   ├── passwordUtils.js
│   │   ├── scoreUtils.js
│   │   └── otpUtils.js
│   ├── routes/              # Routing configuration
│   │   └── AppRoutes.jsx
│   ├── styles/              # Global styles
│   │   └── index.css
│   ├── App.jsx              # Root component
│   └── main.jsx             # Entry point
├── .env                     # Environment variables
└── package.json
```

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account (free tier works fine)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd securelife
npm install
```

### 2. Supabase Setup

1. Create a new project on [Supabase](https://supabase.com)
2. Go to Project Settings > API to get your credentials
3. Enable Email/Password authentication in Authentication > Providers
4. Create the following tables in the SQL Editor:

```sql
-- password_logs table
CREATE TABLE password_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  password_score INTEGER NOT NULL,
  strength TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- hygiene_results table
CREATE TABLE hygiene_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  risk_level TEXT NOT NULL,
  recommendations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- mfa_logs table
CREATE TABLE mfa_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('success', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) and create policies
ALTER TABLE password_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE hygiene_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE mfa_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can only access their own password logs" 
  ON password_logs FOR ALL 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own hygiene results" 
  ON hygiene_results FOR ALL 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own mfa logs" 
  ON mfa_logs FOR ALL 
  USING (auth.uid() = user_id);
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace `your_supabase_project_url` and `your_supabase_anon_key` with your actual Supabase credentials.

### 4. (Optional) Set Up EmailJS for Real MFA

To send actual OTP codes via email instead of simulation mode:

1. Sign up for a free account at [EmailJS](https://www.emailjs.com/)
2. Create an **Email Service** (connect your Gmail, Outlook, etc.)
3. Create an **Email Template** with these variables:
   - `{{to_email}}` - Recipient email
   - `{{otp_code}}` - The 6-digit OTP code
   - `{{user_name}}` - User's name
   - `{{app_name}}` - App name (SecureLife)
   - `{{expiry_time}}` - Code expiry (5 minutes)
4. Get your credentials from the EmailJS dashboard
5. Add to your `.env` file:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

Without these variables, the app will work in **simulation mode** showing the OTP on screen.

### 5. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Usage Guide

### Password Checker
- Enter any password to see real-time strength analysis
- View score (0-100) and strength level (Weak/Medium/Strong)
- Get personalized improvement suggestions
- Generate strong passwords automatically
- Save results when logged in

### Cyber Hygiene Assessment
- Answer 8 questions about your security habits
- Get a comprehensive security score
- Receive personalized recommendations
- Risk classification (Low/Medium/High)

### MFA Simulation
- Register a new account
- Login with email and password
- View the simulated OTP (displayed for testing)
- Enter the OTP to access the dashboard

### Dashboard
- View latest password strength score
- See cyber hygiene risk level
- Check MFA status
- Browse activity history

## Routes

| Route | Description | Access |
|-------|-------------|--------|
| `/` | Home page | Public |
| `/login` | Login page | Public |
| `/register` | Registration page | Public |
| `/otp` | MFA verification | Public (after login) |
| `/password-checker` | Password analysis | Public |
| `/cyber-hygiene` | Security assessment | Public |
| `/dashboard` | User dashboard | Protected |

## Security Features

- Password validation with strength scoring
- Secure authentication via Supabase Auth
- Row Level Security (RLS) on all database tables
- MFA flow simulation with time-limited OTP
- Environment variables for sensitive configuration

## License

MIT License - feel free to use this project for learning or development.

## Contributing

Contributions are welcome! Please ensure your code follows the existing patterns and includes proper error handling.

## Support

For issues or questions, please check the Supabase documentation or React documentation first.
