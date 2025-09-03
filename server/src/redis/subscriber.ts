import { estateSubscriber } from "./subscribers/estate.sub";

import { reservationSubscriber } from "./subscribers/reservation.sub";

export function initSubscribers() {
  estateSubscriber();
  reservationSubscriber();
}
