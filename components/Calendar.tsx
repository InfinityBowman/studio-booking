'use client';

import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

interface Reservation {
  id: string;
  title: string;
  start: string;
  end: string;
  spaceId: string;
  space: {
    id: string;
    name: string;
    hourlyRate: number;
  };
}

interface CalendarProps {
  onReservationCreate: (reservation: Omit<Reservation, 'id' | 'space'>) => Promise<void>;
  spaceId: string;
}

export default function Calendar({ onReservationCreate, spaceId }: CalendarProps) {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    const response = await fetch('/api/reservations');
    const data = await response.json();
    setReservations(data);
  };

  const handleDateSelect = async (selectInfo: any) => {
    const title = prompt('Please enter a title for your reservation');
    if (title) {
      const reservation = {
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        spaceId, // Include the spaceId from props
      };

      await onReservationCreate(reservation);
      fetchReservations();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        events={reservations}
        select={handleDateSelect}
      />
    </div>
  );
}
