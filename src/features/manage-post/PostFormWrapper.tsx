import { getCategories } from "@/services/getCategories";
import { PostDetailsResponse } from "../post-details/types";
import PostFormProvider from "./PostFormProvider";
import WizardForm from "./WizardForm";

export default async function PostFormWrapper({
  post,
  type,
}: {
  post?: PostDetailsResponse;
  type?: string;
}) {
  const { data: categories } = await getCategories();

  return (
    <PostFormProvider post={post} type={type}>
      <div className="container py-6 flex gap-8 justify-center">
        <div className="flex flex-wrap -mx-2 justify-center w-full">
          <div className="p-2 w-full md:w-12/12 lg:w-12/12 xl:w-10/12">
            <WizardForm categories={categories} />
          </div>
        </div>
      </div>
    </PostFormProvider>
  );
}
