import EditProfileForm from "@/features/profile/components/EditProfileForm";
import { getCountries } from "@/services/getCountries";

export default async function Page({
  params,
}: {
  params: Promise<{ "country-locale": string }>;
}) {
  const { "country-locale": fullLocale } = await params;
  const lang = fullLocale.split("-")[0];
  
  const countriesRes = await getCountries(lang);
  const countries = countriesRes.data.data;
  return (
    <div className="isolate mt-2 p-[30px] rounded-[14px] border border-[var(--lightBorderColor)] flex flex-col gap-4">
      <EditProfileForm countries={countries} />
    </div>
  );
}
