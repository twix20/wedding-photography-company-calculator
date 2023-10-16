import { getServicePrice } from "./getServicePrice";
import { servicePackagesProvidedToClients } from "./servicePackages";
import { ServicePackageWithPrice, ServiceYear } from "./types";

export const servicePackagesFactory = (year: ServiceYear) => {
  return servicePackagesProvidedToClients.map(
    (p) =>
      ({
        dependantServices: [],
        ...p,
        price: getServicePrice(year, p.service),
      } as ServicePackageWithPrice)
  );
};
