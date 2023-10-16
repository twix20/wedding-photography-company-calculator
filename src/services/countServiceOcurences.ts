import { isMainPackageForService, safeNumberIncrease } from "../utils";
import { servicePackagesProvidedToClients } from "./servicePackages";
import { ServiceType } from "./types";

export const countServiceOcurences = (
  services: ServiceType[],
  service: ServiceType
) => {
  const serviceOcurences = services.reduce((acc, s) => {
    acc[s] = safeNumberIncrease(acc[s], 1);

    servicePackagesProvidedToClients
      .filter((servicePackage) => isMainPackageForService(servicePackage, s))
      .forEach((servicePackage) => {
        acc[servicePackage.service] = safeNumberIncrease(
          acc[servicePackage.service],
          1
        );
      });

    return acc;
  }, {} as Record<ServiceType, number>);

  servicePackagesProvidedToClients
    .filter((servicePackage) =>
      isMainPackageForService(servicePackage, service)
    )
    .forEach((servicePackage) => {
      if (!serviceOcurences[servicePackage.service]) return;

      serviceOcurences[servicePackage.service]--;
    });

  return serviceOcurences;
};
