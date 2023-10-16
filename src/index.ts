import { calculateDiscountsToApply, discountsFactory } from "./discounts";
import {
  ServiceType,
  ServiceYear,
  servicePackagesFactory,
  servicePackagesProvidedToClients,
} from "./services";
import { isMainPackageForService, serviceNamePredicate, sumBy } from "./utils";

export const updateSelectedServices = (
  previouslySelectedServices: ServiceType[],
  action: { type: "Select" | "Deselect"; service: ServiceType }
) => {
  const { type, service } = action;

  const packagesProvidedToClients = servicePackagesProvidedToClients.filter(
    (p) => serviceNamePredicate(p, service)
  );

  switch (type) {
    case "Select":
      const isAnyMainPackageSelected = packagesProvidedToClients.some((p) =>
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

      const selectedServicesCounter = newState.reduce((acc, s) => {
        acc[s] = s in acc ? ++acc[s] : 1;

        servicePackagesProvidedToClients
          .filter((p) => isMainPackageForService(p, s))
          .forEach((p) => {
            acc[p.service] = p.service in acc ? ++acc[p.service] : 1;
          });

        return acc;
      }, {} as Record<ServiceType, number>);

      servicePackagesProvidedToClients
        .filter((p) => isMainPackageForService(p, service))
        .forEach((p) => {
          if (!selectedServicesCounter[p.service]) return;

          selectedServicesCounter[p.service]--;
        });

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
