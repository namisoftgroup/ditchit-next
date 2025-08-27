import Image from "next/image";
import { Link } from "@/i18n/navigation";

export default function LogoBrand() {
  return (
    <Link href="/" className="p-1 max-w-[180px]">
      <Image
        src="/branding/logo.svg"
        alt="logo"
        width={160}
        height={50}
        className="md:w-[160px] w-[120px]"
        priority
      />
    </Link>
  );
}
