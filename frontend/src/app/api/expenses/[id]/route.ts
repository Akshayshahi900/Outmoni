import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { createJWT } from "@/lib/jwt";

const BACKEND_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  const { id } = await context.params;

  try {
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await fetch(`${BACKEND_URL}/api/expenses/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${await createJWT(token)}`,
      },
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ error: err || "Delete failed" }, { status: response.status });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}
