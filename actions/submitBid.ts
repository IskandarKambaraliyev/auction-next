"use server";

import getUserInfo from "@/hooks/getUserInfo";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const bidSchema = z.object({
  amount: z
    .string()
    .regex(/^\d+$/, {
      message: "Must be a number",
    })
    .transform((val) => parseInt(val, 10)),
  lotId: z.string(),
});

export async function submitBid(prevState: any, formData: FormData) {
  const user = await getUserInfo();

  if (!user) {
    return {
      amountError: null,
      formError: "You must be logged in to place a bid",
      success: false,
    };
  }

  const validatedData = bidSchema.safeParse({
    amount: formData.get("amount") as string,
    lotId: formData.get("lotId") as string,
  });

  if (!validatedData.success) {
    return {
      amountError:
        validatedData.error.errors.find((error) => error.path[0] === "amount")
          ?.message || null,
      formError:
        validatedData.error.errors.find((error) => error.path[0] === "lotId")
          ?.message || null,
      success: false,
    };
  } else {
    try {
      const lot = await prisma.auctionLot.findUnique({
        where: {
          id: validatedData.data.lotId,
        },
        select: {
          status: true,
          startingBid: true,
          estimatedPrice: true,
        },
      });

      if (!lot) {
        return {
          amountError: null,
          formError: "Lot not found",
          success: false,
        };
      } else if (lot.status === "DONE") {
        return {
          amountError: null,
          formError: "This auction has ended",
          success: false,
        };
      } else if (
        lot.startingBid > validatedData.data.amount ||
        lot.estimatedPrice + 100000000 < validatedData.data.amount
      ) {
        return {
          amountError: "Invalid bid amount",
          formError: null,
          success: false,
        };
      }

      const data = await prisma.bid.create({
        data: {
          amount: validatedData.data.amount,
          auctionLotId: validatedData.data.lotId,
          userId: user.userId,
        },
      });

      if (!data) {
        return {
          amountError: null,
          formError: "An error occurred while submitting your bid",
          success: false,
        };
      }

      revalidatePath(`/lots/${validatedData.data.lotId}`);

      return {
        amountError: null,
        formError: null,
        success: true,
      };
    } catch (error) {
      console.error(error);
      return {
        amountError: null,
        formError: "An error occurred while submitting your bid",
        success: false,
      };
    }
  }
}
