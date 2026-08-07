import { NextResponse } from "next/server";
import { updateSubmittedBusinessStatus } from "@/lib/firebase";

export async function PATCH(request, context) {
  const body = await request.json();
  const status = body.status;
  const id = context.params.id;

  if (status !== "approved" && status !== "pending" && status !== "rejected") {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  try {
    await updateSubmittedBusinessStatus(id, status);
    return NextResponse.json({ id: id, status: status });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
