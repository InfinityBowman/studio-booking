import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const reservations = await prisma.reservation.findMany()
    return NextResponse.json(reservations)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reservations' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const reservation = await prisma.reservation.create({
      data: {
        title: body.title,
        start: new Date(body.start),
        end: new Date(body.end),
        userId: 'placeholder-user-id', // Replace with actual user ID from authentication
      },
    })
    return NextResponse.json(reservation)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create reservation' }, { status: 500 })
  }
}
