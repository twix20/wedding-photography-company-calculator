import { ServiceYear } from "../services/types";
import { PhotographyAndVideoRecordingDiscount } from "./PhotographyAndVideoRecordingDiscount";
import { WeddingSessionBundleWithPhotographyOrVideoRecordingDiscount } from "./WeddingSessionBundleWithPhotographyOrVideoRecordingDiscount";
import { WeddingSessionIsFreeWithPhotographyIn2022Discount } from "./WeddingSessionIsFreeWithPhotographyIn2022Discount";

export const discountsFactory = (year: ServiceYear) => {
  switch (year) {
    case 2020:
      return [
        new PhotographyAndVideoRecordingDiscount(2200),
        new WeddingSessionBundleWithPhotographyOrVideoRecordingDiscount(300),
      ];
    case 2021:
      return [
        new PhotographyAndVideoRecordingDiscount(2300),
        new WeddingSessionBundleWithPhotographyOrVideoRecordingDiscount(300),
      ];
    case 2022:
      return [
        new PhotographyAndVideoRecordingDiscount(2500),
        new WeddingSessionBundleWithPhotographyOrVideoRecordingDiscount(300),
        new WeddingSessionIsFreeWithPhotographyIn2022Discount(),
      ];
    default:
      throw new Error("Unsupported year");
  }
};
