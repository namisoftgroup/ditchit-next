import GoogleAuth from "./GoogleAuth";
import AppleAuth from "./AppleAuth";

export default function SocialAuth() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-4">
        <span className="h-px flex-1 bg-[var(--lightBorderColor)]"></span>
        <span className="text-sm text-muted-foreground">or</span>
        <span className="h-px flex-1 bg-[var(--lightBorderColor)]"></span>
      </div>

      <GoogleAuth />
      <AppleAuth/>
    </div>
  );
}
