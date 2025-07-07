import Link from "next/link";

interface FormFooterLinkProps {
  question: string;
  linkText: string;
  href: string;
}

export default function FormFooterLink({
  question,
  linkText,
  href,
}: FormFooterLinkProps) {
  return (
    <p className="text-center capitalize text-[14px]">
      {question}{" "}
      <Link href={href} className="text-[var(--mainColor)]">
        {linkText}
      </Link>
    </p>
  );
}
