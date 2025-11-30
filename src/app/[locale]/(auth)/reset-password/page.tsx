import { getTranslations } from "next-intl/server";
import PageBanner from "@/components/shared/PageBanner";
import SendCodeForm from "@/features/auth/components/SendCodeForm";

export default async function page() {
  const t = await getTranslations("common");

  return (
    <>
      <PageBanner
        links={[{ title: t("home"), link: "/" }]}
        page={t("reset_password")}
      />

      <section className="container py-8">
        <div className="flex flex-wrap  justify-center">
          <div className="w-full lg:w-5/12 p-2">
            <SendCodeForm />
          </div>
        </div>
      </section>
    </>
  );
}
