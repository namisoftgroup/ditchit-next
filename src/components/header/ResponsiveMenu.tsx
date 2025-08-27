"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/features/auth/store";
import { Category } from "@/types/category";
import { House, List, Menu, MessageSquare } from "lucide-react";
import useGetUnreadCount from "@/hooks/useGetUnreadCount";
import { Link } from "@/i18n/navigation";
import Image from "next/image";

export default function ResponsiveMenu({
  categories,
}: {
  categories: Category[];
}) {
  const { token } = useAuthStore();
  const { data: count } = useGetUnreadCount();
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden block relative">
      {/* Toggle Button (hidden when menu is open) */}
      {!open && (
        <button className="p-1 z-50 relative" onClick={() => setOpen(true)}>
          <Menu className="w-5 h-5" />
        </button>
      )}

      {/* Background Blur Layer */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Side Menu */}
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 200, damping: 22 }}
            className="fixed top-0 left-0 w-[65vw] h-[100vh] bg-white flex flex-col gap-[8px] p-2 py-4 z-50 shadow-lg"
          >
            {/* Main Links */}
            <div className="w-full flex items-center gap-2 mb-1">
              <Link
                href="/"
                prefetch={true}
                className="flex flex-col items-center gap-2 text-[12px] text-[var(--darkColor)] font-bold capitalize px-4 py-2 relative whitespace-nowrap w-fit hover:text-[var(--mainColor)]"
                onClick={() => setOpen(false)}
              >
                <House className="w-5 h-5 object-contain" />
                Home
              </Link>

              <Link
                href="/posts"
                prefetch={true}
                className="flex flex-col items-center gap-2 text-[12px] text-[var(--darkColor)] font-bold capitalize px-4 py-2 relative whitespace-nowrap w-fit hover:text-[var(--mainColor)]"
                onClick={() => setOpen(false)}
              >
                <List className="w-5 h-5 object-contain" />
                Listing
              </Link>

              {token && (
                <Link
                  href="/chats"
                  className="flex flex-col text-[12px] items-center gap-2 text-[var(--darkColor)] font-bold capitalize px-4 py-2 relative whitespace-nowrap w-fit hover:text-[var(--mainColor)]"
                  onClick={() => setOpen(false)}
                >
                  <MessageSquare className="w-5 h-5 object-contain" />
                  Chats
                  {count > 0 && (
                    <div className="absolute top-0 right-0 bg-[var(--mainColor)] text-[var(--whiteColor)] text-[10px] font-bold px-1 rounded-full h-4 min-w-[16px] flex items-center justify-center">
                      {count}
                    </div>
                  )}
                </Link>
              )}
            </div>

            {/* Categories */}
            <div className="flex flex-col gap-[8px] h-full overflow-y-auto">
              {categories.map((category) => (
                <Link
                  href={`/posts?category_id=${category.id}`}
                  key={category.id}
                  className="text-[12px] font-bold text-[var(--darkColor)] hover:text-[var(--mainColor)] whitespace-nowrap px-3 py-2"
                  onClick={() => setOpen(false)}
                >
                  <div className="flex items-center gap-2">
                    <Image
                      src={category.image}
                      alt={category.title}
                      width={20}
                      height={20}
                    />
                    <span className="block">{category.title}</span>
                  </div>
                </Link>
              ))}
            </div>
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
