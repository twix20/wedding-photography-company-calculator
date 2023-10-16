import { ServiceDiscountContext, discountsFactory } from "./discounts";
import {
  ServiceType,
  ServiceYear,
  servicePackagesFactory,
  servicePackages as allKnownServicePackages,
} from "./services";
import { serviceNamePredicate } from "./utils";

export const updateSelectedServices = (
  previouslySelectedServices: ServiceType[],
  action: { type: "Select" | "Deselect"; service: ServiceType }
) => {
  // TODO: refactor
  const { type, service } = action;

  const servicePackages = allKnownServicePackages.filter((p) =>
    serviceNamePredicate(p, service)
  );

  switch (type) {
    case "Select":
      const isAnyMainPackageSelected = servicePackages.some((p) =>
        p.dependantServices.every((ds) =>
          previouslySelectedServices.includes(ds)
        )
      );

      if (!isAnyMainPackageSelected) return previouslySelectedServices;

      return [
        ...previouslySelectedServices.filter((s) => s !== service),
        service,
      ];
    case "Deselect":
      const newState = previouslySelectedServices.filter(
        (s: ServiceType) => s !== service
      );

      const smartCounter = newState.reduce((acc, s) => {
        acc[s] = acc[s] ?? 0;
        acc[s]++;

        const pcks = allKnownServicePackages.filter((p) =>
          p.dependantServices.includes(s)
        );

        pcks.forEach((p) => {
          acc[p.service] = acc[p.service] ?? 0;

          acc[p.service]++;
        });

        return acc;
      }, {} as Record<ServiceType, number>);

      const pcks22 = allKnownServicePackages.filter((p) =>
        p.dependantServices.includes(service)
      );

      pcks22.forEach((servicePackage) => {
        if (smartCounter[servicePackage.service]) {
          smartCounter[servicePackage.service]--;
        }
      });

      return newState.filter((s) => smartCounter[s] > 0);
    default:
      return previouslySelectedServices;
  }
};

export const calculatePrice = (
  selectedServices: ServiceType[],
  selectedYear: ServiceYear
) => {
  if (selectedServices.length === 0) return { basePrice: 0, finalPrice: 0 };

  const discounts = discountsFactory(selectedYear);
  const availablePackages = servicePackagesFactory(selectedYear);

  const ctx: ServiceDiscountContext = {
    selectedServices: selectedServices,
    selectedYear: selectedYear,
    availablePackages: availablePackages,

    getPackage: (service) => {
      return availablePackages.find((p) => serviceNamePredicate(p, service));
    },
  };

  const packagesForSelectedServices = selectedServices.map((service) =>
    availablePackages.find((p) => {
      const areAllDependantServicesSelected =
        p.dependantServices?.every((ds) => selectedServices.includes(ds)) ??
        true;
      return (
        areAllDependantServicesSelected && serviceNamePredicate(p, service)
      );
    })
  );

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

  const sumDiscounts = x.reduce((partialSum, p) => partialSum + p.amount, 0);

  const basePrice = packagesForSelectedServices.reduce(
    (partialSum, p) => partialSum + p.price,
    0
  );

  return { basePrice, finalPrice: basePrice - sumDiscounts };
};
