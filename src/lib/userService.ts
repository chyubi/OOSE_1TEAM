// SDD CLS-U-04: UserService
// 업무 규칙, 검증, 권한 처리 (서비스 계층)

import { UserRepository } from "@/lib/userRepository";
import {
  UserDTO,
  RegisterRequestDTO,
  SearchCondition,
  ApiResponse,
} from "@/types/user";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  // UC-U01: 입력값 유효성 검증
  async validateInput(dto: RegisterRequestDTO): Promise<boolean> {
    if (!dto.name || dto.name.trim().length < 2) return false;
    if (!dto.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dto.email))
      return false;
    if (!dto.department || dto.department.trim().length === 0) return false;
    if (!dto.role) return false;
    return true;
  }

  // UC-U01: 사용자 등록 신청
  async registerUser(
    dto: RegisterRequestDTO,
  ): Promise<ApiResponse<{ userId: string }>> {
    const isValid = await this.validateInput(dto);
    if (!isValid) {
      return { success: false, error: "입력값이 올바르지 않습니다." };
    }

    const emailExists = await this.userRepository.existsByEmail(dto.email);
    if (emailExists) {
      return { success: false, error: "이미 등록된 이메일입니다." };
    }

    const prefix =
      dto.role === "ADMIN"
        ? "ADM"
        : dto.role === "LAB_MANAGER"
          ? "LM"
          : dto.role === "SAFETY_MANAGER"
            ? "SM"
            : "RS";
    const userId = `${prefix}-${Date.now()}`;

    const userDTO: UserDTO = {
      userId,
      name: dto.name.trim(),
      department: dto.department.trim(),
      role: dto.role,
      email: dto.email.trim().toLowerCase(),
      phone: dto.phone?.trim() || undefined,
      status: "PENDING",
    };

    await this.userRepository.save(userDTO);
    return {
      success: true,
      data: { userId },
      message: "등록 신청이 완료되었습니다.",
    };
  }

  // UC-U02: 등록 신청 승인/반려
  async processApproval(
    userId: string,
    action: "APPROVE" | "REJECT",
    rejectReason?: string,
  ): Promise<ApiResponse<null>> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      return { success: false, error: "사용자를 찾을 수 없습니다." };
    }
    if (user.status !== "PENDING") {
      return { success: false, error: "이미 처리된 신청입니다." };
    }

    const newStatus = action === "APPROVE" ? "APPROVED" : "REJECTED";
    await this.userRepository.updateStatus(userId, newStatus);

    const message =
      action === "APPROVE"
        ? "승인이 완료되었습니다."
        : `반려되었습니다. 사유: ${rejectReason}`;

    return { success: true, data: null, message };
  }

  // UC-U03: 사용자 정보 수정
  async updateUser(
    userId: string,
    data: Partial<UserDTO>,
  ): Promise<ApiResponse<null>> {
    const exists = await this.userRepository.existsByUserId(userId);
    if (!exists) {
      return { success: false, error: "사용자를 찾을 수 없습니다." };
    }
    await this.userRepository.update(userId, data);
    return {
      success: true,
      data: null,
      message: "사용자 정보가 수정되었습니다.",
    };
  }

  // UC-U03: 사용자 삭제
  async deleteUser(userId: string): Promise<ApiResponse<null>> {
    const exists = await this.userRepository.existsByUserId(userId);
    if (!exists) {
      return { success: false, error: "사용자를 찾을 수 없습니다." };
    }
    await this.userRepository.delete(userId);
    return { success: true, data: null, message: "사용자가 삭제되었습니다." };
  }

  // UC-U04: 사용자 목록 조회
  async findUsers(condition: SearchCondition): Promise<ApiResponse<UserDTO[]>> {
    const users = await this.userRepository.findByCondition(condition);
    return { success: true, data: users };
  }

  // UC-U05: 단건 조회
  async findUserById(userId: string): Promise<ApiResponse<UserDTO>> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      return { success: false, error: "사용자를 찾을 수 없습니다." };
    }
    return { success: true, data: user };
  }
}
