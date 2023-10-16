import { ServicePackage } from "../services";

export const serviceNamePredicate = (
  servicePackage: ServicePackage,
  serviceName: string
) => servicePackage.service === serviceName;
