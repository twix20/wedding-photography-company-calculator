export const sumBy = <T>(arr: T[], selector: (arg0: T) => number) =>
  arr.reduce((acc, c) => acc + selector(c), 0);
