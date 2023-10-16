import { ServiceType, ServiceYear, ServicePackageWithPrice } from "../services";
import { serviceNamePredicate } from "../utils";
import { ServiceDiscount, ServiceDiscountContext } from "./types";

export const calculateDiscountsToApply = (
  selectedServices: ServiceType[],
  selectedYear: ServiceYear,
  discounts: ServiceDiscount[],
  servicePackages: ServicePackageWithPrice[]
) => {
  const ctx: ServiceDiscountContext = {
    selectedServices,
    selectedYear,
    getPackage: (service) => {
      return servicePackages.find((servicePackage) =>
        serviceNamePredicate(servicePackage, service)
      );
    },
  };

  const sortedDiscountsByDiscountAmount = discounts
    .filter((discount) => discount.canApplyDiscount(ctx))
    .map((discount) => ({
      discount,
      amount: discount.calculateDiscountAmount(ctx),
    }))
    .sort((a, b) => b.amount - a.amount);

  const discountsAlreadyAppliedTo = new Set<ServiceType>();
  const discountsToApply = sortedDiscountsByDiscountAmount.reduce((acc, c) => {
    const isAlreadyApplied = c.discount
      .appliesToServices()
      .some((service) => discountsAlreadyAppliedTo.has(service));

    if (isAlreadyApplied) return acc;

    c.discount
      .appliesToServices()
      .forEach((service) => discountsAlreadyAppliedTo.add(service));

    acc.push(c);

    return acc;
  }, []);

  return discountsToApply;
};
