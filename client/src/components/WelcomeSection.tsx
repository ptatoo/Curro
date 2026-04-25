import { ArrowRight } from "lucide-react";

interface WelcomeSectionProps {
  userName: string;
  onClick: () => void;
}

export function WelcomeSection({ userName, onClick }: WelcomeSectionProps) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-gradient-to-br from-primary to-primary/80 rounded-lg p-6 text-primary-foreground hover:opacity-90 transition-opacity text-left"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-primary-foreground">Welcome back, {userName}!</h1>
          <p className="mt-2 opacity-90">Ready for your next run?</p>
        </div>
        <ArrowRight className="w-8 h-8 opacity-90" />
      </div>
    </button>
  );
}
