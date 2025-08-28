export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-accent-foreground font-bold text-lg">RSF</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Renu Sharma Foundation</h3>
                <p className="text-sm text-primary-foreground/80">Empowering Future Leaders</p>
              </div>
            </div>
            <p className="text-primary-foreground/80 leading-relaxed">
              Transforming careers through meaningful internships and mentorship programs. Join us in building the next
              generation of industry leaders.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li>
                <a href="#about" className="hover:text-accent transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-accent transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#programs" className="hover:text-accent transition-colors">
                  Programs
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-accent transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact Info</h4>
            <div className="space-y-2 text-primary-foreground/80">
              <p>Email: contact@renusharmafoundation.org</p>
              <p>Phone: +91 96714 57366</p>
              <p>Address: 123 NGO Street,
                 Community Center, City, 
                 Country 12345</p>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/80">
          <p>&copy; 2024 Renu Sharma Foundation. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
