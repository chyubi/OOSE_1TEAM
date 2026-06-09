// CLS-L-05: Lab Entity 클래스
// 연구실 기본정보를 표현하는 도메인 객체

import { LabForm, ValidationResult } from "@/types/lab";

export class Lab {
  labId: string;
  labName: string;
  location: string;
  labType: string;
  contactPerson?: string;
  mgmtLevel: string;
  floorPlan?: string;
  photo?: string;

  constructor(data: LabForm) {
    this.labId = data.labId;
    this.labName = data.labName;
    this.location = data.location;
    this.labType = data.labType;
    this.contactPerson = data.contactPerson;
    this.mgmtLevel = data.mgmtLevel;
    this.floorPlan = data.floorPlan;
    this.photo = data.photo;
  }

  validateRequired(): boolean {
    return !!(
      this.labId &&
      this.labName &&
      this.location &&
      this.labType &&
      this.mgmtLevel
    );
  }

  isDuplicated(): boolean {
    return false;
  }

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
    if (this.contactPerson && this.contactPerson.length > 50) {
      errors.push("연락처는 50자 이내여야 합니다.");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
