export type WasteRequestStatus =
  | "REQUESTED"
  | "RECEIVED"
  | "PROCESSING"
  | "COMPLETED";

export interface WasteRequestDTO {
  requestId?: string;
  laboratoryId: string;
  wasteType: string;
  emissionAmount: string;
  emissionDate: string;
  storageLocation: string;
  requestReason?: string;
  requestStatus?: WasteRequestStatus;
  requestDatetime?: string;
}

export interface WasteSearchCondition {
  laboratoryId?: string;
  wasteType?: string;
  requestStatus?: WasteRequestStatus | "";
  searchFromDate?: string;
  searchToDate?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
