// lib/db/homepage.ts - Fixed error handling
import { db } from "./index";
import { HomepageContent, HeroCarousel, MediaType } from "@/types";
import { logger } from "@/lib/monitoring/logger";

export class HomepageService {
  static async getContent(section?: string): Promise<HomepageContent[]> {
    try {
      const where = section ? { section } : {};

      const content = await db.homepageContent.findMany({
        where,
        orderBy: [{ section: "asc" }, { orderIndex: "asc" }],
      });

      return content;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to get homepage content", {
        error: errorMessage,
        section,
      });

      // Return empty array instead of throwing to prevent page crash
      return [];
    }
  }

  static async updateContent(
    id: string,
    data: {
      title?: string;
      content?: string;
      orderIndex?: number;
    }
  ): Promise<HomepageContent> {
    try {
      const content = await db.homepageContent.update({
        where: { id },
        data,
      });

      logger.info("Homepage content updated", { contentId: id });
      return content;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to update homepage content", {
        error: errorMessage,
        contentId: id,
      });
      throw new Error("Failed to update homepage content");
    }
  }

  static async createContent(data: {
    section: string;
    title?: string;
    content?: string;
    orderIndex?: number;
  }): Promise<HomepageContent> {
    try {
      const content = await db.homepageContent.create({
        data,
      });

      logger.info("Homepage content created", { contentId: content.id });
      return content;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to create homepage content", {
        error: errorMessage,
        data,
      });
      throw new Error("Failed to create homepage content");
    }
  }

  // Hero carousel methods
  static async getHeroItems(): Promise<HeroCarousel[]> {
    try {
      const items = await db.heroCarousel.findMany({
        where: { isActive: true },
        orderBy: { orderIndex: "asc" },
      });

      return items;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to get hero carousel items", {
        error: errorMessage,
      });
      return [];
    }
  }

  static async createHeroItem(data: {
    title: string;
    description: string;
    ctaText: string;
    ctaLink: string;
    mediaUrl: string;
    mediaType: MediaType;
    cloudinaryId?: string;
    orderIndex?: number;
  }): Promise<HeroCarousel> {
    try {
      const item = await db.heroCarousel.create({
        data,
      });

      logger.info("Hero carousel item created", { itemId: item.id });
      return item;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to create hero carousel item", {
        error: errorMessage,
        data,
      });
      throw new Error("Failed to create hero carousel item");
    }
  }

  static async updateHeroItem(
    id: string,
    data: {
      title?: string;
      description?: string;
      ctaText?: string;
      ctaLink?: string;
      mediaUrl?: string;
      mediaType?: MediaType;
      cloudinaryId?: string;
      orderIndex?: number;
      isActive?: boolean;
    }
  ): Promise<HeroCarousel> {
    try {
      const item = await db.heroCarousel.update({
        where: { id },
        data,
      });

      logger.info("Hero carousel item updated", { itemId: id });
      return item;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to update hero carousel item", {
        error: errorMessage,
        itemId: id,
      });
      throw new Error("Failed to update hero carousel item");
    }
  }

  static async deleteHeroItem(id: string): Promise<void> {
    try {
      await db.heroCarousel.delete({
        where: { id },
      });

      logger.info("Hero carousel item deleted", { itemId: id });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to delete hero carousel item", {
        error: errorMessage,
        itemId: id,
      });
      throw new Error("Failed to delete hero carousel item");
    }
  }
}
