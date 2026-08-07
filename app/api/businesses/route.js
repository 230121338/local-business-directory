import { NextResponse } from "next/server";
import { getSubmittedBusinesses, saveSubmittedBusiness } from "@/lib/firebase";
import { validateBusinessSubmission, slugify } from "@/lib/utils";

export async function GET() {
  try {
    const businesses = await getSubmittedBusinesses();
    return NextResponse.json({ businesses: businesses });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const values = await request.json();
  const errors = validateBusinessSubmission(values);

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors: errors }, { status: 400 });
  }

  const id = "sub-" + Date.now() + "-" + slugify(values.name);

  const business = {
    id: id,
    name: values.name.trim(),
    category: values.category,
    shortDescription: values.shortDescription.trim(),
    description: values.description ? values.description.trim() : "",
    phone: values.phone.trim(),
    email: values.email.trim(),
    website: values.website ? values.website.trim() : "",
    whatsapp: "",
    address: values.address ? values.address.trim() : "",
    area: values.area.trim(),
    province: values.province ? values.province.trim() : "",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
    hours: {},
    status: "pending",
    featured: false,
    createdAt: new Date().toISOString().slice(0, 10)
  };

  try {
    await saveSubmittedBusiness(business);
    return NextResponse.json({ business: business }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
    }
