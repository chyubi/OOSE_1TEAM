export type WasteRequestStatus = "PENDING" | "PROCESSING" | "COMPLETED";

export interface WasteRequestDTO {
  requestId?: string;
  labId: string;
  requesterId: string;
  wasteType: string;
  quantity: number;
  unit: string;
  status?: WasteRequestStatus;
  requestedAt?: string;
  processedAt?: string | null;
}

export interface WasteSearchCondition {
  labId?: string;
  wasteType?: string;
  status?: WasteRequestStatus | "";
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
