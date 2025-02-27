'use client';

import { useState, useEffect } from 'react';
import Calendar from '@/components/Calendar';

interface Space {
  id: string;
  name: string;
  hourlyRate: number;
}

export default function ReservePage() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<string>('');

  useEffect(() => {
    // Fetch available spaces
    fetch('/api/spaces')
      .then((res) => res.json())
      .then((data) => {
        setSpaces(data);
        if (data.length > 0) {
          setSelectedSpace(data[0].id);
        }
      });
  }, []);

  console.log('Spaces:', spaces);

  const handleReservationCreate = async (reservation: { title: string; start: string; end: string }) => {
    const response = await fetch('/api/reservations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...reservation,
        spaceId: selectedSpace,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create reservation');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Studio Reservations</h1>
      <div className="mb-4">
        <select
          value={selectedSpace}
          onChange={(e) => setSelectedSpace(e.target.value)}
          className="block w-full p-2 border rounded"
        >
          {spaces.map((space) => (
            <option
              key={space.id}
              value={space.id}
            >
              {space.name} - ${space.hourlyRate}/hr
            </option>
          ))}
        </select>
      </div>
      <Calendar
        onReservationCreate={handleReservationCreate}
        spaceId={selectedSpace}
      />
    </div>
  );
}
