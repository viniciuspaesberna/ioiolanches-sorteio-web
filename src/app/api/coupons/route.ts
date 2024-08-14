import { NextRequest, NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'
import { generateCouponCode } from '@/utils/generate-coupon-code'

const apiSecret = process.env.API_SECRET

export async function GET(request: NextRequest) {
  const headers = request.headers

  const authorization = headers.get('authorization')

  if (authorization?.split(' ')[1] !== apiSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const coupons = await prisma.coupon.findMany({
    where: {
      redeemed: true,
    },
    include: {
      client: true,
    },
  })

  return NextResponse.json({ coupons })
}

export async function POST(request: NextRequest) {
  const headers = request.headers

  const authorization = headers.get('authorization')

  if (authorization?.split(' ')[1] !== apiSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const code = await generateCouponCode()

  const coupon = await prisma.coupon.create({
    data: {
      code,
    },
    select: {
      code: true,
      createdAt: true,
    },
  })

  return NextResponse.json({ coupon })
}
