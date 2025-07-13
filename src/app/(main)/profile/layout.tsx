import ProfileSideBar from "@/features/profile/ProfileSideBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="container py-8 flex gap-8">
      <div className="flex flex-wrap -mx-2 justify-center">
        <ProfileSideBar />
        <div className="p-2 w-full md:w-7/12 lg:w-8/12 xl:w-9/12">{children}</div>
      </div>
    </section>
  );
}
