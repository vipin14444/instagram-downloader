import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let reqBody = await request.json();
  return NextResponse.json(reqBody);
}
