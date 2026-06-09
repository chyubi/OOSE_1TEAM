import { save, findByCondition, SearchCondition } from './chemicalRepository';
import prisma from './prisma';

export interface ChemicalDTO {
  chemicalId?: string;
  productName: string;
  manufacturer: string;
  casNo: string;
  storageLocation: string;
  status: string;
}

// + validateInput(dto: ChemicalDTO): Boolean
export const validateInput = (dto: ChemicalDTO): boolean => {
  if (!dto.productName || !dto.manufacturer || !dto.casNo || !dto.storageLocation) {
    return false;
  }
  return true;
};

// + checkDuplicate(casNo: String): Boolean
export const checkDuplicate = async (casNo: string): Promise<boolean> => {
  const existing = await prisma.tB_CHEMICAL.findUnique({ where: { CAS_NO: casNo } });
  return existing !== null;
};

// 등록 흐름 제어 로직
export const processRegistration = async (dto: ChemicalDTO) => {
  if (!validateInput(dto)) throw new Error('VALIDATION_ERROR');
  
  const isDuplicated = await checkDuplicate(dto.casNo);
  if (isDuplicated) throw new Error('DUPLICATE_ERROR');

  const chemicalEntity = {
    ...dto,
    chemicalId: `CHEM_${Date.now()}`,
    status: dto.status || '보관중', 
  };

  await save(chemicalEntity);
};

// + getChemicalList(condition: SearchCondition): List<ChemicalDTO>
export const getChemicalList = async (condition: SearchCondition) => {
  const list = await findByCondition(condition);
  
  return list.map(item => ({
    chemicalId: item.CHEMICAL_ID,
    productName: item.PRODUCT_NAME,
    manufacturer: item.MANUFACTURER,
    casNo: item.CAS_NO,
    storageLocation: item.STORAGE_LOCATION,
    status: item.STATUS,
  }));
};