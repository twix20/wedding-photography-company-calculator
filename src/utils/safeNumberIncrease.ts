export const safeNumberIncrease = (
  base: number | undefined,
  increaseBy: number
) => {
  if (base === undefined) return increaseBy;

  return base + increaseBy;
};
