import { getTranslations } from "next-intl/server";
import PageBanner from "@/components/shared/PageBanner";
import VerifyOtpForm from "@/features/auth/components/VerifyOtpForm";

export default async function page() {
  const t = await getTranslations("common");
  return (
    <>
      <PageBanner
        links={[
          { title: t("home"), link: "/" },
          { title: t("reset_password"), link: "/reset-password" },
        ]}
        page={t("verify_OTP")}
      />

      <section className="container py-8">
        <div className="flex flex-wrap  justify-center">
          <div className="w-full lg:w-5/12 p-2">
            <VerifyOtpForm />
          </div>
        </div>
      </section>
    </>
  );
}
