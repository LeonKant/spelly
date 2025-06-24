import SignUpForm from "@/components/forms/SignupForm";
import { PageTemplate } from "@/components/PageTemplate";

export default async function Signup() {
  return (
    <PageTemplate className="animate-fade-slide-in">
      <SignUpForm />
    </PageTemplate>
  );
}
