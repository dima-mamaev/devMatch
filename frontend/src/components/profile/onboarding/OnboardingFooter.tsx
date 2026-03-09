import { ArrowLeftIcon, ArrowRightIcon, LoaderIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";

interface OnboardingFooterProps {
  onBack: () => void;
  onContinue?: () => void;
  isValid?: boolean;
  continueLabel?: string;
  submitForm?: boolean;
  isLoading?: boolean;
}

export function OnboardingFooter({
  onBack,
  onContinue,
  isValid = true,
  continueLabel = "Continue",
  submitForm = false,
  isLoading = false,
}: OnboardingFooterProps) {
  return (
    <div className="flex items-center justify-between px-8 py-4 border-t border-slate-100">
      <Button variant="ghost" size="sm" type="button" onClick={onBack} disabled={isLoading}>
        <ArrowLeftIcon className="w-4 h-4" />
        Back
      </Button>
      <Button
        variant="primary"
        size="sm"
        type={submitForm ? "submit" : "button"}
        onClick={submitForm ? undefined : onContinue}
        disabled={!isValid || isLoading}
      >
        {isLoading ? (
          <>
            <LoaderIcon className="w-4 h-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            {continueLabel}
            <ArrowRightIcon className="w-4 h-4" />
          </>
        )}
      </Button>
    </div>
  );
}
