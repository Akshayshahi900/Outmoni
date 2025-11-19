import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { createJWT } from "@/lib/jwt";

const BACKEND_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

// ✅ GET expenses
export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  // console.log("Next.js token payload:", token);

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/expenses`, {
      headers: {
        Authorization: `Bearer ${await createJWT(token)}`,
      },
    });

    let data;
    try {
      data = await res.json();
    } catch (e) {
      console.error("Backend GET returned non-JSON", e);
      return NextResponse.json({ error: "Bad backend response" }, { status: 500 });
    }

    // console.log("Backend GET /expenses response:", data);
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Next.js /api/expenses GET error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ✅ POST new expense
export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  // console.log("Next.js token payload:", token);

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    // console.log("Next.js forwarding POST body:", body);

    const res = await fetch(`${BACKEND_URL}/api/expenses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await createJWT(token)}`,
      },
      body: JSON.stringify(body),
    });

    let data;
    try {
      data = await res.json();
    } catch (e) {
      console.error("Backend POST returned non-JSON", e);
      return NextResponse.json({ error: "Bad backend response" }, { status: 500 });
    }

    // console.log("Backend POST /expenses response:", data);
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Next.js /api/expenses POST error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
