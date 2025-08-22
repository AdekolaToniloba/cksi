// lib/db/gallery.ts
import { db } from "./index";
import { GalleryEvent, GalleryMedia, MediaType } from "@/types";
import { generateSlug } from "@/lib/utils";
import { logger } from "@/lib/monitoring/logger";

export class GalleryService {
  static async createEvent(data: {
    title: string;
    description?: string;
    category: string;
    location?: string;
    eventDate?: Date;
    coverImage?: string;
  }): Promise<GalleryEvent> {
    try {
      const slug = generateSlug(data.title);

      const event = await db.galleryEvent.create({
        data: {
          ...data,
          slug,
        },
        include: {
          mediaItems: true,
        },
      });

      logger.info("Gallery event created", {
        eventId: event.id,
        title: event.title,
      });
      return event as GalleryEvent;
    } catch (error) {
      logger.error("Failed to create gallery event", { error, data });
      throw new Error("Failed to create gallery event");
    }
  }

  static async getEvents(category?: string): Promise<GalleryEvent[]> {
    try {
      const where = category
        ? { category, isPublished: true }
        : { isPublished: true };

      const events = await db.galleryEvent.findMany({
        where,
        include: {
          mediaItems: {
            where: { isPublished: true },
            orderBy: { orderIndex: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return events as GalleryEvent[];
    } catch (error) {
      logger.error("Failed to get gallery events", { error, category });
      throw new Error("Failed to get gallery events");
    }
  }

  static async getEvent(identifier: string): Promise<GalleryEvent | null> {
    try {
      const event = await db.galleryEvent.findFirst({
        where: {
          OR: [{ id: identifier }, { slug: identifier }],
          isPublished: true,
        },
        include: {
          mediaItems: {
            where: { isPublished: true },
            orderBy: { orderIndex: "asc" },
          },
        },
      });

      return event as GalleryEvent | null;
    } catch (error) {
      logger.error("Failed to get gallery event", { error, identifier });
      return null;
    }
  }

  static async addMediaToEvent(
    eventId: string,
    mediaData: {
      title?: string;
      description?: string;
      mediaUrl: string;
      mediaType: MediaType;
      fileSize?: number;
      mimeType?: string;
      width?: number;
      height?: number;
      duration?: number;
      cloudinaryPublicId?: string;
      cloudinaryFolder?: string;
      cloudinaryTags?: string[];
    }
  ): Promise<GalleryMedia> {
    try {
      const media = await db.galleryMedia.create({
        data: {
          ...mediaData,
          eventId,
        },
      });

      logger.info("Media added to gallery event", {
        mediaId: media.id,
        eventId,
      });
      return media as GalleryMedia;
    } catch (error) {
      logger.error("Failed to add media to gallery event", {
        error,
        eventId,
        mediaData,
      });
      throw new Error("Failed to add media to gallery event");
    }
  }
}
