// CLS-L-06: LabRepository
// 연구실 기본정보를 데이터베이스(TBL-L-01)에 저장·수정하고
// 조건에 따라 조회하는 영속성 처리를 담당한다.

import { prisma } from "@/app/lib/prisma";
import { Lab } from "@/lib/lab.entity";
import { LabDetail, LabSummary } from "@/types/lab";

export class LabRepository {
  // 신규 연구실 기본정보를 등록한다.
  async save(lab: Lab): Promise<LabDetail> {
    const record = await prisma.lAB_INFO.create({
      data: {
        LAB_ID: lab.labId,
        LAB_NAME: lab.labName,
        LOCATION: lab.location,
        LAB_TYPE: lab.labType,
        CONTACT: lab.contact ?? null,
        MGMT_LEVEL: lab.mgmtLevel,
        ORG_ID: lab.orgId,
        SAFETY_SIGN: lab.safetySign ?? null,
        LAYOUT_IMG: lab.layoutImage ?? null,
        PHOTO: lab.photo ?? null,
      },
    });

    return this.toDetail(record);
  }

  // ID로 연구실 단건을 조회한다.
  async findById(labId: string): Promise<LabDetail | null> {
    const record = await prisma.lAB_INFO.findUnique({
      where: { LAB_ID: labId },
    });
    return record ? this.toDetail(record) : null;
  }

  // 조건 기반으로 목록을 조회한다.
  async findByCond(cond: {
    labName?: string;
    labType?: string;
    mgmtLevel?: string;
    location?: string;
  }): Promise<LabSummary[]> {
    const records = await prisma.lAB_INFO.findMany({
      where: {
        ...(cond.labName && {
          LAB_NAME: { contains: cond.labName, mode: "insensitive" },
        }),
        ...(cond.labType && { LAB_TYPE: cond.labType }),
        ...(cond.mgmtLevel && { MGMT_LEVEL: cond.mgmtLevel }),
        ...(cond.location && {
          LOCATION: { contains: cond.location, mode: "insensitive" },
        }),
      },
      orderBy: { CREATED_AT: "desc" },
    });

    return records.map(this.toSummary);
  }

  // 중복 검사: 존재 여부를 확인한다.
  async existsByKey(key: string): Promise<boolean> {
    const count = await prisma.lAB_INFO.count({
      where: {
        OR: [{ LAB_ID: key }, { LAB_NAME: key }],
      },
    });
    return count > 0;
  }

  // 연구실 기본정보를 삭제한다.
  async delete(labId: string): Promise<void> {
    await prisma.lAB_INFO.delete({
      where: { LAB_ID: labId },
    });
  }

  // DB 레코드 → LabDetail 변환
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private toDetail(record: any): LabDetail {
    return {
      labId: record.LAB_ID,
      labName: record.LAB_NAME,
      location: record.LOCATION,
      labType: record.LAB_TYPE,
      contact: record.CONTACT ?? undefined,
      mgmtLevel: record.MGMT_LEVEL,
      orgId: record.ORG_ID,
      safetySign: record.SAFETY_SIGN ?? undefined,
      layoutImage: record.LAYOUT_IMG ?? undefined,
      photo: record.PHOTO ?? undefined,
      createdAt: record.CREATED_AT.toISOString(),
      updatedAt: record.UPDATED_AT?.toISOString(),
    };
  }

  // DB 레코드 → LabSummary 변환
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private toSummary(record: any): LabSummary {
    return {
      labId: record.LAB_ID,
      labName: record.LAB_NAME,
      location: record.LOCATION,
      labType: record.LAB_TYPE,
      mgmtLevel: record.MGMT_LEVEL,
    };
  }
}
