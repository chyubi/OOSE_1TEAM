import { save, findByCondition, SearchCondition } from "./chemicalRepository";
import { prisma } from "./prisma";

export interface ChemicalDTO {
  chemicalId?: string;
  productName: string;
  manufacturer: string;
  casNo: string;
  storageLocation: string;
  status: string;
}

export const validateInput = (dto: ChemicalDTO): boolean => {
  if (
    !dto.productName ||
    !dto.manufacturer ||
    !dto.casNo ||
    !dto.storageLocation
  ) {
    return false;
  }
  return true;
};

export const checkDuplicate = async (casNo: string): Promise<boolean> => {
  const existing = await prisma.tB_CHEMICAL.findFirst({
    where: { casNo: casNo },
  });
  return existing !== null;
};

export const processRegistration = async (dto: ChemicalDTO) => {
  if (!validateInput(dto)) throw new Error("VALIDATION_ERROR");

  const isDuplicated = await checkDuplicate(dto.casNo);
  if (isDuplicated) throw new Error("DUPLICATE_ERROR");

  const chemicalEntity = {
    ...dto,
    chemicalId: `CHEM_${Date.now()}`,
    status: dto.status || "보관중",
  };

  await save(chemicalEntity);
};

export const getChemicalList = async (condition: SearchCondition) => {
  const list = await findByCondition(condition);

  return list.map((item) => ({
    chemicalId: item.chemicalId,
    productName: item.productName,
    manufacturer: item.manufacturer,
    casNo: item.casNo,
    storageLocation: item.storageLocation,
    status: item.status,
  }));
};
