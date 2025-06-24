import { PageTemplate } from "@/components/PageTemplate";

export default function TermsPage() {
  return (
    <PageTemplate className="items-center">
      <div className="animate-fade-slide-in max-w-5xl space-y-6 px-12">
        <h1>Terms and Conditions</h1>
        <p>
          <em>Last Updated: February 04, 2025</em>
        </p>

        <p>
          Welcome to Spelly ("Website," "we," "our," or "us"). These Terms and
          Conditions ("Terms") govern your access to and use of our Website,
          including the creation and use of an account.
        </p>

        <p>
          By accessing or using our Website, you agree to be bound by these
          Terms. If you do not agree to these Terms, you must not use our
          Website.
        </p>

        <hr />

        <h2>1. Account Registration and Security</h2>
        <ul>
          <li>
            To access certain features, you must create an account using a valid
            email address.
          </li>
          <li>
            You are responsible for maintaining the confidentiality of your
            account credentials.
          </li>
          <li>
            You must notify us immediately if you suspect any unauthorized use
            of your account.
          </li>
          <li>
            We reserve the right to suspend or terminate your account if we
            suspect fraudulent or unauthorized activity.
          </li>
        </ul>

        <h2>2. User Responsibilities</h2>
        <ul>
          <li>
            You must provide accurate and complete information when creating an
            account.
          </li>
          <li>
            You may not use the Website for any unlawful or prohibited
            activities.
          </li>
          <li>
            You must not share, sell, or transfer your account to another
            person.
          </li>
        </ul>

        <h2>3. Privacy and Data Protection</h2>
        <ul>
          <li>
            Your personal data will be handled in accordance with our{" "}
            <a href="/privacy">Privacy Policy</a>.
          </li>
          <li>
            We use industry-standard security measures to protect your
            information but cannot guarantee complete security.
          </li>
        </ul>

        <h2>4. Intellectual Property</h2>
        <ul>
          <li>
            All content on the Website, including text, graphics, logos, and
            software, is our property or licensed to us and is protected by
            intellectual property laws.
          </li>
          <li>
            You may not copy, modify, distribute, or reproduce any content
            without our prior written consent.
          </li>
        </ul>

        <h2>5. Prohibited Conduct</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Violate any applicable laws or regulations.</li>
          <li>
            Interfere with or disrupt the Website's security or functionality.
          </li>
          <li>Attempt to gain unauthorized access to our systems.</li>
          <li>Post or transmit harmful content, such as viruses or malware.</li>
        </ul>

        <h2>6. Termination of Use</h2>
        <ul>
          <li>
            We reserve the right to terminate or suspend your account without
            notice if you violate these Terms.
          </li>
          <li>
            You may delete your account at any time by following the
            instructions in your account settings.
          </li>
        </ul>

        <h2>7. Disclaimers and Limitation of Liability</h2>
        <ul>
          <li>
            The Website is provided on an "as is" basis without warranties of
            any kind.
          </li>
          <li>
            We are not responsible for any damages arising from your use of the
            Website.
          </li>
          <li>
            Our total liability, if any, shall be limited to the amount you paid
            us for using the Website, if applicable.
          </li>
        </ul>

        <h2>8. Changes to These Terms</h2>
        <ul>
          <li>
            We may update these Terms at any time. Any changes will be posted on
            this page with the updated date.
          </li>
          <li>
            Continued use of the Website after changes means you accept the
            revised Terms.
          </li>
        </ul>

        <h2>9. Governing Law</h2>
        <ul>
          <li>
            These Terms shall be governed by and interpreted under the laws of
            the State of California, United States.
          </li>
          <li>
            Any disputes arising from these Terms shall be resolved in the
            courts of the State of California, United States.
          </li>
        </ul>

        <h2>10. Contact Information</h2>
        <p>
          If you have any questions about these Terms, please contact us at{" "}
          <a href="mailto:auth.spelly@gmail.com">auth.spelly@gmail.com</a>.
        </p>

        <hr />

        <p>
          By creating an account, you acknowledge that you have read,
          understood, and agreed to these Terms and Conditions.
        </p>
      </div>
    </PageTemplate>
  );
}
