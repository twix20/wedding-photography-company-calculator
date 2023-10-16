import { ServiceType } from "../services/types";
import { ServiceDiscount, ServiceDiscountContext } from "./types";

export class PhotographyAndVideoRecordingDiscount implements ServiceDiscount {
  constructor(private discountPrice: number) {}

  appliesToServices(): ServiceType[] {
    return ["Photography", "VideoRecording"] as ServiceType[];
  }

  canApplyDiscount(ctx: ServiceDiscountContext) {
    return (["Photography", "VideoRecording"] as ServiceType[]).every((s) =>
      ctx.selectedServices.includes(s)
    );
  }

  calculateDiscountAmount(ctx: ServiceDiscountContext) {
    const photoPackage = ctx.getPackage("Photography");
    const videoRecording = ctx.getPackage("VideoRecording");

    const discount =
      photoPackage.price + videoRecording.price - this.discountPrice;
    return discount;
  }
}
