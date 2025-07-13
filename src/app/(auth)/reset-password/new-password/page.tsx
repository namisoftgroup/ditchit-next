import PageBanner from "@/components/shared/PageBanner";
import NewPasswordForm from "@/features/auth/components/NewPasswordForm";

export default function page() {
  return (
    <>
      <PageBanner
        links={[
          { title: "Home", link: "/" },
          { title: "Reset Password", link: "/reset-password" },
        ]}
        page="Verify OTP"
      />

      <section className="container py-8">
        <div className="flex flex-wrap -mx-2 justify-center">
          <div className="w-full lg:w-5/12 p-2">
          
            <NewPasswordForm />
          </div>
        </div>
      </section>
    </>
  );
}
