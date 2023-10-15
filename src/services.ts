export type ServiceYear = 2020 | 2021 | 2022;

export type ServiceType =
  | "Photography"
  | "VideoRecording"
  | "BlurayPackage"
  | "TwoDayEvent"
  | "WeddingSession";

export interface ServicePackage {
  service: ServiceType;
  dependantServices: ServiceType[];
}

export interface ServicePackageWithPrice extends ServicePackage {
  price: number;
}

export const servicePackages: ServicePackage[] = [
  {
    service: "Photography",
    dependantServices: [],
  },
  {
    service: "VideoRecording",
    dependantServices: [],
  },
  {
    service: "WeddingSession",
    dependantServices: [],
  },
  {
    service: "TwoDayEvent",
    dependantServices: ["VideoRecording"],
  },
  {
    service: "TwoDayEvent",
    dependantServices: ["Photography"],
  },
  {
    service: "BlurayPackage",
    dependantServices: ["VideoRecording"],
  },
];

export const getServicePrice = (year: ServiceYear, service: ServiceType) => {
  if (year < 2020 || year > 2022)
    throw new Error(`Year ${year} is not supported`);

  switch (service) {
    case "Photography":
      if (year === 2020) return 1700;
      if (year === 2021) return 1800;
      if (year === 2022) return 1900;
    case "VideoRecording":
      if (year === 2020) return 1700;
      if (year === 2021) return 1800;
      if (year === 2022) return 1900;
    case "BlurayPackage":
      return 300;
    case "TwoDayEvent":
      return 400;
    case "WeddingSession":
      return 600;

    default:
      throw new Error("Unknown service name");
  }
};

export const createServicePackagesForYear = (year: ServiceYear) => {
  return servicePackages.map(
    (p) =>
      ({
        dependantServices: [],
        ...p,
        price: getServicePrice(year, p.service),
      } as ServicePackageWithPrice)
  );
};
