// SDD CLS-U-06: UserRepository
// 사용자 정보 영속 데이터 저장·조회 (DB 접근 계층)

import { prisma } from "@/lib/prisma";
import { UserDTO, SearchCondition } from "@/types/user";

export class UserRepository {
  // 사용자 저장 (UC-U01)
  async save(dto: UserDTO): Promise<void> {
    await prisma.uSER_INFO.create({
      data: {
        userId: dto.userId,
        name: dto.name,
        department: dto.department,
        role: dto.role,
        email: dto.email,
        phone: dto.phone ?? null,
        status: "PENDING",
      },
    });
  }

  // 조건 기반 사용자 목록 조회 (UC-U04)
  async findByCondition(condition: SearchCondition): Promise<UserDTO[]> {
    const where: Record<string, unknown> = {};

    if (condition.keyword) {
      where.OR = [
        { name: { contains: condition.keyword, mode: "insensitive" } },
        { userId: { contains: condition.keyword, mode: "insensitive" } },
        { email: { contains: condition.keyword, mode: "insensitive" } },
      ];
    }
    if (condition.role) where.role = condition.role;
    if (condition.department) {
      where.department = {
        contains: condition.department,
        mode: "insensitive",
      };
    }
    if (condition.status) where.status = condition.status;

    const users = await prisma.uSER_INFO.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return users.map((u) => ({
      userId: u.userId,
      name: u.name,
      department: u.department,
      role: u.role as UserDTO["role"],
      email: u.email,
      phone: u.phone ?? undefined,
      status: u.status as UserDTO["status"],
    }));
  }

  // 사용자 ID로 단건 조회 (UC-U05)
  async findById(userId: string): Promise<UserDTO | null> {
    const user = await prisma.uSER_INFO.findUnique({
      where: { userId: userId },
    });
    if (!user) return null;
    return {
      userId: user.userId,
      name: user.name,
      department: user.department,
      role: user.role as UserDTO["role"],
      email: user.email,
      phone: user.phone ?? undefined,
      status: user.status as UserDTO["status"],
    };
  }

  // 사용자 정보 수정 (UC-U03)
  async update(userId: string, data: Partial<UserDTO>): Promise<void> {
    await prisma.uSER_INFO.update({
      where: { userId: userId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.department && { department: data.department }),
        ...(data.role && { role: data.role }),
        ...(data.phone !== undefined && { phone: data.phone ?? null }),
      },
    });
  }

  // 사용자 삭제 (UC-U03)
  async delete(userId: string): Promise<void> {
    await prisma.uSER_INFO.delete({ where: { userId: userId } });
  }

  // 승인 상태 변경 (UC-U02)
  async updateStatus(userId: string, status: string): Promise<void> {
    await prisma.uSER_INFO.update({
      where: { userId: userId },
      data: { status },
    });
  }

  // 이메일 중복 확인
  async existsByEmail(email: string): Promise<boolean> {
    const count = await prisma.uSER_INFO.count({ where: { email } });
    return count > 0;
  }

  // 사용자 ID 존재 확인
  async existsByUserId(userId: string): Promise<boolean> {
    const count = await prisma.uSER_INFO.count({ where: { userId: userId } });
    return count > 0;
  }
}
