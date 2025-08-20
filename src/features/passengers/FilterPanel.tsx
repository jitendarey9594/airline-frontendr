type Props = {
  filter: string;
  setFilter: (value: string) => void;
};

export default function FilterPanel({ filter, setFilter }: Props) {
  return (
    <div className="mb-4 flex items-center gap-4">
      <input
        type="text"
        placeholder="Search by name or email"
        value={filter}
        onChange={e => setFilter(e.target.value)}
        className="border px-3 py-2 rounded w-full"
      />
    </div>
  );
}
