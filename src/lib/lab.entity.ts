// CLS-L-05: Lab Entity 클래스
// 연구실 기본정보를 표현하는 도메인 객체
// 위치·목적·관리등급·출입자·연락처·배치도·안전표지·사진 속성 보유

import { LabForm, ValidationResult } from "@/types/lab";

export class Lab {
  labId: string;
  labName: string;
  location: string;
  labType: string;
  contact?: string;
  mgmtLevel: string;
  orgId: string;
  safetySign?: string;
  layoutImage?: string;
  photo?: string;

  constructor(data: LabForm) {
    this.labId = data.labId;
    this.labName = data.labName;
    this.location = data.location;
    this.labType = data.labType;
    this.contact = data.contact;
    this.mgmtLevel = data.mgmtLevel;
    this.orgId = data.orgId;
    this.safetySign = data.safetySign;
    this.layoutImage = data.layoutImage;
    this.photo = data.photo;
  }

  // 필수값 충족 여부 확인
  validateRequired(): boolean {
    return !!(
      this.labId &&
      this.labName &&
      this.location &&
      this.labType &&
      this.mgmtLevel &&
      this.orgId
    );
  }

  // 중복 여부 판단 (Repository에서 호출)
  isDuplicated(): boolean {
    // 실제 중복 확인은 LabRepository.existsByKey()에서 처리
    // 이 메서드는 형식적 완전성을 위해 유지
    return false;
  }

  // 유효성 검사 상세
  validate(): ValidationResult {
    const errors: string[] = [];

    if (!this.labId || this.labId.length > 20) {
      errors.push("연구실 ID는 필수이며 20자 이내여야 합니다.");
    }
    if (!this.labName || this.labName.length > 100) {
      errors.push("연구실명은 필수이며 100자 이내여야 합니다.");
    }
    if (!this.location || this.location.length > 200) {
      errors.push("위치는 필수이며 200자 이내여야 합니다.");
    }
    if (!this.labType) {
      errors.push("연구실 유형은 필수입니다.");
    }
    if (!this.mgmtLevel) {
      errors.push("관리 등급은 필수입니다.");
    }
    if (!this.orgId || this.orgId.length > 20) {
      errors.push("기관 ID는 필수이며 20자 이내여야 합니다.");
    }
    if (this.contact && this.contact.length > 50) {
      errors.push("연락처는 50자 이내여야 합니다.");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
