import PageBanner from "@/components/shared/PageBanner";
import VerifyOtpForm from "@/features/auth/components/VerifyOtpForm";

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
            <VerifyOtpForm />
          </div>
        </div>
      </section>
    </>
  );
}
