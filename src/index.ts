import { calculateDiscountsToApply, discountsFactory } from "./discounts";
import {
  ServiceType,
  ServiceYear,
  countServiceOcurences,
  servicePackagesFactory,
  isAnyMainPackageSelected,
} from "./services";
import { serviceNamePredicate, sumBy } from "./utils";

export const updateSelectedServices = (
  previouslySelectedServices: ServiceType[],
  action: { type: "Select" | "Deselect"; service: ServiceType }
) => {
  const { type, service } = action;

  switch (type) {
    case "Select":
      if (!isAnyMainPackageSelected(previouslySelectedServices, service))
        return previouslySelectedServices;

      return [
        ...previouslySelectedServices.filter((s) => s !== service),
        service,
      ];
    case "Deselect":
      const newState = previouslySelectedServices.filter(
        (s: ServiceType) => s !== service
      );

      const selectedServicesCounter = countServiceOcurences(newState, service);

      return newState.filter((s) => selectedServicesCounter[s] > 0);
    default:
      return previouslySelectedServices;
  }
};

export const calculatePrice = (
  selectedServices: ServiceType[],
  selectedYear: ServiceYear
) => {
  if (selectedServices.length === 0) return { basePrice: 0, finalPrice: 0 };

  const discountsForSelectedYear = discountsFactory(selectedYear);
  const packagesForSelectedYear = servicePackagesFactory(selectedYear);

  const packagesForSelectedServices = selectedServices.map((service) =>
    packagesForSelectedYear.find((p) => serviceNamePredicate(p, service))
  );

  const discountsToApply = calculateDiscountsToApply(
    selectedServices,
    selectedYear,
    discountsForSelectedYear,
    packagesForSelectedYear
  );

  const discountsSum = sumBy(discountsToApply, (p) => p.amount);
  const basePrice = sumBy(packagesForSelectedServices, (p) => p.price);

  return { basePrice, finalPrice: basePrice - discountsSum };
};
