import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest) {
  const bodySchema = z.object({
    code: z.string().min(6).max(6),
    clientName: z.string().min(3),
    clientPhone: z.string().min(11).max(11),
  })

  const body = await request.json()

  const validatedBody = bodySchema.safeParse(body)

  if (!validatedBody.success) {
    return NextResponse.json(
      {
        message: 'Invalid data',
        errors: validatedBody.error.flatten().fieldErrors,
      },
      { status: 400 },
    )
  }

  const { code, clientName, clientPhone } = validatedBody.data

  const coupon = await prisma.coupon.findUnique({
    where: {
      code,
    },
    include: {
      client: true,
    },
  })

  if (!coupon) {
    return NextResponse.json({ message: 'Coupon not found' }, { status: 404 })
  }

  if (coupon.redeemed) {
    return NextResponse.json(
      { message: 'Coupon already redeemed' },
      { status: 400 },
    )
  }

  const client = await prisma.client.findUnique({
    where: {
      phone: clientPhone,
    },
  })

  await prisma.coupon
    .update({
      where: {
        code,
      },
      data: {
        redeemed: true,
        updatedAt: new Date(),
        client: client
          ? {
              connect: {
                id: client.id,
              },
            }
          : {
              create: {
                name: clientName,
                phone: clientPhone,
              },
            },
      },
    })
    .catch((error) => {
      console.log('[Coupon redeem]:' + error)

      return NextResponse.json(
        { error: 'Something went wrong, please try again later!' },
        { status: 500 },
      )
    })

  return NextResponse.json({ message: 'Coupon redeemed' }, { status: 201 })
}
