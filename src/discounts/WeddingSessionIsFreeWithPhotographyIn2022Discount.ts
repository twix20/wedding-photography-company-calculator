import { ServiceType } from "../services/types";
import { ServiceDiscount, ServiceDiscountContext } from "./types";

export class WeddingSessionIsFreeWithPhotographyIn2022Discount
  implements ServiceDiscount
{
  appliesToServices() {
    return ["WeddingSession"] as ServiceType[];
  }

  canApplyDiscount(ctx: ServiceDiscountContext) {
    return (
      ctx.selectedYear === 2022 &&
      ctx.selectedServices.includes("WeddingSession") &&
      ctx.selectedServices.includes("Photography")
    );
  }

  calculateDiscountAmount(ctx: ServiceDiscountContext) {
    const weddingSessionPackage = ctx.getPackage("WeddingSession");

    const discount = weddingSessionPackage.price;
    return discount;
  }
}
