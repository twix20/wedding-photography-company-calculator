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

  const discountsAlreadyAppliedTo = [];

  const allDiscountsToApply = discounts
    .filter((d) => d.canApplyDiscount(ctx))
    .map((d) => ({
      discount: d,
      amount: d.calculateDiscountAmount(ctx),
    }))
    .sort((a, b) => b.amount - a.amount);

  const x = allDiscountsToApply.reduce((acc, c) => {
    const isAlreadyApplied = c.discount
      .appliesToServices()
      .some((s) => discountsAlreadyAppliedTo.includes(s));

    if (!isAlreadyApplied) {
      discountsAlreadyAppliedTo.push(...c.discount.appliesToServices());

      acc.push(c);
    }

    return acc;
  }, []);

  return x;
};
