// SDD CLS-I-04: InspectionService
// 점검 결과 입력값 검증, 권한 확인, 점검 상태 처리 (서비스 계층)

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

  // UC-I01: 점검 결과 입력값 검증
  validateInspectionResult(dto: InspectionDTO): boolean {
    if (!dto.laboratoryId || dto.laboratoryId.trim().length === 0) return false;
    if (!dto.inspectionDate) return false;
    if (!dto.checklistResult || dto.checklistResult.trim().length === 0)
      return false;
    return true;
  }

  // UC-I01: 점검 결과 제출
  async submitInspectionResult(
    dto: InspectionDTO,
  ): Promise<ApiResponse<{ inspectionId: number }>> {
    const isValid = this.validateInspectionResult(dto);
    if (!isValid) {
      return { success: false, error: "필수 입력값이 누락되었습니다." };
    }

    // 동일 연구실·동일 날짜 중복 체크
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

  // UC-I03: 점검 이력 조회
  async getInspectionHistoryList(
    condition: InspectionSearchCondition,
  ): Promise<ApiResponse<InspectionDTO[]>> {
    const list = await this.inspectionRepository.findByCondition(condition);
    return { success: true, data: list };
  }

  // UC-I04: 점검 단건 조회
  async getInspectionById(
    inspectionId: number,
  ): Promise<ApiResponse<InspectionDTO>> {
    const item = await this.inspectionRepository.findById(inspectionId);
    if (!item) {
      return { success: false, error: "점검 결과를 찾을 수 없습니다." };
    }
    return { success: true, data: item };
  }
}
