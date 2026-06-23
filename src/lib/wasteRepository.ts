import { prisma } from "@/lib/prisma";
import {
  WasteRequestDTO,
  WasteRequestStatus,
  WasteSearchCondition,
} from "@/types/waste";

export class WasteRepository {
  async save(dto: WasteRequestDTO): Promise<WasteRequestDTO> {
    const row = await prisma.wASTE_REQUEST.create({
      data: {
        requestId: `WR-${Date.now()}`,
        labId: dto.laboratoryId,
        requesterId: dto.requesterId ?? "SYSTEM",
        wasteType: dto.wasteType,
        quantity: parseFloat(dto.emissionAmount),
        unit: dto.unit ?? "L",
        status: "PENDING",
        requestedAt: new Date(),
      },
    });

    return this.toDTO(row);
  }

  async findByCondition(
    condition: WasteSearchCondition,
  ): Promise<WasteRequestDTO[]> {
    const where: Record<string, unknown> = {};

    if (condition.laboratoryId) {
      where.labId = { contains: condition.laboratoryId, mode: "insensitive" };
    }
    if (condition.wasteType) {
      where.wasteType = condition.wasteType;
    }
    if (condition.requestStatus) {
      where.status = condition.requestStatus;
    }
    if (condition.searchFromDate || condition.searchToDate) {
      where.requestedAt = {
        ...(condition.searchFromDate && {
          gte: new Date(condition.searchFromDate),
        }),
        ...(condition.searchToDate && {
          lte: new Date(condition.searchToDate),
        }),
      };
    }

    const rows = await prisma.wASTE_REQUEST.findMany({
      where,
      orderBy: { requestedAt: "desc" },
    });

    return rows.map((row) => this.toDTO(row));
  }

  private toDTO(row: any): WasteRequestDTO {
    return {
      requestId: row.requestId,
      laboratoryId: row.labId,
      wasteType: row.wasteType,
      emissionAmount: String(row.quantity),
      emissionDate: row.requestedAt?.toISOString().split("T")[0] ?? "",
      storageLocation: "",
      requestReason: undefined,
      requestStatus: row.status as WasteRequestStatus,
      requestDatetime: row.requestedAt?.toISOString() ?? "",
    };
  }
}
