type Props = {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
};

export default function Input({ label, value, onChange, type = 'text' }: Props) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full border px-3 py-2 rounded"
      />
    </div>
  );
}
