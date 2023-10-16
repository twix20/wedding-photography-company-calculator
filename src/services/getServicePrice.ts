import { ServiceType, ServiceYear } from "./types";

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
