import {
  ApiResponse,
  WasteRequestDTO,
  WasteSearchCondition,
} from "@/types/waste";
import { WasteRepository } from "@/lib/wasteRepository";

export class WasteService {
  private wasteRepository: WasteRepository;

  constructor() {
    this.wasteRepository = new WasteRepository();
  }

  validateRequest(dto: WasteRequestDTO): boolean {
    if (!dto.laboratoryId || dto.laboratoryId.trim().length === 0) return false;
    if (!dto.wasteType || dto.wasteType.trim().length === 0) return false;
    if (!dto.emissionDate) return false;
    if (!dto.storageLocation || dto.storageLocation.trim().length === 0) {
      return false;
    }

    const amount = Number(dto.emissionAmount);
    return Number.isFinite(amount) && amount > 0;
  }

  async createWasteRequest(
    dto: WasteRequestDTO,
  ): Promise<ApiResponse<WasteRequestDTO>> {
    if (!this.validateRequest(dto)) {
      return { success: false, error: "필수 입력값을 확인해 주세요." };
    }

    const saved = await this.wasteRepository.save({
      ...dto,
      laboratoryId: dto.laboratoryId.trim(),
      wasteType: dto.wasteType.trim(),
      storageLocation: dto.storageLocation.trim(),
      requestReason: dto.requestReason?.trim(),
    });

    return {
      success: true,
      data: saved,
      message: "폐기물 배출 신청이 등록되었습니다.",
    };
  }

  async getWasteRequests(
    condition: WasteSearchCondition,
  ): Promise<ApiResponse<WasteRequestDTO[]>> {
    const requests = await this.wasteRepository.findByCondition(condition);
    return { success: true, data: requests };
  }
}
