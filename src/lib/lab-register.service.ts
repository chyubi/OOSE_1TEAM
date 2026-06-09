// CLS-L-03: LabRegisterService (Control)
// UC-L01 연구실 기본정보 등록 유스케이스 처리

import { LabRepository } from "@/lib/lab.repository";
import { Lab } from "@/lib/lab.entity";
import { LabForm, LabResult, ValidationResult } from "@/types/lab";

export class LabRegisterService {
  private labRepository: LabRepository;

  constructor() {
    this.labRepository = new LabRepository();
  }

  async register(labDto: LabForm): Promise<LabResult> {
    const validation = await this.validate(labDto);
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    const lab = new Lab(labDto);
    const saved = await this.labRepository.save(lab);

    return { success: true, data: saved, message: "연구실이 등록되었습니다." };
  }

  async modify(labDto: LabForm): Promise<LabResult> {
    const existing = await this.labRepository.findById(labDto.labId);
    if (!existing) {
      return { success: false, errors: ["해당 연구실을 찾을 수 없습니다."] };
    }

    const lab = new Lab(labDto);
    const validation = lab.validate();
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    await this.labRepository.delete(labDto.labId);
    const saved = await this.labRepository.save(lab);

    return { success: true, data: saved, message: "연구실 정보가 수정되었습니다." };
  }

  async validate(labDto: LabForm): Promise<ValidationResult> {
    const lab = new Lab(labDto);
    const validation = lab.validate();

    if (!validation.isValid) {
      return validation;
    }

    const idDuplicated = await this.labRepository.existsByKey(labDto.labId);
    if (idDuplicated) {
      return {
        isValid: false,
        errors: ["이미 사용 중인 연구실 ID입니다."],
      };
    }

    const nameDuplicated = await this.labRepository.existsByKey(labDto.labName);
    if (nameDuplicated) {
      return {
        isValid: false,
        errors: ["이미 등록된 연구실명입니다."],
      };
    }

    return { isValid: true, errors: [] };
  }

  async deleteById(labId: string): Promise<LabResult> {
    const existing = await this.labRepository.findById(labId);
    if (!existing) {
      return { success: false, errors: ["해당 연구실을 찾을 수 없습니다."] };
    }

    await this.labRepository.delete(labId);
    return { success: true, message: "연구실이 삭제되었습니다." };
  }
}
