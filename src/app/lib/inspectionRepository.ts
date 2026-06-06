import { prisma } from "@/app/lib/prisma";
import { InspectionDTO, InspectionSearchCondition } from "@/types/inspection";

export class InspectionRepository {
  async existsInspectionResult(key: string): Promise<boolean> {
    const [laboratoryId, date] = key.split("_");
    const count = await prisma.dAILY_INSPECTION.count({
      where: {
        laboratoryId,
        inspectionDate: new Date(date),
      },
    });
    return count > 0;
  }

  async save(dto: InspectionDTO): Promise<string> {
    const inspectionId = `INS-${Date.now()}`;
    await prisma.dAILY_INSPECTION.create({
      data: {
        inspectionId,
        laboratoryId: dto.laboratoryId,
        inspectionDate: new Date(dto.inspectionDate),
        inspectionMethod: dto.inspectionMethod ?? null,
        checklistResult: dto.checklistResult,
        nonconformReason: dto.nonconformReason ?? null,
        specialNote: dto.specialNote ?? null,
        inspectionStatus: "SUBMITTED",
        writerId: dto.writerId || null,
        submitDateTime: new Date(),
      },
    });
    return inspectionId;
  }

  async findByCondition(
    condition: InspectionSearchCondition,
  ): Promise<InspectionDTO[]> {
    const where: Record<string, unknown> = {};

    if (condition.laboratoryId) where.laboratoryId = condition.laboratoryId;
    if (condition.inspectionStatus)
      where.inspectionStatus = condition.inspectionStatus;
    if (condition.searchFromDate || condition.searchToDate) {
      where.inspectionDate = {
        ...(condition.searchFromDate && {
          gte: new Date(condition.searchFromDate),
        }),
        ...(condition.searchToDate && {
          lte: new Date(condition.searchToDate),
        }),
      };
    }

    const rows = await prisma.dAILY_INSPECTION.findMany({
      where,
      orderBy: { inspectionDate: "desc" },
    });

    return rows.map((r) => ({
      inspectionId: r.inspectionId as unknown as number,
      laboratoryId: r.laboratoryId,
      inspectionDate: r.inspectionDate.toISOString().split("T")[0],
      inspectionMethod: r.inspectionMethod ?? "",
      checklistResult: r.checklistResult ?? "",
      nonconformReason: r.nonconformReason ?? undefined,
      specialNote: r.specialNote ?? undefined,
      inspectionStatus: r.inspectionStatus as InspectionDTO["inspectionStatus"],
      writerId: r.writerId ?? undefined,
    }));
  }

  async findById(inspectionId: string): Promise<InspectionDTO | null> {
    const r = await prisma.dAILY_INSPECTION.findUnique({
      where: { inspectionId },
    });
    if (!r) return null;
    return {
      inspectionId: r.inspectionId as unknown as number,
      laboratoryId: r.laboratoryId,
      inspectionDate: r.inspectionDate.toISOString().split("T")[0],
      inspectionMethod: r.inspectionMethod ?? "",
      checklistResult: r.checklistResult ?? "",
      nonconformReason: r.nonconformReason ?? undefined,
      specialNote: r.specialNote ?? undefined,
      inspectionStatus: r.inspectionStatus as InspectionDTO["inspectionStatus"],
      writerId: r.writerId ?? undefined,
    };
  }
}
