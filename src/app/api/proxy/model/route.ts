import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ALLOWED_HOSTS = new Set(["firebasestorage.googleapis.com"]);

export async function GET(req: NextRequest) {
  const urlParam = req.nextUrl.searchParams.get("url");
  if (!urlParam) {
    return NextResponse.json({ message: "Missing url param" }, { status: 400 });
  }
  let target: URL;
  try {
    target = new URL(urlParam);
  } catch {
    return NextResponse.json({ message: "Invalid url" }, { status: 400 });
  }
  if (!ALLOWED_HOSTS.has(target.hostname)) {
    return NextResponse.json({ message: "Host not allowed" }, { status: 400 });
  }

  try {
    const resp = await axios.get<ArrayBuffer>(target.toString(), {
      responseType: "arraybuffer",
      // forward some headers if needed
      headers: {
        Accept: "model/gltf-binary,application/octet-stream,*/*",
      },
      validateStatus: () => true,
    });
    if (resp.status < 200 || resp.status >= 300) {
      return NextResponse.json(
        { message: "Upstream fetch failed", status: resp.status },
        { status: 502 }
      );
    }
    const bytes = Buffer.from(resp.data);
    return new NextResponse(bytes, {
      status: 200,
      headers: {
        "Content-Type": "model/gltf-binary",
        "Cache-Control": "public, max-age=86400, immutable",
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
