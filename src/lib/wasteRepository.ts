import { Prisma } from "@prisma/client";
import { prisma } from "@/app/lib/prisma";
import {
  WasteRequestDTO,
  WasteRequestStatus,
  WasteSearchCondition,
} from "@/types/waste";

type WasteRequestRow = {
  REQUEST_ID: bigint;
  LABORATORY_ID: string;
  WASTE_TYPE: string;
  EMISSION_AMOUNT: Prisma.Decimal;
  EMISSION_DATE: Date;
  STORAGE_LOCATION: string;
  REQUEST_REASON: string | null;
  REQUEST_STATUS: string;
  REQUEST_DATETIME: Date;
};

const globalForWaste = globalThis as unknown as {
  wasteRequestStore?: WasteRequestDTO[];
  wasteRequestSeq?: number;
};

function isMissingWasteTable(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2021"
  );
}

export class WasteRepository {
  async save(dto: WasteRequestDTO): Promise<WasteRequestDTO> {
    try {
      const row = await prisma.wASTE_REQUEST.create({
        data: {
          LABORATORY_ID: dto.laboratoryId,
          WASTE_TYPE: dto.wasteType,
          EMISSION_AMOUNT: new Prisma.Decimal(dto.emissionAmount),
          EMISSION_DATE: new Date(dto.emissionDate),
          STORAGE_LOCATION: dto.storageLocation,
          REQUEST_REASON: dto.requestReason?.trim() || null,
          REQUEST_STATUS: "REQUESTED",
        },
      });

      return this.toDTO(row);
    } catch (error) {
      if (!isMissingWasteTable(error)) throw error;
      return this.saveToMemory(dto);
    }
  }

  async findByCondition(
    condition: WasteSearchCondition,
  ): Promise<WasteRequestDTO[]> {
    const where: Prisma.WASTE_REQUESTWhereInput = {};

    if (condition.laboratoryId) {
      where.LABORATORY_ID = {
        contains: condition.laboratoryId,
        mode: "insensitive",
      };
    }
    if (condition.wasteType) {
      where.WASTE_TYPE = condition.wasteType;
    }
    if (condition.requestStatus) {
      where.REQUEST_STATUS = condition.requestStatus;
    }
    if (condition.searchFromDate || condition.searchToDate) {
      where.EMISSION_DATE = {
        ...(condition.searchFromDate && {
          gte: new Date(condition.searchFromDate),
        }),
        ...(condition.searchToDate && {
          lte: new Date(condition.searchToDate),
        }),
      };
    }

    try {
      const rows = await prisma.wASTE_REQUEST.findMany({
        where,
        orderBy: { REQUEST_DATETIME: "desc" },
      });

      return rows.map((row) => this.toDTO(row));
    } catch (error) {
      if (!isMissingWasteTable(error)) throw error;
      return this.findInMemory(condition);
    }
  }

  private toDTO(row: WasteRequestRow): WasteRequestDTO {
    return {
      requestId: row.REQUEST_ID.toString(),
      laboratoryId: row.LABORATORY_ID,
      wasteType: row.WASTE_TYPE,
      emissionAmount: row.EMISSION_AMOUNT.toString(),
      emissionDate: row.EMISSION_DATE.toISOString().split("T")[0],
      storageLocation: row.STORAGE_LOCATION,
      requestReason: row.REQUEST_REASON ?? undefined,
      requestStatus: row.REQUEST_STATUS as WasteRequestStatus,
      requestDatetime: row.REQUEST_DATETIME.toISOString(),
    };
  }

  private saveToMemory(dto: WasteRequestDTO): WasteRequestDTO {
    globalForWaste.wasteRequestStore ??= [];
    globalForWaste.wasteRequestSeq ??= 1;

    const saved: WasteRequestDTO = {
      ...dto,
      requestId: String(globalForWaste.wasteRequestSeq++),
      requestStatus: "REQUESTED",
      requestDatetime: new Date().toISOString(),
    };

    globalForWaste.wasteRequestStore.unshift(saved);
    return saved;
  }

  private findInMemory(condition: WasteSearchCondition): WasteRequestDTO[] {
    const rows = globalForWaste.wasteRequestStore ?? [];
    return rows.filter((row) => {
      if (
        condition.laboratoryId &&
        !row.laboratoryId
          .toLowerCase()
          .includes(condition.laboratoryId.toLowerCase())
      ) {
        return false;
      }
      if (condition.wasteType && row.wasteType !== condition.wasteType) {
        return false;
      }
      if (
        condition.requestStatus &&
        row.requestStatus !== condition.requestStatus
      ) {
        return false;
      }
      if (
        condition.searchFromDate &&
        row.emissionDate < condition.searchFromDate
      ) {
        return false;
      }
      if (condition.searchToDate && row.emissionDate > condition.searchToDate) {
        return false;
      }
      return true;
    });
  }
}
