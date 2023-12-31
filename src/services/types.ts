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
