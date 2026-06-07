// CLS-L-03: LabRegisterService (Control)
// UC-L01 연구실 기본정보 등록
// 등록 유스케이스 흐름을 제어한다.
// 입력값 검증(중복·필수값·유형·형태·원칙)을 수행하고
// 엔티티를 통해 저장하며 결과를 구한다.

import { LabRepository } from "@/lib/lab.repository";
import { Lab } from "@/lib/lab.entity";
import { LabForm, LabResult, ValidationResult } from "@/types/lab";

export class LabRegisterService {
  private labRepository: LabRepository;

  constructor() {
    this.labRepository = new LabRepository();
  }

  // 신규 연구실 기본정보를 등록한다.
  async register(labDto: LabForm): Promise<LabResult> {
    // 1. 유효성 검사
    const validation = await this.validate(labDto);
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    // 2. 엔티티 생성 및 저장
    const lab = new Lab(labDto);
    const saved = await this.labRepository.save(lab);

    return { success: true, data: saved, message: "연구실이 등록되었습니다." };
  }

  // 기존 연구실 기본정보를 수정한다.
  async modify(labDto: LabForm): Promise<LabResult> {
    // 1. 존재 확인
    const existing = await this.labRepository.findById(labDto.labId);
    if (!existing) {
      return { success: false, errors: ["해당 연구실을 찾을 수 없습니다."] };
    }

    // 2. 유효성 검사 (ID 중복 제외)
    const lab = new Lab(labDto);
    const validation = lab.validate();
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    // 3. 삭제 후 재등록 (Prisma upsert 활용)
    await this.labRepository.delete(labDto.labId);
    const saved = await this.labRepository.save(lab);

    return { success: true, data: saved, message: "연구실 정보가 수정되었습니다." };
  }

  // 중복·필수값·유형·형태·원칙 검증
  async validate(labDto: LabForm): Promise<ValidationResult> {
    const lab = new Lab(labDto);
    const validation = lab.validate();

    if (!validation.isValid) {
      return validation;
    }

    // 중복 검사: ID
    const idDuplicated = await this.labRepository.existsByKey(labDto.labId);
    if (idDuplicated) {
      return {
        isValid: false,
        errors: ["이미 사용 중인 연구실 ID입니다."],
      };
    }

    // 중복 검사: 연구실명
    const nameDuplicated = await this.labRepository.existsByKey(labDto.labName);
    if (nameDuplicated) {
      return {
        isValid: false,
        errors: ["이미 등록된 연구실명입니다."],
      };
    }

    return { isValid: true, errors: [] };
  }

  // 연구실 기본정보를 삭제한다.
  async deleteById(labId: string): Promise<LabResult> {
    const existing = await this.labRepository.findById(labId);
    if (!existing) {
      return { success: false, errors: ["해당 연구실을 찾을 수 없습니다."] };
    }

    await this.labRepository.delete(labId);
    return { success: true, message: "연구실이 삭제되었습니다." };
  }
}
