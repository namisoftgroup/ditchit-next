import PageBanner from "@/components/shared/PageBanner";
import ResetPassPage from "@/features/auth/components/ResetPassPage";

export default function page() {
  return (
    <>
      <PageBanner
        links={[{ title: "Home", link: "/" }]}
        page="Reset password"
      />

      <ResetPassPage />
    </>
  );
}
