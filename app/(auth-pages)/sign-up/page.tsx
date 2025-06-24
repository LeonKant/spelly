import SignUpForm from "@/components/forms/SignupForm";
import { PageTemplate } from "@/components/PageTemplate";

export default async function Signup() {
  return (
    <div className="animate-fade-slide-in">
      <SignUpForm />
    </div>
  );
}
