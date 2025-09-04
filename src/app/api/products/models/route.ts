import { NextResponse } from "next/server";
import axios from "axios";

const baseUrl = "https://baobab-vision-project.onrender.com";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { data, status } = await axios.get(`${baseUrl}/api/products/models`, {
      headers: { "Content-Type": "application/json" },
      validateStatus: () => true,
    });
    if (status < 200 || status >= 300) {
      return NextResponse.json(
        { message: "Upstream error", status, details: data },
        { status: 502 }
      );
    }
    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
