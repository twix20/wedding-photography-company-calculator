import {
  ServiceType,
  ServiceYear,
  ServicePackageWithPrice,
} from "../services/types";

export interface ServiceDiscountContext {
  selectedServices: ServiceType[];
  selectedYear: ServiceYear;
  getPackage: (service: ServiceType) => ServicePackageWithPrice;
}

export interface ServiceDiscount {
  appliesToServices(): ServiceType[];
  canApplyDiscount(ctx: ServiceDiscountContext): boolean;
  calculateDiscountAmount(ctx: ServiceDiscountContext): number;
}
