import { ServiceType, ServiceYear, ServicePackageWithPrice } from "./services";

export interface ServiceDiscount {
  appliesToServices: () => ServiceType[];
  canApplyDiscount: (ctx: ServiceDiscountContext) => boolean;
  calculateDiscountAmount: (ctx: ServiceDiscountContext) => number;
}

export interface ServiceDiscountContext {
  selectedServices: ServiceType[];
  selectedYear: ServiceYear;
  availablePackages: ServicePackageWithPrice[];

  getPackage: (service: ServiceType) => ServicePackageWithPrice;
}

export type ServiceDiscountFactory = (discountPrice: number) => ServiceDiscount;

export const photographyAndVideoRecordingDiscount: ServiceDiscountFactory = (
  discountPrice
) => ({
  appliesToServices: () => ["Photography", "VideoRecording"],
  canApplyDiscount: (ctx) => {
    return (["Photography", "VideoRecording"] as ServiceType[]).every((s) =>
      ctx.selectedServices.includes(s)
    );
  },

  calculateDiscountAmount: (ctx) => {
    const photoPackage = ctx.getPackage("Photography");
    const videoRecording = ctx.getPackage("VideoRecording");

    const discount = photoPackage.price + videoRecording.price - discountPrice;
    return discount;
  },
});

export const weddingSessionBundleWithPhotographyOrVideoRecordingDiscount: ServiceDiscountFactory =
  (discountPrice: number) => ({
    appliesToServices: () => ["WeddingSession"],
    canApplyDiscount: (ctx) => {
      return (
        ctx.selectedServices.includes("WeddingSession") &&
        (ctx.selectedServices.includes("Photography") ||
          ctx.selectedServices.includes("VideoRecording"))
      );
    },

    calculateDiscountAmount: (ctx) => {
      const weddingSessionPackage = ctx.getPackage("WeddingSession");

      const discount = weddingSessionPackage.price - discountPrice;
      return discount;
    },
  });

export const weddingSessionIsFreeWithPhotographyIn2022Discount: ServiceDiscountFactory =
  (discountPrice: number) => ({
    // wedding session is free if the client chooses Photography during the wedding in 2022
    appliesToServices: () => ["WeddingSession"],
    canApplyDiscount: (ctx) => {
      return (
        ctx.selectedYear === 2022 &&
        ctx.selectedServices.includes("WeddingSession") &&
        ctx.selectedServices.includes("Photography")
      );
    },

    calculateDiscountAmount: (ctx) => {
      const weddingSessionPackage = ctx.getPackage("WeddingSession");

      const discount = weddingSessionPackage.price;
      return discount;
    },
  });

export const createDiscountsForYear = (year: ServiceYear) => {
  if (year === 2020)
    return [
      photographyAndVideoRecordingDiscount(2200),
      weddingSessionBundleWithPhotographyOrVideoRecordingDiscount(300),
    ];
  if (year === 2021)
    return [
      photographyAndVideoRecordingDiscount(2300),
      weddingSessionBundleWithPhotographyOrVideoRecordingDiscount(300),
    ];
  if (year === 2022)
    return [
      photographyAndVideoRecordingDiscount(2500),
      weddingSessionBundleWithPhotographyOrVideoRecordingDiscount(300),
      weddingSessionIsFreeWithPhotographyIn2022Discount(0),
    ];
};
