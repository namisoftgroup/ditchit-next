import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export default function page() {
  return (
    <>
      <section className="container py-8">
        <div className="flex flex-wrap -mx-2 justify-center">
          <div className="w-full lg:w-6/12 p-2">
            <form className="isolate p-[30px] rounded-[14px] shadow-[var(--BigShadow)] border-none flex flex-col gap-[16px]">
              <Image
                className="w-full max-h-[200px] aspect-[1] object-contain"
                src="/images/login.svg"
                alt="login image"
                width={500}
                height={300}
              />

              <div className="grid w-full items-center gap-3">
                <Label
                  htmlFor="email"
                  className="font-bold flex items-center gap-2"
                >
                  Email
                </Label>

                <Input
                  type="email"
                  id="email"
                  placeholder="Email"
                  className="px-4 h-[48px] rounded-[12px] border-[var(--lightBorderColor)]"
                />
              </div>

              <div className="grid w-full items-center gap-3">
                <Label
                  htmlFor="email"
                  className="font-bold flex items-center gap-2"
                >
                  Password
                </Label>

                <Input
                  type="password"
                  id="password"
                  placeholder="Password"
                  className="px-4 h-[48px] rounded-[12px] border-[var(--lightBorderColor)]"
                />
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
