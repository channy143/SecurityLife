const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-semibold mb-4">SecureLife</h3>
            <p className="text-gray-400 text-sm">
              Protecting your digital life through education, tools, and awareness.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="text-gray-400 hover:text-white transition">Home</a>
              </li>
              <li>
                <a href="/password-checker" className="text-gray-400 hover:text-white transition">Password Checker</a>
              </li>
              <li>
                <a href="/cyber-hygiene" className="text-gray-400 hover:text-white transition">Cyber Hygiene</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Security Tips</h3>
            <p className="text-gray-400 text-sm">
              Always use strong, unique passwords and enable two-factor authentication on all your accounts.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} SecureLife. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
