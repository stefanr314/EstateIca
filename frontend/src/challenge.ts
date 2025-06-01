const url: string = "http://localhost:3030/tours";

import z from "zod"; //za provjeravanje tokom run time ne samo tokom build time

const tourSchema = z.object({
  id: z.string(),
  name: z.string(),
  info: z.string(),
  image: z.string(),
  price: z.string(),
});

type Tour = z.infer<typeof tourSchema>;

async function fetchTours(url: string): Promise<Array<Tour>> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Ne postoji ta stranica");
    }

    const rawData: Tour[] = await response.json();
    console.log(rawData);
    const result = tourSchema.array().safeParse(rawData); // ovako provjeravas da li si dobio odgovor u skladu sa tvojom semom

    if (!result.success) {
      throw new Error(`Invalid type: ${result.error}`);
    }

    return result.data;
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : "Neka luda greska";
    console.log(errorMsg);
    return [];
  }
}

const tours = await fetchTours(url);
console.log(tours);
