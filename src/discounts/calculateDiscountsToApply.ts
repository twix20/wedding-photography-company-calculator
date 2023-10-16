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
      return servicePackages.find((p) => serviceNamePredicate(p, service));
    },
  };

  const sortedDiscountsByDiscountAmount = discounts
    .filter((d) => d.canApplyDiscount(ctx))
    .map((d) => ({
      discount: d,
      amount: d.calculateDiscountAmount(ctx),
    }))
    .sort((a, b) => b.amount - a.amount);

  const discountsAlreadyAppliedTo = new Set<ServiceType>();
  const discountsToApply = sortedDiscountsByDiscountAmount.reduce((acc, c) => {
    const isAlreadyApplied = c.discount
      .appliesToServices()
      .some((s) => discountsAlreadyAppliedTo.has(s));

    if (!isAlreadyApplied) {
      c.discount
        .appliesToServices()
        .forEach((s) => discountsAlreadyAppliedTo.add(s));

      acc.push(c);
    }

    return acc;
  }, []);

  return discountsToApply;
};
