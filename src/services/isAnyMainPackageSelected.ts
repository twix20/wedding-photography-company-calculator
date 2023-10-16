import { serviceNamePredicate } from "../utils";
import { servicePackagesProvidedToClients } from "./servicePackages";
import { ServiceType } from "./types";

export const isAnyMainPackageSelected = (
  servicePackages: ServiceType[],
  service: ServiceType
) => {
  const packagesProvidedToClients = servicePackagesProvidedToClients.filter(
    (p) => serviceNamePredicate(p, service)
  );

  const isAnyMainSelected = packagesProvidedToClients.some((p) =>
    p.dependantServices.every((ds) => servicePackages.includes(ds))
  );

  return isAnyMainSelected;
};
