import { getTranslations } from "next-intl/server";
import PageBanner from "@/components/shared/PageBanner";
import RegisterForm from "@/features/auth/components/RegisterForm";
import { getCountries } from "@/services/getCountries";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const t = await getTranslations("common");

  const countriesRes = await getCountries(locale);
  const countries = countriesRes.data.data;

  return (
    <>
      <PageBanner
        links={[{ title: t("home"), link: "/" }]}
        page={t("register")}
      />

      <section className="container py-8">
        <div className="flex flex-wrap  justify-center">
          <div className="w-full lg:w-5/12 p-2">
            <RegisterForm countries={countries} />
          </div>
        </div>
      </section>
    </>
  );
}
