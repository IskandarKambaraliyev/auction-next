import getUserInfo from "@/hooks/getUserInfo";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  id: z.string().cuid(),
});

export async function POST(req: NextRequest) {
  const user = await getUserInfo();

  if (!user || user.userRole !== "ADMIN") {
    return NextResponse.json(
      {
        errors: [
          {
            field: "form",
            message: "You must be an admin to delete the lot",
          },
        ],
      },
      { status: 401 }
    );
  }

  const body = await req.json();
  const validated = schema.safeParse(body);

  if (!validated.success) {
    return NextResponse.json(
      {
        errors: validated.error.errors.map((error) => ({
          field: error.path.join("."),
          message: error.message,
        })),
      },
      { status: 400 }
    );
  } else {
    try {
      await prisma.auctionLot.delete({
        where: {
          id: validated.data.id,
        },
      });
      return NextResponse.json({ success: true });
    } catch (e) {
      return NextResponse.json(
        {
          errors: [
            {
              field: "form",
              message: "Failed to delete the lot",
            },
          ],
        },
        { status: 500 }
      );
    }
  }
}
