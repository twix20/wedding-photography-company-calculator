import { serviceNamePredicate } from "../utils";
import { servicePackagesProvidedToClients } from "./servicePackages";
import { ServiceType } from "./types";

export const isAnyMainPackageSelected = (
  servicePackages: ServiceType[],
  service: ServiceType
) => {
  const packagesProvidedToClients = servicePackagesProvidedToClients.filter(
    (servicePackage) => serviceNamePredicate(servicePackage, service)
  );

  const isAnyMainSelected = packagesProvidedToClients.some((servicePackage) =>
    servicePackage.dependantServices.every((dependantService) =>
      servicePackages.includes(dependantService)
    )
  );

  return isAnyMainSelected;
};
