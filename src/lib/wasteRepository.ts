import { randomUUID } from "crypto";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  WasteRequestDTO,
  WasteRequestStatus,
  WasteSearchCondition,
} from "@/types/waste";

type WasteRequestRow = {
  requestId: string;
  labId: string;
  requesterId: string;
  wasteType: string;
  quantity: number;
  unit: string;
  status: string;
  requestedAt: Date;
  processedAt: Date | null;
};

export class WasteRepository {
  async save(dto: WasteRequestDTO): Promise<WasteRequestDTO> {
    const row = await prisma.wASTE_REQUEST.create({
      data: {
        requestId: randomUUID(),
        labId: dto.labId,
        requesterId: dto.requesterId,
        wasteType: dto.wasteType,
        quantity: dto.quantity,
        unit: dto.unit,
        status: "PENDING",
      },
    });

    return this.toDTO(row);
  }

  async findByCondition(
    condition: WasteSearchCondition,
  ): Promise<WasteRequestDTO[]> {
    const where: Prisma.WASTE_REQUESTWhereInput = {};

    if (condition.labId) {
      where.labId = { contains: condition.labId, mode: "insensitive" };
    }
    if (condition.wasteType) {
      where.wasteType = condition.wasteType;
    }
    if (condition.status) {
      where.status = condition.status;
    }

    const rows = await prisma.wASTE_REQUEST.findMany({
      where,
      orderBy: { requestedAt: "desc" },
    });

    return rows.map((row) => this.toDTO(row));
  }

  private toDTO(row: WasteRequestRow): WasteRequestDTO {
    return {
      requestId: row.requestId,
      labId: row.labId,
      requesterId: row.requesterId,
      wasteType: row.wasteType,
      quantity: row.quantity,
      unit: row.unit,
      status: row.status as WasteRequestStatus,
      requestedAt: row.requestedAt.toISOString(),
      processedAt: row.processedAt ? row.processedAt.toISOString() : null,
    };
  }
}
