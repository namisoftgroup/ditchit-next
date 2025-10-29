import EditProfileForm from "@/features/profile/components/EditProfileForm";
import { getCountries } from "@/services/getCountries";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const countriesRes = await getCountries(locale);
  const countries = countriesRes.data.data;
  return (
    <div className="isolate mt-2 p-[30px] rounded-[14px] border border-[var(--lightBorderColor)] flex flex-col gap-4">
      <EditProfileForm countries={countries} />
    </div>
  );
}
