import { InspectionRepository } from "@/app/lib/inspectionRepository";
import {
  InspectionDTO,
  InspectionSearchCondition,
  ApiResponse,
} from "@/types/inspection";

export class InspectionService {
  private inspectionRepository: InspectionRepository;

  constructor() {
    this.inspectionRepository = new InspectionRepository();
  }

  validateInspectionResult(dto: InspectionDTO): boolean {
    if (!dto.laboratoryId || dto.laboratoryId.trim().length === 0) return false;
    if (!dto.inspectionDate) return false;
    if (!dto.checklistResult || dto.checklistResult.trim().length === 0)
      return false;
    return true;
  }

  async submitInspectionResult(
    dto: InspectionDTO,
  ): Promise<ApiResponse<{ inspectionId: string }>> {
    const isValid = this.validateInspectionResult(dto);
    if (!isValid) {
      return { success: false, error: "필수 입력값이 누락되었습니다." };
    }

    const key = `${dto.laboratoryId}_${dto.inspectionDate}`;
    const exists = await this.inspectionRepository.existsInspectionResult(key);
    if (exists) {
      return {
        success: false,
        error: "해당 날짜에 이미 점검 결과가 등록되어 있습니다.",
      };
    }

    const inspectionId = await this.inspectionRepository.save(dto);
    return {
      success: true,
      data: { inspectionId },
      message: `점검 결과가 제출되었습니다. 점검번호: ${inspectionId}`,
    };
  }

  // UC-I02: 점검 결과 확인 처리
  async confirmInspection(inspectionId: string): Promise<ApiResponse<null>> {
    const item = await this.inspectionRepository.findById(inspectionId);
    if (!item) {
      return { success: false, error: "점검 결과를 찾을 수 없습니다." };
    }
    if (item.inspectionStatus !== "SUBMITTED") {
      return {
        success: false,
        error: "제출완료 상태의 점검만 확인 처리할 수 있습니다.",
      };
    }
    await this.inspectionRepository.confirm(inspectionId);
    return {
      success: true,
      data: null,
      message: "점검 결과가 확인 처리되었습니다.",
    };
  }

  async getInspectionHistoryList(
    condition: InspectionSearchCondition,
  ): Promise<ApiResponse<InspectionDTO[]>> {
    const list = await this.inspectionRepository.findByCondition(condition);
    return { success: true, data: list };
  }

  async getInspectionById(
    inspectionId: string,
  ): Promise<ApiResponse<InspectionDTO>> {
    const item = await this.inspectionRepository.findById(inspectionId);
    if (!item) {
      return { success: false, error: "점검 결과를 찾을 수 없습니다." };
    }
    return { success: true, data: item };
  }
}
