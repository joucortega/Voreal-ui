import { forwardRef, type HTMLAttributes, type ReactElement } from "react";

export type VorealNextRootProps = HTMLAttributes<HTMLDivElement>;

export const vorealNextPortalProps: { readonly "data-vrn-portal": "" } = {
  "data-vrn-portal": "",
};

export const VorealNextRoot = forwardRef<HTMLDivElement, VorealNextRootProps>(function VorealNextRoot(
  { className, ...props },
  ref,
): ReactElement {
  return (
    <div
      {...props}
      ref={ref}
      className={["vrn-root", className].filter(Boolean).join(" ")}
      data-voreal-ui="next"
    />
  );
});
