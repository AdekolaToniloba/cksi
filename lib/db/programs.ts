// lib/db/programs.ts
import { db } from "./index";
import { Program, CreateProgramInput, ProgramStatus } from "@/types";
import { generateSlug } from "@/lib/utils";
import { logger } from "@/lib/monitoring/logger";

export class ProgramService {
  static async createProgram(data: CreateProgramInput): Promise<Program> {
    try {
      const slug = generateSlug(data.title);

      const program = await db.program.create({
        data: {
          ...data,
          slug,
        },
      });

      logger.info("Program created", {
        programId: program.id,
        title: program.title,
      });
      return program as Program;
    } catch (error) {
      logger.error("Failed to create program", { error, data });
      throw new Error("Failed to create program");
    }
  }

  static async updateProgram(
    id: string,
    data: Partial<CreateProgramInput>
  ): Promise<Program> {
    try {
      const updateData: any = { ...data };

      if (data.title) {
        updateData.slug = generateSlug(data.title);
      }

      const program = await db.program.update({
        where: { id },
        data: updateData,
      });

      logger.info("Program updated", { programId: program.id });
      return program as Program;
    } catch (error) {
      logger.error("Failed to update program", { error, programId: id });
      throw new Error("Failed to update program");
    }
  }

  static async deleteProgram(id: string): Promise<void> {
    try {
      await db.program.delete({
        where: { id },
      });

      logger.info("Program deleted", { programId: id });
    } catch (error) {
      logger.error("Failed to delete program", { error, programId: id });
      throw new Error("Failed to delete program");
    }
  }

  static async getProgram(identifier: string): Promise<Program | null> {
    try {
      const program = await db.program.findFirst({
        where: {
          OR: [{ id: identifier }, { slug: identifier }],
        },
      });

      return program as Program | null;
    } catch (error) {
      logger.error("Failed to get program", { error, identifier });
      return null;
    }
  }

  static async getPrograms(
    params: {
      status?: ProgramStatus;
      category?: string;
    } = {}
  ): Promise<Program[]> {
    try {
      const where: any = {};

      if (params.status) {
        where.status = params.status;
      }

      if (params.category) {
        where.category = params.category;
      }

      const programs = await db.program.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });

      return programs as Program[];
    } catch (error) {
      logger.error("Failed to get programs", { error, params });
      throw new Error("Failed to get programs");
    }
  }

  static async getActivePrograms(): Promise<Program[]> {
    return this.getPrograms({ status: ProgramStatus.ACTIVE });
  }
}
