// lib/db/donations.ts
import { db } from "./index";
import { Donation, CreateDonationInput, DonationStatus } from "@/types";
import { generatePaymentReference } from "@/lib/utils";
import { logger } from "@/lib/monitoring/logger";

export class DonationService {
  static async createDonation(data: CreateDonationInput): Promise<Donation> {
    try {
      const paymentReference = generatePaymentReference();

      const donation = await db.donation.create({
        data: {
          ...data,
          paymentReference,
          currency: data.currency || "NGN",
        },
      });

      logger.info("Donation created", {
        donationId: donation.id,
        amount: donation.amount,
      });
      return donation as Donation;
    } catch (error) {
      logger.error("Failed to create donation", { error, data });
      throw new Error("Failed to create donation");
    }
  }

  static async updateDonationStatus(
    paymentReference: string,
    status: DonationStatus,
    paystackReference?: string
  ): Promise<Donation> {
    try {
      const donation = await db.donation.update({
        where: { paymentReference },
        data: {
          status,
          paystackReference,
        },
      });

      logger.info("Donation status updated", {
        donationId: donation.id,
        status,
        paymentReference,
      });
      return donation as Donation;
    } catch (error) {
      logger.error("Failed to update donation status", {
        error,
        paymentReference,
        status,
      });
      throw new Error("Failed to update donation status");
    }
  }

  static async getDonations(
    params: {
      status?: DonationStatus;
      page?: number;
      limit?: number;
    } = {}
  ): Promise<Donation[]> {
    try {
      const { status, page = 1, limit = 50 } = params;
      const skip = (page - 1) * limit;

      const where = status ? { status } : {};

      const donations = await db.donation.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      });

      return donations as Donation[];
    } catch (error) {
      logger.error("Failed to get donations", { error, params });
      throw new Error("Failed to get donations");
    }
  }

  static async getDonationStats(): Promise<{
    total: number;
    totalAmount: number;
    thisMonth: number;
    thisMonthAmount: number;
  }> {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const [total, totalAmount, thisMonth, thisMonthAmount] =
        await Promise.all([
          db.donation.count({
            where: { status: DonationStatus.COMPLETED },
          }),
          db.donation.aggregate({
            where: { status: DonationStatus.COMPLETED },
            _sum: { amount: true },
          }),
          db.donation.count({
            where: {
              status: DonationStatus.COMPLETED,
              createdAt: { gte: startOfMonth },
            },
          }),
          db.donation.aggregate({
            where: {
              status: DonationStatus.COMPLETED,
              createdAt: { gte: startOfMonth },
            },
            _sum: { amount: true },
          }),
        ]);

      return {
        total,
        totalAmount: totalAmount._sum.amount || 0,
        thisMonth,
        thisMonthAmount: thisMonthAmount._sum.amount || 0,
      };
    } catch (error) {
      logger.error("Failed to get donation stats", { error });
      throw new Error("Failed to get donation stats");
    }
  }
}
