import { Mail, MapPinned } from "lucide-react";
import Link from "next/link";
import LogoBrand from "../header/LogoBrand";
import SubscribeBtn from "./SubscribeBtn";

export default function Footer() {
  return (
    <footer className="bg-[#212121] relative z-20 py-10 text-[--whiteColor]">
      <div className="container flex items-center flex-wrap py-2 pb-4 gap-y-1 gap-x-4 text-[var(--whiteColor)]">
        <LogoBrand />
        <div className="px-1 py-1 flex flex-wrap justify-center gap-4 my-3 text-[14px]">
          <Link href="/">Home</Link>
          <Link href="/categories">categories</Link>
          <Link href="/posts">Posts</Link>
          <Link href="/chats">Chats</Link>
          <Link href="/contact-us">contact us</Link>
          <Link href="/about">About Us</Link>
          <Link href="/terms-conditions">terms and conditions</Link>
          <Link href="/privacy-policy">Privacy Policy</Link>
          <SubscribeBtn />
        </div>
      </div>

      <div className="container">
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#3e3e3e] pt-4">
          <a
            href="#"
            className="flex items-center gap-2 text-sm text-[var(--whiteColor)] hover:text-[var(--mainColor)]"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="w-10 h-10 flex items-center justify-center rounded-full border border-[var(--mainColor)] text-[var(--mainColor)]">
              <MapPinned width={20} height={20} />
            </div>
            <p>8 THE GRN STE B Dover, DE 19901, USA</p>
          </a>

          <a
            href="mailto:info@ditchit.com"
            className="flex items-center gap-2 text-sm text-[var(--whiteColor)] hover:text-[var(--mainColor)]"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="w-10 h-10 flex items-center justify-center rounded-full border border-[var(--mainColor)] text-[var(--mainColor)]">
              <Mail width={20} height={20} />
            </div>
            <p>info@ditchit.com</p>
          </a>

          <p className="text-sm text-[var(--whiteColor)]">
            {new Date().getFullYear()} © All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
