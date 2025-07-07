import { getCategories } from "@/services/getCategories";
import PageBanner from "@/components/shared/PageBanner";
import FilterSideBar from "@/features/listing/FilterSideBar";

export default async function page() {
  const { data: categories } = await getCategories();
  return (
    <>
      <PageBanner links={[{ title: "Home", link: "/" }]} page="All Posts" />

      <div className="container py-6">
        <div className="flex flex-wrap -mx-2">
          {/* filter sidebar */}
          <div className="w-full lg:w-3/12 px-2 py-2">
            <FilterSideBar categories={categories} />
          </div>
        </div>
      </div>
    </>
  );
}
