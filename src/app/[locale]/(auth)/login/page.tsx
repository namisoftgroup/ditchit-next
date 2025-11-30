import { getTranslations } from "next-intl/server";
import PageBanner from "@/components/shared/PageBanner";
import LoginForm from "@/features/auth/components/LoginForm";

export default async function page() {
  const t = await getTranslations("common");

  return (
    <>
      <PageBanner links={[{ title: t("home"), link: "/" }]} page={t("login")} />

      <section className="container py-8">
        <div className="flex flex-wrap  justify-center">
          <div className="w-full lg:w-5/12 p-2">
            <LoginForm />
          </div>
        </div>
      </section>
    </>
  );
}
