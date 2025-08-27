"use client";

import { Heart, LogOut, Megaphone, UserPen } from "lucide-react";
import { logOutAction } from "@/features/auth/actions";
import { useAuthStore } from "@/features/auth/store";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const performLogout = async () => {
    const res = await logOutAction();
    if (res.code === 200) {
      logout();
      router.push("/");
    }
  };

  return (
    <aside className="flex flex-col gap-4 mt-2">
      <div className="bg-whiteColor rounded-[20px] p-5 relative flex flex-wrap items-center gap-4 border border-[var(--lightBorderColor)]">
        <Image
          src={user?.image || ""}
          width={80}
          height={80}
          alt="user"
          className="object-cover rounded-full border border-[var(--lightBorderColor)] w-[80px] h-[80px]"
        />

        <div className="flex flex-col gap-2">
          <h4 className="text-[18px] font-bold">{user?.name}</h4>
          <p className="text-[14px] text-[var(--grayColor)]">
            {user?.phone && <>{(user?.phone_code || "+1") + user?.phone}</>}
          </p>
        </div>
      </div>

      <div className="bg-whiteColor rounded-[16px] p-4 border border-[var(--lightBorderColor)] sticky top-[90px] right-0 z-[2] flex flex-wrap flex-row md:flex-col gap-2">
        <Link
          href="/profile"
          className="group px-4 py-3 flex flex-1 gap-3 items-center transition-all duration-300 rounded-[12px] border border-[#eee] capitalize hover:bg-[var(--mainColor)] hover:text-[var(--whiteColor)]"
        >
          <Megaphone
            width={20}
            height={20}
            className="text-[var(--mainColor)] group-hover:text-[var(--whiteColor)] transition-colors duration-300"
          />
          My Posts
        </Link>

        <Link
          href="/profile/my-favorites"
          className="group px-4 py-3 flex flex-1 gap-3 items-center transition-all duration-300 rounded-[12px] border border-[#eee] capitalize hover:bg-[var(--mainColor)] hover:text-[var(--whiteColor)]"
        >
          <Heart
            width={20}
            height={20}
            className="text-[var(--mainColor)] group-hover:text-[var(--whiteColor)] transition-colors duration-300"
          />
          Favorites
        </Link>

        <Link
          href="/profile/edit-profile"
          className="group px-4 py-3 flex flex-1 gap-3 items-center transition-all duration-300 rounded-[12px] border border-[#eee] capitalize hover:bg-[var(--mainColor)] hover:text-[var(--whiteColor)]"
        >
          <UserPen
            width={20}
            height={20}
            className="text-[var(--mainColor)] group-hover:text-[var(--whiteColor)] transition-colors duration-300"
          />
          Edit Profile
        </Link>

        <button
          className="group px-4 py-3 flex flex-1 gap-3 items-center transition-all duration-300 rounded-[12px] border border-[#eee] capitalize hover:bg-[var(--mainColor)] hover:text-[var(--whiteColor)]"
          onClick={performLogout}
        >
          <LogOut
            width={20}
            height={20}
            className="text-[#FF0000] group-hover:text-[var(--whiteColor)] transition-colors duration-300"
          />
          Logout
        </button>
      </div>
    </aside>
  );
}
