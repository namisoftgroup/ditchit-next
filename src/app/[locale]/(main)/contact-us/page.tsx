import { getTranslations } from "next-intl/server";
import { getSettings } from "@/services/getSettings";
import PageBanner from "@/components/shared/PageBanner";
import ContactInfo from "@/features/contact/ContactInfo";
import ContactForm from "@/features/contact/ContactForm";

export default async function page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const t = await getTranslations("common");
  const { data } = await getSettings(locale);

  return (
    <>
      <PageBanner
        links={[{ title: t("home"), link: "/" }]}
        page={t("contact")}
      />

      <div className="container py-6">
        <div className="flex flex-wrap ">
          <div className="w-full lg:w-4/12 px-2 pb-2 pt-4">
            <ContactInfo data={data} />
          </div>

          <div className="w-full lg:w-8/12 px-2 pb-2 pt-4">
            <ContactForm />
          </div>
        </div>
      </div>

      <section className="map">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3093.82758733525!2d-75.52709222453593!3d39.155902931410665!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c764aa7c4428d1%3A0x7b6820145593d386!2s8%20The%20Green%20B%2C%20Dover%2C%20DE%2019901%2C%20USA!5e0!3m2!1sen!2seg!4v1731013517698!5m2!1sen!2seg"
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          aria-label="Google Maps showing our location at 8 The Green B, Dover, DE"
        />
      </section>
    </>
  );
}
