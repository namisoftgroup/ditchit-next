import PageBanner from "@/components/shared/PageBanner";

export default function PostDetails() {
  return (
    <>
      <PageBanner
        links={[
          { title: "Home", link: "/" },
          { title: "All Posts", link: "/all-posts" },
        ]}
        page="Post Details"
      />
    </>
  );
}
