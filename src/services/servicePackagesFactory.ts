import { getServicePrice } from "./getServicePrice";
import { servicePackagesProvidedToClients } from "./servicePackages";
import { ServicePackageWithPrice, ServiceYear } from "./types";

export const servicePackagesFactory = (year: ServiceYear) => {
  return servicePackagesProvidedToClients.map(
    (servicePackage) =>
      ({
        dependantServices: [],
        ...servicePackage,
        price: getServicePrice(year, servicePackage.service),
      } as ServicePackageWithPrice)
  );
};
