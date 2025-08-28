import { getCategories } from "@/services/getCategories";
import GetApp from "./GetApp";
import LogoBrand from "./LogoBrand";
import Navigation from "./Navigation";
import AddPostMenu from "./AddPostMenu";
import UserMenu from "./UserMenu";
import LocationSearch from "./LocationSearch";
import HeaderCategories from "./HeaderCategories";
import ResponsiveMenu from "./ResponsiveMenu";

export default async function Header({ locale }: { locale: string }) {
  const { data: categories } = await getCategories();

  return (
    <>
      <header className="sticky overflow-x-hidden top-0 z-[50] w-full flex flex-col gap-1 transition-[all] duration-200 ease-in-out bg-[var(--whiteColor)] border-b border-[var(--lightBorderColor)]">
        <section className="container gap-1 flex justify-between items-center py-2">
          <LogoBrand />
          <LocationSearch hideSm={true} />
          <Navigation />

          <div className="p-[5px] flex justify-end gap-2 items-center">
            <GetApp />
            <AddPostMenu />
            <UserMenu />
            <ResponsiveMenu categories={categories} locale={locale} />
          </div>
        </section>

        <HeaderCategories categories={categories} />
      </header>

      <div className="md:hidden block p-3 bg-[var(--mainColor10)]">
        <LocationSearch hideSm={false} />
      </div>
    </>
  );
}
