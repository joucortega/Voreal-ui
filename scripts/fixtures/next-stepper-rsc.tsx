import { NextStepper } from "../../src/next/components/navigation";

export function StaticStepperRscConsumer() {
  return (
    <NextStepper
      label="Publishing progress"
      steps={[
        { label: "Details", status: "complete", value: "details" },
        { label: "Review", status: "current", value: "review" },
      ]}
      value="review"
    />
  );
}
