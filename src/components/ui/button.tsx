import Link from "next/link";
import type { ButtonLinkProps, ButtonProps } from "@/types/ui";
import { buttonClasses } from "./button-styles";

export function Button(props: ButtonProps) {
  const { variant, size, fullWidth, className, type = "button", ...rest } = props;
  return (
    <button
      type={type}
      className={buttonClasses({ variant, size, fullWidth, className })}
      {...rest}
    />
  );
}

export function ButtonLink(props: ButtonLinkProps) {
  const { href, children, ...styleOptions } = props;
  return (
    <Link href={href} className={buttonClasses(styleOptions)}>
      {children}
    </Link>
  );
}
