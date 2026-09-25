import ImagesGallery from "@/components/ImagesGallery";

export const metadata = { title: "Images — Lust Photography" };

export default function ImagesPage() {
  return (
    <div className="min-h-screen pb-24 pt-28 md:pt-36">
      <ImagesGallery />
    </div>
  );
}
