import EditProfileForm from "@/features/profile/components/EditProfileForm";

export default function page() {
  return (
    <div className="isolate mt-2 p-[30px] rounded-[14px] border border-[var(--lightBorderColor)] flex flex-col gap-4">
      <EditProfileForm />
    </div>
  );
}
