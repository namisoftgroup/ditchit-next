import { getCategories } from "@/services/getCategories";
import { User } from "@/types/user";
import GetApp from "./GetApp";
import LogoBrand from "./LogoBrand";
import Navigation from "./Navigation";
import AddPostMenu from "./AddPostMenu";
import UserMenu from "./UserMenu";
import LocationSearch from "./LocationSearch";
import HeaderCategories from "./HeaderCategories";
import ResponsiveMenu from "./ResponsiveMenu";

type HeaderProps = {
  locale: string;
  data: {
    token: string | null;
    user: User | null;
  };
};
export default async function Header({ locale, data }: HeaderProps) {
  const { data: categories } = await getCategories();

  return (
    <>
      <header className="sticky overflow-x-hidden top-0 z-[50] w-full flex flex-col gap-1 transition-[all] duration-200 ease-in-out bg-[var(--whiteColor)] border-b border-[var(--lightBorderColor)]">
        <section className="container gap-1 flex justify-between items-center py-2">
          <LogoBrand />
          <LocationSearch hideSm={true} />
          <Navigation isAuthed={data.token ? true : false} />

          <div className="p-[5px] flex justify-end gap-2 items-center">
            <GetApp />
            <AddPostMenu />
            <UserMenu user={data.user} isAuthed={data.token ? true : false} />
            <ResponsiveMenu
              categories={categories}
              locale={locale}
              isAuthed={data.token ? true : false}
            />
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
