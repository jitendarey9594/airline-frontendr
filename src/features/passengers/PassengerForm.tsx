import { useState } from 'react';
import Input from '../../components/Input';
import Button from '../../components/Button';

type Props = {
  onSubmit: (data: { name: string; email: string; seat: string }) => void;
};

export default function PassengerForm({ onSubmit }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [seat, setSeat] = useState('');

  const handleSubmit = () => {
    if (!name || !email || !seat) return alert('All fields required');
    onSubmit({ name, email, seat });
    setName('');
    setEmail('');
    setSeat('');
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Add Passenger</h3>
      <Input label="Name" value={name} onChange={e => setName(e.target.value)} />
      <Input label="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <Input label="Seat" value={seat} onChange={e => setSeat(e.target.value)} />
      <Button text="Submit" onClick={handleSubmit} />
    </div>
  );
}
