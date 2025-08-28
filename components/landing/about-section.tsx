export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-foreground mb-6">About Renu Sharma Foundation</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                The Renu Sharma Foundation is dedicated to empowering the next generation of leaders through
                comprehensive internship and mentorship programs. Founded with the vision of bridging the gap between
                academic learning and professional excellence.
              </p>
              <p>
                Our mission is to provide students and young professionals with meaningful opportunities to develop
                their skills, gain real-world experience, and build lasting connections with industry experts and
                mentors.
              </p>
              <p>
                Through our innovative internship management platform, we've successfully connected thousands of interns
                with leading organizations, creating pathways to successful careers and meaningful impact in their
                chosen fields.
              </p>
            </div>
          </div>

          <div className="bg-card rounded-lg p-8 shadow-lg">
            <h3 className="text-2xl font-semibold text-card-foreground mb-6">Our Impact</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-2">2,500+</div>
                <div className="text-muted-foreground">Interns Placed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-2">150+</div>
                <div className="text-muted-foreground">Partner Organizations</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-2">95%</div>
                <div className="text-muted-foreground">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-2">50+</div>
                <div className="text-muted-foreground">Industry Sectors</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
