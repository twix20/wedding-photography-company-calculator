import { getServicePrice } from "./getServicePrice";
import { servicePackages } from "./servicePackages";
import { ServicePackageWithPrice, ServiceYear } from "./types";

export const servicePackagesFactory = (year: ServiceYear) => {
  return servicePackages.map(
    (p) =>
      ({
        dependantServices: [],
        ...p,
        price: getServicePrice(year, p.service),
      } as ServicePackageWithPrice)
  );
};
