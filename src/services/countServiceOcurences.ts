import { isMainPackageForService, safeNumberIncrese } from "../utils";
import { servicePackagesProvidedToClients } from "./servicePackages";
import { ServiceType } from "./types";

export const countServiceOcurences = (
  services: ServiceType[],
  service: ServiceType
) => {
  const serviceOcurences = services.reduce((acc, s) => {
    acc[s] = safeNumberIncrese(acc[s], 1);

    servicePackagesProvidedToClients
      .filter((p) => isMainPackageForService(p, s))
      .forEach((p) => {
        acc[p.service] = safeNumberIncrese(acc[p.service], 1);
      });

    return acc;
  }, {} as Record<ServiceType, number>);

  servicePackagesProvidedToClients
    .filter((p) => isMainPackageForService(p, service))
    .forEach((p) => {
      if (!serviceOcurences[p.service]) return;

      serviceOcurences[p.service]--;
    });

  return serviceOcurences;
};