import SendCodeForm from "./SendCodeForm";

export default function ResetPassPage() {
  return (
    <section className="container py-8">
      <div className="flex flex-wrap -mx-2 justify-center">
        <div className="w-full lg:w-5/12 p-2">
          <SendCodeForm />
        </div>
      </div>
    </section>
  );
}
