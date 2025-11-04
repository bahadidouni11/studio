export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-12">
        <h1 className="mb-8 text-4xl font-bold text-primary">Privacy Policy</h1>
        <div className="space-y-6 text-muted-foreground">
          <p>
            Your privacy is important to us. It is CartagPay Rewards' policy to respect your privacy regarding any information we may collect from you through our app.
          </p>
          <h2 className="text-2xl font-semibold text-foreground">1. Information We Collect</h2>
          <p>
            We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We primarily collect information through Google Sign-In, which includes your name, email address, and profile picture.
          </p>
          <h2 className="text-2xl font-semibold text-foreground">2. How We Use Your Information</h2>
          <p>
            We use the information we collect to operate, maintain, and provide the features and functionality of the app, to communicate with you, and to personalize your experience.
          </p>
          <h2 className="text-2xl font-semibold text-foreground">3. Security</h2>
          <p>
            We take the security of your data seriously and use commercially acceptable means to protect your personal information, but remember that no method of transmission over the internet, or method of electronic storage, is 100% secure.
          </p>
          <h2 className="text-2xl font-semibold text-foreground">4. Links to Other Sites</h2>
          <p>
            Our app may link to external sites that are not operated by us. Please be aware that we have no control over the content and practices of these sites, and cannot accept responsibility or liability for their respective privacy policies.
          </p>
        </div>
      </div>
    </div>
  );
}
