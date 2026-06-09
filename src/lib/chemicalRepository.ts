import { prisma } from "./prisma";

export interface SearchCondition {
  productName?: string;
  casNo?: string;
  storageLocation?: string;
}

export const save = async (entity: any) => {
  return await prisma.tB_CHEMICAL.create({
    data: {
      chemicalId: entity.chemicalId,
      productName: entity.productName,
      manufacturer: entity.manufacturer,
      casNo: entity.casNo,
      storageLocation: entity.storageLocation,
      status: entity.status,
    },
  });
};

export const findById = async (id: string) => {
  return await prisma.tB_CHEMICAL.findUnique({
    where: { chemicalId: id },
  });
};

export const findByCondition = async (cond: SearchCondition) => {
  return await prisma.tB_CHEMICAL.findMany({
    where: {
      ...(cond.productName && { productName: { contains: cond.productName } }),
      ...(cond.casNo && { casNo: { equals: cond.casNo } }),
      ...(cond.storageLocation && {
        storageLocation: { contains: cond.storageLocation },
      }),
    },
  });
};
