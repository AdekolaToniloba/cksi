// lib/db-queries.ts
import { prisma } from "./prisma";
import { DonationStatus, DonationType } from "@prisma/client";

export interface CreateDonationData {
  amount: number;
  donor_name: string | null;
  donor_email: string;
  donor_phone?: string | null;
  is_anonymous: boolean;
  donation_type: string;
  payment_reference: string;
  status: string;
  currency: string;
  campaign_id?: string | null;
  paystack_reference?: string | null;
}

export const createDonation = async (data: CreateDonationData) => {
  return await prisma.donation.create({
    data: {
      donorName: data.donor_name,
      donorEmail: data.donor_email,
      donorPhone: data.donor_phone,
      amount: data.amount,
      currency: data.currency,
      campaignId: data.campaign_id,
      paymentReference: data.payment_reference,
      paystackReference: data.paystack_reference,
      status: data.status.toUpperCase() as DonationStatus,
      isAnonymous: data.is_anonymous,
      donationType: data.donation_type
        .toUpperCase()
        .replace("-", "_") as DonationType,
    },
  });
};

export const updateDonationStatus = async (
  id: string,
  status: DonationStatus,
  paystackReference?: string,
  paymentData?: any
) => {
  return await prisma.donation.update({
    where: { id },
    data: {
      status,
      paystackReference,
      // You might want to add a paymentData field to your schema for storing Paystack response
    },
  });
};

export const getDonationByReference = async (reference: string) => {
  return await prisma.donation.findUnique({
    where: { paymentReference: reference },
  });
};

export const getDonations = async (filters?: {
  status?: DonationStatus;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}) => {
  const where: any = {};

  if (filters?.status) {
    where.status = filters.status;
  }

  if (filters?.startDate || filters?.endDate) {
    where.createdAt = {};
    if (filters.startDate) {
      where.createdAt.gte = filters.startDate;
    }
    if (filters.endDate) {
      where.createdAt.lte = filters.endDate;
    }
  }

  return await prisma.donation.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: filters?.limit,
    skip: filters?.offset,
  });
};

export const getDonationStats = async () => {
  const [total, completed, pending, failed] = await Promise.all([
    prisma.donation.count(),
    prisma.donation.count({ where: { status: "COMPLETED" } }),
    prisma.donation.count({ where: { status: "PENDING" } }),
    prisma.donation.count({ where: { status: "FAILED" } }),
  ]);

  const totalAmountResult = await prisma.donation.aggregate({
    where: { status: "COMPLETED" },
    _sum: { amount: true },
  });

  return {
    total,
    completed,
    pending,
    failed,
    totalAmount: totalAmountResult._sum.amount || 0,
  };
};
