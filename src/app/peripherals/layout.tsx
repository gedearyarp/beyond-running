import { Suspense } from "react";
import PeripheralsPage from "./page"; // misal komponen utama kamu

export default function Page() {
  return (
    <Suspense>
      <PeripheralsPage />
    </Suspense>
  );
}