import PageBanner from "@/components/shared/PageBanner";
import SendCodeForm from "@/features/auth/components/SendCodeForm";

export default function page() {
  return (
    <>
      <PageBanner
        links={[{ title: "Home", link: "/" }]}
        page="Reset password"
      />

      <section className="container py-8">
        <div className="flex flex-wrap -mx-2 justify-center">
          <div className="w-full lg:w-5/12 p-2">
            <SendCodeForm />
          </div>
        </div>
      </section>
    </>
  );
}
