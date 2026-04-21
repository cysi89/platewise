import { NextResponse } from 'next/server'
import { MOCK_MENUS } from '@/lib/mockMenus'

export async function GET() {
  return NextResponse.json(MOCK_MENUS)
}