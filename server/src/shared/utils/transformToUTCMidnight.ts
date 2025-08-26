function utcMidnight(date: Date): Date {
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
}
export { utcMidnight };
