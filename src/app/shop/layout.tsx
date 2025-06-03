export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Jika kamu tidak butuh fetch data di layout, bisa dihapus
  // Tapi kalau tetap perlu, simpan di context/global state

  return (
    <>
      {children}
    </>
  );
}
