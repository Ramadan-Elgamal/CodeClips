
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Zap } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl font-headline">
            About CodeClips
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Learn to code by building real-world projects.
          </p>
        </div>

        <Card className="mt-16">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Our Mission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              At CodeClips, our mission is to break "tutorial hell" by providing a curated collection of project-based coding tutorials. We believe the best way to learn is by doing. We hand-pick the highest quality tutorials from across the web, focusing on projects that are practical, engaging, and build real-world skills.
            </p>
            <p>
              Whether you're a beginner taking your first steps into code or an experienced developer looking to learn a new stack, CodeClips is here to help you build your portfolio and achieve your learning goals.
            </p>
          </CardContent>
        </Card>

        <div className="mt-16 grid grid-cols-1 gap-y-10 md:grid-cols-2 md:gap-x-8">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-xl font-semibold font-headline">Why CodeClips?</h3>
            <p className="mt-2 text-muted-foreground">
              We vet every tutorial for quality, clarity, and relevance, so you can spend less time searching and more time coding. Our platform is designed to help you track your progress and stay motivated on your learning journey.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Mail className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-xl font-semibold font-headline">Get in Touch</h3>
            <p className="mt-2 text-muted-foreground">
              Have questions, feedback, or a tutorial suggestion? We'd love to hear from you. Reach out to us on our social channels or submit a tutorial through our platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
