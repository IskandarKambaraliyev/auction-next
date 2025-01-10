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
            message: "You must be an admin to mark the lot as done",
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
      const lot = await prisma.auctionLot.findUnique({
        where: {
          id: validated.data.id,
        },
        include: {
          bids: {
            orderBy: {
              amount: "desc",
            },
            take: 1,
          },
        },
      });

      if (!lot) {
        return NextResponse.json(
          {
            error: "Lot not found",
          },
          { status: 404 }
        );
      }

      if (lot.bids.length === 0) {
        await prisma.auctionLot.update({
          where: {
            id: validated.data.id,
          },
          data: {
            status: "DONE",
          },
        });
      } else {
        await prisma.auctionLot.update({
          where: {
            id: validated.data.id,
          },
          data: {
            status: "DONE",
            buyer: {
              connect: {
                id: lot.bids[0].userId,
              },
            },
          },
        });
      }
      return NextResponse.json({ success: true });
    } catch (e) {
      return NextResponse.json(
        {
          error: "Failed to mark the lot as done",
        },
        { status: 500 }
      );
    }
  }
}
