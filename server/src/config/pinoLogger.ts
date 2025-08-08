import pino from "pino";

const logger = pino({
  level: "info",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true, // Dodaj boje u izlaz
      translateTime: new Date().toLocaleString(),
      ignore: "pid,hostname", // Ignoriši pid i hostname iz izlaza
    },
  },
});

export default logger;
