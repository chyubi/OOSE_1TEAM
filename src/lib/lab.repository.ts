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
        labId: lab.labId,
        labName: lab.labName,
        location: lab.location,
        labType: lab.labType,
        contactPerson: lab.contactPerson ?? null,
        safetyLevel: lab.mgmtLevel,
        ORG_ID: lab.orgId,
        floorPlan: lab.safetySign ?? null,
        LAYOUT_IMG: lab.layoutImage ?? null,
        PHOTO: lab.photo ?? null,
      },
    });

    return this.toDetail(record);
  }

  // ID로 연구실 단건을 조회한다.
  async findById(labId: string): Promise<LabDetail | null> {
    const record = await prisma.lAB_INFO.findUnique({
      where: { labId: labId },
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
          labName: { contains: cond.labName, mode: "insensitive" },
        }),
        ...(cond.labType && { labType: cond.labType }),
        ...(cond.mgmtLevel && { safetyLevel: cond.mgmtLevel }),
        ...(cond.location && {
          location: { contains: cond.location, mode: "insensitive" },
        }),
      },
      orderBy: { createdAt: "desc" },
    });

    return records.map(this.toSummary);
  }

  // 중복 검사: 존재 여부를 확인한다.
  async existsByKey(key: string): Promise<boolean> {
    const count = await prisma.lAB_INFO.count({
      where: {
        OR: [{ labId: key }, { labName: key }],
      },
    });
    return count > 0;
  }

  // 연구실 기본정보를 삭제한다.
  async delete(labId: string): Promise<void> {
    await prisma.lAB_INFO.delete({
      where: { labId: labId },
    });
  }

  // DB 레코드 → LabDetail 변환
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private toDetail(record: any): LabDetail {
    return {
      labId: record.labId,
      labName: record.labName,
      location: record.location,
      labType: record.labType,
      contactPerson: record.contactPerson ?? undefined,
      mgmtLevel: record.safetyLevel,
      orgId: record.ORG_ID,
      safetySign: record.floorPlan ?? undefined,
      layoutImage: record.LAYOUT_IMG ?? undefined,
      photo: record.PHOTO ?? undefined,
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt?.toISOString(),
    };
  }

  // DB 레코드 → LabSummary 변환
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private toSummary(record: any): LabSummary {
    return {
      labId: record.labId,
      labName: record.labName,
      location: record.location,
      labType: record.labType,
      mgmtLevel: record.safetyLevel,
    };
  }
}
