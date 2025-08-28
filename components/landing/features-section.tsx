import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, MessageSquare, BarChart3, Shield, Clock } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Users,
      title: "Intern Management",
      description: "Comprehensive profiles, progress tracking, and performance evaluation for all interns.",
    },
    {
      icon: Calendar,
      title: "Meeting Scheduler",
      description: "Integrated calendar system for scheduling meetings, reviews, and training sessions.",
    },
    {
      icon: MessageSquare,
      title: "Real-time Chat",
      description: "Instant communication between mentors, interns, and administrators.",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Detailed insights and reports on internship programs and participant progress.",
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Enterprise-grade security ensuring data privacy and protection.",
    },
    {
      icon: Clock,
      title: "Time Tracking",
      description: "Automated time tracking and attendance management for all participants.",
    },
  ]

  return (
    <section id="features" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Powerful Features for Modern Internship Management
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to run successful internship programs, from application to completion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-border">
              <CardHeader>
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-accent-foreground" />
                </div>
                <CardTitle className="text-xl font-semibold text-card-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
