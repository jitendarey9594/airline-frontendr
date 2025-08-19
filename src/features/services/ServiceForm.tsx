import { useState } from 'react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import CategorySelector from './CategorySelector';
import type { Service } from '../../types/service';

type Props = {
  initialData?: Service;
  onSubmit: (data: Service) => void;
  onCancel?: () => void;
};

export default function ServiceForm({ initialData, onSubmit, onCancel }: Props) {
  const [category, setCategory] = useState(initialData?.category || '');
  const [name, setName] = useState(initialData?.name || '');
  const [price, setPrice] = useState(initialData?.price?.toString() || '');

  const handleSubmit = () => {
    if (!category || !name || !price) {
      alert('All fields are required');
      return;
    }

    const service: Service = {
      id: initialData?.id || '',
      category,
      name,
      price: parseFloat(price),
    };

    onSubmit(service);
  };

  return (
    <div className="p-6 bg-white rounded shadow max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-4">
        {initialData ? 'Edit Service' : 'Add New Service'}
      </h2>

      <CategorySelector category={category} setCategory={setCategory} />
      <Input label="Service Name" value={name} onChange={e => setName(e.target.value)} />
      <Input
        label="Price"
        value={price}
        onChange={e => setPrice(e.target.value)}
        type="number"
      />

      <div className="flex gap-4 mt-4">
        <Button text="Save" onClick={handleSubmit} />
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
