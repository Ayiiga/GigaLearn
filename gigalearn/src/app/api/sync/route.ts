import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "GigaLearn Sync API",
    timestamp: new Date().toISOString(),
  });
}

export async function POST() {
  return NextResponse.json({
    synced: true,
    message: "Progress sync endpoint — client uses Supabase + IndexedDB offline queue",
  });
}
