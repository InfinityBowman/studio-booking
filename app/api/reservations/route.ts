import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession } from '@auth0/nextjs-auth0'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const reservations = await prisma.reservation.findMany({
      include: {
        space: true, // Include space details in the response
      },
    })
    return NextResponse.json(reservations)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reservations' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Check if the space exists
    const space = await prisma.space.findUnique({
      where: { id: body.spaceId },
    })

    if (!space) {
      return NextResponse.json({ error: 'Space not found' }, { status: 404 })
    }

    // Check for overlapping reservations
    const overlapping = await prisma.reservation.findFirst({
      where: {
        spaceId: body.spaceId,
        AND: [
          {
            start: {
              lte: new Date(body.end),
            },
          },
          {
            end: {
              gte: new Date(body.start),
            },
          },
        ],
      },
    })

    if (overlapping) {
      return NextResponse.json(
        { error: 'This time slot is already reserved' },
        { status: 409 }
      )
    }

    const reservation = await prisma.reservation.create({
      data: {
        title: body.title,
        start: new Date(body.start),
        end: new Date(body.end),
        userId: session.user.sub, // Use Auth0 user ID
        spaceId: body.spaceId,
      },
      include: {
        space: true, // Include space details in the response
      },
    })

    return NextResponse.json(reservation)
  } catch (error) {
    console.error('Reservation error:', error)
    return NextResponse.json({ error: 'Failed to create reservation' }, { status: 500 })
  }
}
