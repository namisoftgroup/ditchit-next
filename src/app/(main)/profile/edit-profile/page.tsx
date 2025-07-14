import EditProfileForm from "@/features/profile/EditProfileForm";

export default function page() {
  return (
    <div className="isolate p-[30px] rounded-[14px] border border-[var(--lightBorderColor)] flex flex-col gap-4">
      <EditProfileForm />
    </div>
  );
}
