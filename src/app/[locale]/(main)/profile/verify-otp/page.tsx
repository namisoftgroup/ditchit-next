import VerifyOtpForm from "@/features/auth/components/VerifyOtpForm";

export default async function page() {
  return (
    <>

      <section className="container ">
        <div className="flex flex-wrap  justify-center">
          <div className="w-full  p-2">
            <VerifyOtpForm />
          </div>
        </div>
      </section>
    </>
  );
}
