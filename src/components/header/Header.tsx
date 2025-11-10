import { getCategories } from "@/services/getCategories";
import { getCountries } from "@/services/getCountries";
import { User } from "@/types/user";
import GetApp from "./GetApp";
import LogoBrand from "./LogoBrand";
import Navigation from "./Navigation";
import AddPostMenu from "./AddPostMenu";
import UserMenu from "./UserMenu";
import LocationSearch from "./LocationSearch";
import HeaderCategories from "./HeaderCategories";
import ResponsiveMenu from "./ResponsiveMenu";
import { getProfile } from "@/features/auth/actions";
import { cookies } from "next/headers";
import { getOneCountry } from "@/services/getOneCountry";

type HeaderProps = {
  locale: string;
  data: {
    token: string | null;
    user: User | null;
  };
};

export default async function Header({ locale, data }: HeaderProps) {
  const categoriesRes = await getCategories(locale);
  const countriesRes = await getCountries(locale);
  // const countriesRes = await getCountries(locale, 1, 300);
  const countryIdCookie = (await cookies()).get("countryId")?.value;

  const profileData = await getProfile();
  const categories = categoriesRes.data;
  const countries = countriesRes.data.data;
  const selectedCountryFromApi = await getOneCountry(locale, countryIdCookie || "us");

  return (
    <>
      <header className="sticky overflow-x-hidden top-0 z-[50] w-full flex flex-col gap-1 transition-[all] duration-200 ease-in-out bg-[var(--whiteColor)] border-b border-[var(--lightBorderColor)]">
        <section className="container gap-1 flex justify-between items-center py-2">
          <LogoBrand />
          <LocationSearch
            hideSm={true}
            countries={countries}
            profileData={profileData.user}
            selectedCountryFromApi={selectedCountryFromApi.data}
          />
          <Navigation isAuthed={!!data.token} />

          <div className="p-[5px] flex justify-end gap-2 items-center">
            <GetApp />
            <AddPostMenu />
            <UserMenu user={data.user} isAuthed={!!data.token} />
            <ResponsiveMenu
              categories={categories}
              locale={locale}
              isAuthed={!!data.token}
            />
          </div>
        </section>

        <HeaderCategories categories={categories} />
      </header>

      <div className="md:hidden block p-3 bg-[var(--mainColor10)]">
        <LocationSearch
          hideSm={false}
          countries={countries}
          profileData={profileData.user}
          selectedCountryFromApi={selectedCountryFromApi.data }
        />
      </div>
    </>
  );
}
