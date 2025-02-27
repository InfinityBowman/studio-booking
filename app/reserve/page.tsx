'use client'

import Calendar from '@/components/Calendar'

export default function ReservePage() {
  const handleReservationCreate = async (reservation: { title: string; start: string; end: string }) => {
    const response = await fetch('/api/reservations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reservation),
    })

    if (!response.ok) {
      throw new Error('Failed to create reservation')
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Studio Reservations</h1>
      <Calendar onReservationCreate={handleReservationCreate} />
    </div>
  )
}
