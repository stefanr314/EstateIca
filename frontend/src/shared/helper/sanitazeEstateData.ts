function sanitizeEstateData<T extends Record<string, any>>(data: T): T {
  const parsed: Record<string, any> = {};

  for (const [key, value] of Object.entries(data)) {
    if (value === "" || value === null) {
      parsed[key] = undefined;
      continue;
    }

    // Pretvaramo brojeve
    if (
      typeof value === "string" &&
      !isNaN(Number(value)) &&
      value.trim() !== ""
    ) {
      parsed[key] = Number(value);
      continue;
    }

    parsed[key] = value;
  }

  return parsed as T;
}

export { sanitizeEstateData };
