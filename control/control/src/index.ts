import { Mfc } from "./mfc";
import { logger } from "./logger";

const mfc = new Mfc('COM5');

mfc
  .connect()
  .then(() => {
    logger.silly('nailed it');
    setTimeout(() => {
      mfc.disconnect();
    }, 5000);
  });