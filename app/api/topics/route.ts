import { NextResponse } from 'next/server'
import { readTopics } from '../../../lib/topics'

export async function GET() {
  const topics = readTopics()
  return NextResponse.json({ topics })
}