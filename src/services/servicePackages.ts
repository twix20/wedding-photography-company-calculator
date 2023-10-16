import { ServicePackage } from "./types";

export const servicePackagesProvidedToClients: ServicePackage[] = [
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
