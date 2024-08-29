export const formatPercent = (numberToFormat: number): string => {
  return `${(
    numberToFormat / Math.pow(10, 2)
  ).toLocaleString()}%`;
};
