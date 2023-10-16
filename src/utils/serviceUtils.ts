import { ServicePackage, ServiceType } from "../services/types";

export const serviceNamePredicate = (
  servicePackage: ServicePackage,
  serviceName: string | ServiceType
) => servicePackage.service === serviceName;

export const isMainPackageForService = (
  servicePackage: ServicePackage,
  serviceName: ServiceType
) => servicePackage.dependantServices.includes(serviceName);
