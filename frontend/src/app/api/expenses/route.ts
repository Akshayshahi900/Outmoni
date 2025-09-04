import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { createJWT } from "@/lib/jwt";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

// ✅ GET expenses
export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/expenses`, {
      headers: {
        Authorization: `Bearer ${await createJWT(token)}`, // sign fresh JWT for backend
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ✅ POST new expense
export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    const res = await fetch(`${BACKEND_URL}/api/expenses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await createJWT(token)}`, // sign fresh JWT
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
