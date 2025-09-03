export type RatingFields = {
  overall: number;
  cleanliness: number;
  amenities: number;
  host: number;
  location: number;
};

export function generateMongoAverageRatingUpdate(
  currentField: string, // npr. "averageRating"
  countField: string, // npr. "reviewsCount"
  newRating: RatingFields
) {
  const setObj: Record<string, any> = {};

  //castovanje jer ne moze direktno raditi sa Object.keys koje vraca niz stringova
  (Object.keys(newRating) as (keyof RatingFields)[]).forEach((key) => {
    //formula je oblika (stariAvg*brojrecenzija + noviAvg) / (brojrecenzija + 1)
    setObj[`${currentField}.${key}`] = {
      $divide: [
        {
          $add: [
            { $multiply: [`$${currentField}.${key}`, `$${countField}`] },
            newRating[key],
          ],
        },
        { $add: [`$${countField}`, 1] },
      ],
    };
  });

  // reviewsCount se povećava +1
  setObj[countField] = { $add: [`$${countField}`, 1] };

  return { $set: setObj };
}

export function generateMongoAverageRatingUpdateForUpdate(
  currentField: string, // npr. "averageRating"
  countField: string, // npr. "reviewsCount"
  oldRating: RatingFields,
  newRating: RatingFields
) {
  const setObj: Record<string, any> = {};

  (Object.keys(newRating) as (keyof RatingFields)[]).forEach((key) => {
    //formula je oblika (stariAvg*brojrecenzija + (noviAvg - stariAvg)) / brojrecenzija
    setObj[`${currentField}.${key}`] = {
      $divide: [
        {
          $add: [
            { $multiply: [`$${currentField}.${key}`, `$${countField}`] },
            newRating[key] - oldRating[key], // razlika unutar Node-a
          ],
        },
        `$${countField}`,
      ],
    };
  });

  return { $set: setObj };
}
