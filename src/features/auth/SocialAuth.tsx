import Image from "next/image";

export default function SocialAuth() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-4">
        <span className="h-px flex-1 bg-[var(--lightBorderColor)]"></span>
        <span className="text-sm text-muted-foreground">or</span>
        <span className="h-px flex-1 bg-[var(--lightBorderColor)]"></span>
      </div>

      <button className="whitespace-nowrap rounded-full flex-1 flex items-center justify-center px-6 py-3 gap-2 bg-[#4c8bf5] text-[var(--whiteColor)]">
        <Image src="/icons/google.svg" alt="google" width={24} height={24} />
        <span className="flex-1 text-center text-sm">Continue with Google</span>
      </button>

      <button className="whitespace-nowrap rounded-full flex-1 flex items-center justify-center px-6 py-3 gap-2 border">
        <Image src="/icons/apple.svg" alt="apple" width={24} height={24} />
        <span className="flex-1 text-center text-sm">Continue with Apple</span>
      </button>
    </div>
  );
}
