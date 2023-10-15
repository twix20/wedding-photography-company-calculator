export type ServiceYear = 2020 | 2021 | 2022;
export type ServiceType =
  | "Photography"
  | "VideoRecording"
  | "BlurayPackage"
  | "TwoDayEvent"
  | "WeddingSession";

export interface ServiceDiscountContext {
  selectedServices: ServiceType[];
  selectedYear: ServiceYear;
  //TODO: add packages availiable for this year
}

export interface ServiceDiscount {
  canApplyDiscount: (ctx: ServiceDiscountContext) => boolean;
  calculateDiscount: (ctx: ServiceDiscountContext) => number;
}

export interface ServicePackage {
  price: number;
  service: ServiceType;
  dependantServices?: ServiceType[];
}

const discountsPerYear: Record<ServiceYear, ServiceDiscount[]> = {
  2020: [
    {
      // TODO: create factory?
      // Photography + VideoRecording
      canApplyDiscount: (ctx) => {
        return (["Photography", "VideoRecording"] as ServiceType[]).every((s) =>
          ctx.selectedServices.includes(s)
        );
      },

      calculateDiscount: (ctx) => {
        const photoPackage = findServicePackageIgnoreSelected(
          ctx.selectedYear,
          "Photography"
        );
        const videoRecording = findServicePackageIgnoreSelected(
          ctx.selectedYear,
          "VideoRecording"
        );

        const discount = photoPackage.price + videoRecording.price - 2200; //TODO: price discount per year
        return discount;
      },
    },
    {
      // wedding session costs regularly $600, but in a package with photography during the wedding or with a video recording it costs $300,
      canApplyDiscount: (ctx) => {
        return (
          ctx.selectedServices.includes("WeddingSession") &&
          (ctx.selectedServices.includes("Photography") ||
            ctx.selectedServices.includes("VideoRecording"))
        );
      },

      calculateDiscount: (ctx) => {
        const weddingSessionPackage = findServicePackageIgnoreSelected(
          ctx.selectedYear,
          "WeddingSession"
        );

        const discount = weddingSessionPackage.price - 300; //TODO: price discount per year
        return discount;
      },
    },
    {
      // wedding session is free if the client chooses Photography during the wedding in 2022
      canApplyDiscount: (ctx) => {
        return (
          ctx.selectedServices.includes("WeddingSession") &&
          ctx.selectedServices.includes("Photography") &&
          ctx.selectedYear === 2022
        );
      },

      calculateDiscount: (ctx) => {
        const weddingSessionPackage = findServicePackageIgnoreSelected(
          ctx.selectedYear,
          "WeddingSession"
        );

        const discount = weddingSessionPackage.price; //TODO: price discount per year
        return discount;
      },
    },
  ],
  2021: [],
  2022: [],
};

const servicePackagesPerYear: Record<ServiceYear, ServicePackage[]> = {
  2020: [
    {
      service: "Photography",
      price: 1700,
      dependantServices: [],
    },
    {
      service: "VideoRecording",
      price: 1700,
      dependantServices: [],
    },
    {
      service: "WeddingSession",
      price: 600,
      dependantServices: [],
    },
    {
      service: "TwoDayEvent",
      dependantServices: ["VideoRecording"],
      price: 400,
    },
    {
      service: "TwoDayEvent",
      dependantServices: ["Photography"],
      price: 400,
    },
    {
      service: "BlurayPackage",
      dependantServices: ["VideoRecording"],
      price: 300,
    },
  ],
  2021: [],
  2022: [],
};

const findServicePackageIgnoreSelected = (
  year: ServiceYear,
  service: ServiceType
) => {
  return servicePackagesPerYear[year].find((p) => {
    return service === p.service;
  });
};

const findServicePackage = (
  year: ServiceYear,
  services: ServiceType[],
  service: ServiceType
) => {
  return servicePackagesPerYear[year].find((p) => {
    const areAllDependantServicesSelected =
      p.dependantServices?.every((ds) => services.includes(ds)) ?? true;
    return areAllDependantServicesSelected && service === p.service;
  });
};

export const updateSelectedServices = (
  previouslySelectedServices: ServiceType[],
  action: { type: "Select" | "Deselect"; service: ServiceType }
) => {
  // TODO: refactor
  const { type, service } = action;

  const servicePackages = servicePackagesPerYear[2020].filter(
    (p) => p.service === service
  );

  switch (type) {
    case "Select":
      const isAnyMainPackageSelected = servicePackages.some((p) =>
        p.dependantServices.every((ds) =>
          previouslySelectedServices.includes(ds)
        )
      );

      if (!isAnyMainPackageSelected) return previouslySelectedServices;

      return [
        ...previouslySelectedServices.filter((s) => s !== service),
        service,
      ];
    case "Deselect":
      const newState = previouslySelectedServices.filter(
        (s: ServiceType) => s !== service
      );

      const smartCounter = newState.reduce((acc, s) => {
        acc[s] = acc[s] ?? 0;
        acc[s]++;

        const pcks = servicePackagesPerYear[2020].filter((p) =>
          p.dependantServices.includes(s)
        );

        pcks.forEach((p) => {
          acc[p.service] = acc[p.service] ?? 0;

          acc[p.service]++;
        });

        return acc;
      }, {} as Record<ServiceType, number>);

      const pcks22 = servicePackagesPerYear[2020].filter((p) =>
        p.dependantServices.includes(service)
      );

      pcks22.forEach((servicePackage) => {
        if (smartCounter[servicePackage.service]) {
          smartCounter[servicePackage.service]--;
        }
      });

      return newState.filter((s) => smartCounter[s] > 0);
    default:
      return previouslySelectedServices;
  }
};

export const calculatePrice = (
  selectedServices: ServiceType[],
  selectedYear: ServiceYear
) => {
  if (selectedServices.length === 0) return { basePrice: 0, finalPrice: 0 };

  const packages = selectedServices
    .map((service) =>
      findServicePackage(selectedYear, selectedServices, service)
    )
    .filter(Boolean);

  const ctx: ServiceDiscountContext = {
    selectedServices: selectedServices,
    selectedYear: selectedYear,
  };

  const allDiscounts = discountsPerYear[selectedYear].filter((d) =>
    d.canApplyDiscount(ctx)
  );
  const allDiscountPrices = [
    0,
    ...allDiscounts.map((d) => d.calculateDiscount(ctx)),
  ];

  const sumDiscounts = allDiscountPrices.reduce(
    (partialSum, p) => partialSum + p,
    0
  );
  //   const maximumDiscount: number = Math.max.apply(Math, allDiscountPrices);

  const basePrice = packages.reduce((partialSum, p) => partialSum + p.price, 0);

  return { basePrice, finalPrice: basePrice - sumDiscounts };
};
