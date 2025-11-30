import { getTranslations } from "next-intl/server";
import PageBanner from "@/components/shared/PageBanner";
import Sidebar from "@/features/profile/components/Sidebar";

export default async function Layout({ children }: { children: React.ReactNode }) {
   const t = await getTranslations("common");

  return (
    <>
      <PageBanner links={[{ title: t("home"), link: "/" }]} page={t("profile")} />

      <section className="container py-6 flex gap-8">
        <div className="flex flex-wrap  justify-center w-full">
          <div className="p-2 w-full md:w-5/12 lg:w-4/12 xl:w-3/12">
            <Sidebar />
          </div>
          <div className="p-2 w-full md:w-7/12 lg:w-8/12 xl:w-9/12">
            {children}
          </div>
        </div>
      </section>
    </>
  );
}
