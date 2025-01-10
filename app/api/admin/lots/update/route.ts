import { allSubjects } from "@/data";
import getUserInfo from "@/hooks/getUserInfo";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  id: z.string().cuid(),
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(50, "Title cannot exceed 50 characters"),
  artist: z
    .string()
    .min(5, "Artist name must be at least 5 characters")
    .max(50, "Artist name cannot exceed 50 characters"),
  year: z
    .number()
    .gt(0, "Year must be greater than 0")
    .lte(new Date().getFullYear(), "Year cannot be in the future"),
  subject: z.enum(allSubjects as [string, ...string[]]),
  description: z
    .string()
    .min(5, "Description must be at least 5 characters")
    .max(250, "Description cannot exceed 250 characters"),
  estimated: z
    .number()
    .gt(0, "Estimated price must be greater than 0")
    .lte(150000000, "Estimated price cannot exceed 100,000,000"),
  starting: z
    .number()
    .gt(0, "Starting price must be greater than 0")
    .lte(100000000, "Starting price cannot exceed 100,000,000"),
  auctionDate: z
    .date()
    .refine(
      (date) => date >= new Date(),
      "Auction date must be today or in the future"
    )
    .refine(
      (date) =>
        date <= new Date(new Date().setMonth(new Date().getMonth() + 3)),
      "Auction date cannot be more than 3 months from today"
    ),
  width: z
    .number()
    .gt(0, "Width must be greater than 0")
    .lte(1500000, "Width must be less than 1,500,000"),
  height: z
    .number()
    .gt(0, "Height must be greater than 0")
    .lte(1500000, "Height must be less than 1,500,000"),
  images: z.array(z.string()).min(1, "Provide at least one image url"),
});

export async function POST(req: NextRequest) {
  const user = await getUserInfo();

  if (!user) {
    return NextResponse.json(
      {
        errors: [
          {
            field: "form",
            message: "You must be logged in to update the lot",
          },
        ],
      },
      {
        status: 401,
      }
    );
  } else if (user.userRole !== "ADMIN") {
    return NextResponse.json(
      {
        errors: [
          {
            field: "form",
            message: "You must be an admin to update the lot",
          },
        ],
      },
      {
        status: 401,
      }
    );
  }
  const body = await req.json();
  const parsedBody = {
    ...body,
    auctionDate: body.auctionDate ? new Date(body.auctionDate) : undefined,
  };

  const validated = schema.safeParse(parsedBody);

  if (!validated.success) {
    return NextResponse.json(
      {
        errors: validated.error.errors.map((error) => ({
          field: error.path.join("."),
          message: error.message,
        })),
      },
      {
        status: 400,
      }
    );
  } else {
    try {
      const newLot = await prisma.auctionLot.update({
        where: {
          id: validated.data.id,
        },
        data: {
          title: validated.data.title,
          artistName: validated.data.artist,
          yearOfCreation: validated.data.year,
          subject: validated.data.subject as any,
          description: validated.data.description,
          estimatedPrice: validated.data.estimated,
          startingBid: validated.data.starting,
          auctionDate: validated.data.auctionDate,
          images: validated.data.images,
          width: validated.data.width,
          height: validated.data.height,
          depth: null,
          status: "PENDING",
        },
      });

      return NextResponse.json(
        { message: "Lot updated successfully", id: newLot.id },
        { status: 201 }
      );
    } catch (error) {
      // Ensure error is properly logged
      console.error("Error in POST handler:", error);

      // Provide a fallback error message
      return NextResponse.json(
        {
          errors: [
            {
              field: "form",
              message: "An error occurred while updating the lot",
            },
          ],
        },
        { status: 500 }
      );
    }
  }
}
