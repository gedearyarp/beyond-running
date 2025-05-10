import ListViewItem, { type Peripherals } from "./ListViewItem"

interface PeripheralsListProps {
  peripherals: Peripherals[]
}

export default function StoryList({ peripherals }: PeripheralsListProps) {
  return (
    <div className="w-full">
      {peripherals.map((peri) => (
        <ListViewItem key={peri.id} peripherals={peri} />
      ))}
    </div>
  )
}
