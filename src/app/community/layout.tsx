import { Suspense } from "react";
import CommunityPage from "./page"; // misal komponen utama kamu

export default function Page() {
  return (
    <Suspense>
      <CommunityPage />
    </Suspense>
  );
}