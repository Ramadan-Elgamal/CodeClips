
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl font-headline">
            Terms of Service & Privacy Policy
          </h1>
        </div>
        
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Terms of Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>Welcome to CodeClips! By accessing or using our website, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you may not access the service.</p>
            <h4 className="font-semibold text-foreground pt-2">Content</h4>
            <p>Our service allows you to access curated programming tutorials from third-party platforms like YouTube. We are not responsible for the content of these third-party sites. All content is provided for educational purposes.</p>
            <h4 className="font-semibold text-foreground pt-2">Use License</h4>
            <p>Permission is granted to temporarily download one copy of the materials on CodeClips' website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>Your privacy is important to us. It is CodeClips' policy to respect your privacy regarding any information we may collect from you across our website.</p>
            <h4 className="font-semibold text-foreground pt-2">Information We Collect</h4>
            <p>We only ask for personal information when we truly need it to provide a service to you (like saving your favorite tutorials). We collect it by fair and lawful means, with your knowledge and consent. We use local storage in your browser to save your preferences and saved tutorials list. We do not store this information on our servers.</p>
            <h4 className="font-semibold text-foreground pt-2">Security</h4>
            <p>The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute security.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
