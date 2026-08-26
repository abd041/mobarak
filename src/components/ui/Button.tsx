import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";

type Props = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "outline" | "text" | "orange";
  className?: string;
  type?: "button" | "submit";
  fullWidth?: boolean;
};

const variants = {
  primary:
    "bg-brand-cta text-white hover:bg-navy shadow-sm",
  outline:
    "border border-brand-cta text-brand-cta bg-white hover:bg-brand-cta/5",
  text: "text-brand-cta hover:underline bg-transparent px-0",
  orange: "bg-brand-orange text-white hover:bg-brand-orange/90",
};

export function Button({
  children,
  href,
  onClick,
  variant = "primary",
  className,
  type = "button",
  fullWidth,
}: Props) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition",
    variants[variant],
    fullWidth && "w-full",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
