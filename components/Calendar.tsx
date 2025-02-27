'use client'

import { useState, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'

interface Reservation {
  id: string
  title: string
  start: string
  end: string
}

interface CalendarProps {
  onReservationCreate: (reservation: Omit<Reservation, 'id'>) => Promise<void>
}

export default function Calendar({ onReservationCreate }: CalendarProps) {
  const [reservations, setReservations] = useState<Reservation[]>([])

  useEffect(() => {
    fetchReservations()
  }, [])

  const fetchReservations = async () => {
    const response = await fetch('/api/reservations')
    const data = await response.json()
    setReservations(data)
  }

  const handleDateSelect = async (selectInfo: any) => {
    const title = prompt('Please enter a title for your reservation')
    if (title) {
      const reservation = {
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
      }

      await onReservationCreate(reservation)
      fetchReservations()
    }
  }

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
  )
}
