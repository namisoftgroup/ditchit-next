import { getCategories } from "@/services/getCategories";
import GetApp from "./GetApp";
import LogoBrand from "./LogoBrand";
import Navigation from "./Navigation";
import AddPostMenu from "./AddPostMenu";
import UserMenu from "./UserMenu";
import LocationSearch from "./LocationSearch";
import HeaderCategories from "./HeaderCategories";

export default async function Header() {
  const { data: categories } = await getCategories();
  
  return (
    <header className="sticky overflow-x-hidden top-0 z-[9] w-full flex flex-col gap-1 transition-[all] duration-200 ease-in-out bg-[var(--whiteColor)] border-b border-[var(--lightBorderColor)]">
      <section className="container gap-1 flex justify-between items-center py-2">
        <LogoBrand />
        <LocationSearch />
        <Navigation />

        <div className="p-[5px] flex justify-end gap-2 items-center">
          <GetApp />
          <AddPostMenu />
          <UserMenu />
        </div>
      </section>

      <HeaderCategories categories={categories} />
    </header>
  );
}
