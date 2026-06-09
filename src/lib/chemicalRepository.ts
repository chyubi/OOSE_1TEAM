import prisma from './prisma';

export interface SearchCondition {
  productName?: string;
  casNo?: string;
  storageLocation?: string;
}

// 오퍼레이션: + save(entity: ChemicalDTO): void
export const save = async (entity: any) => {
  return await prisma.tB_CHEMICAL.create({
    data: {
      CHEMICAL_ID: entity.chemicalId,
      PRODUCT_NAME: entity.productName,
      MANUFACTURER: entity.manufacturer,
      CAS_NO: entity.casNo,
      STORAGE_LOCATION: entity.storageLocation,
      STATUS: entity.status,
    },
  });
};

// 오퍼레이션: + findById(id: String): ChemicalInfo
export const findById = async (id: string) => {
  return await prisma.tB_CHEMICAL.findUnique({
    where: { CHEMICAL_ID: id },
  });
};

// 오퍼레이션: + findByCondition(cond: SearchCondition): List<ChemicalInfo>
export const findByCondition = async (cond: SearchCondition) => {
  return await prisma.tB_CHEMICAL.findMany({
    where: {
      ...(cond.productName && { PRODUCT_NAME: { contains: cond.productName } }),
      ...(cond.casNo && { CAS_NO: { equals: cond.casNo } }),
      ...(cond.storageLocation && { STORAGE_LOCATION: { contains: cond.storageLocation } }),
    },
  });
};