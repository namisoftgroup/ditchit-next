import PageBanner from "@/components/shared/PageBanner";
import RegisterForm from "@/features/auth/components/RegisterForm";

export default function page() {
  return (
    <>
      <PageBanner links={[{ title: "Home", link: "/" }]} page="Register" />

      <section className="container py-8">
        <div className="flex flex-wrap -mx-2 justify-center">
          <div className="w-full lg:w-5/12 p-2">
            <RegisterForm />
          </div>
        </div>
      </section>
    </>
  );
}
