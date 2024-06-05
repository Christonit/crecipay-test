import cx from "classnames";
export function TypographyH1({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h1
      className={cx(
        "scroll-m-20 text-xl font-semibold text-slate-900 tracking-tight lg:text-2xl",
        className
      )}
    >
      {children}
    </h1>
  );
}
