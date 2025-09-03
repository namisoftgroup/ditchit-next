import { getTranslations } from "next-intl/server";
import PageBanner from "@/components/shared/PageBanner";
import NewPasswordForm from "@/features/auth/components/NewPasswordForm";

export default async function page() {
  const t = await getTranslations("common");

  return (
    <>
      <PageBanner
        links={[
          { title: t("home"), link: "/" },
          { title: t("reset_password"), link: "/reset-password" },
        ]}
        page={t("new_password")}
      />

      <section className="container py-8">
        <div className="flex flex-wrap  justify-center">
          <div className="w-full lg:w-5/12 p-2">
            <NewPasswordForm />
          </div>
        </div>
      </section>
    </>
  );
}
