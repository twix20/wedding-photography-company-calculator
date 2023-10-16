import { ServiceType } from "../services/types";
import { ServiceDiscount, ServiceDiscountContext } from "./types";

export class WeddingSessionBundleWithPhotographyOrVideoRecordingDiscount
  implements ServiceDiscount
{
  constructor(private discountPrice: number) {}

  appliesToServices(): ServiceType[] {
    return ["WeddingSession"];
  }

  canApplyDiscount(ctx: ServiceDiscountContext) {
    return (
      ctx.selectedServices.includes("WeddingSession") &&
      (ctx.selectedServices.includes("Photography") ||
        ctx.selectedServices.includes("VideoRecording"))
    );
  }

  calculateDiscountAmount(ctx: ServiceDiscountContext) {
    const weddingSessionPackage = ctx.getPackage("WeddingSession");

    const discount = weddingSessionPackage.price - this.discountPrice;
    return discount;
  }
}
