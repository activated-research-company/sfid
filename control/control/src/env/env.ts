import path from "path";

if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line global-require, import/no-extraneous-dependencies
  const dotenv = require('dotenv');
  dotenv.config({ path: path.join(process.cwd(), '..', '..', '.env') });
  dotenv.config();
}

const replaceSpecialChars = (expression: string): string => {
  return   expression
    .replace('{cr}', '\r')
    .replace('{lf}', '\n');
}

if (!process.env.LOG_LEVEL) { throw new Error('log level not configured'); }
if (!process.env.MFC_BAUD_RATE) { throw new Error('mfc baud rate not configured'); }
if (!process.env.MFC_DELIMITER) { throw new Error('mcf delimiter not configured'); }
if (!process.env.MFC_PROBE) { throw new Error('mfc probe not configured'); }
if (!process.env.MFC_HYDROGEN_ID) { throw new Error('mfc hydrogen id not configured'); }
if (!process.env.MFC_AIR_ID) { throw new Error('mfc air id not configured'); }
if (!process.env.FID_BAUD_RATE) { throw new Error('fid baud rate not configured'); }
if (!process.env.FID_DELIMITER) { throw new Error('fid delimiter not configured'); }
if (!process.env.FID_PROBE) { throw new Error('fid probe not configured'); }

const env = {
  log: {
    level: parseInt(process.env.LOG_LEVEL),
  },
  flowController: {
    baudRate: parseInt(process.env.MFC_BAUD_RATE, 10),
    delimiter: replaceSpecialChars(process.env.MFC_DELIMITER),
    probe: process.env.MFC_PROBE,
    hydrogen: {
      identifier: process.env.MFC_HYDROGEN_ID,
    },
    air: {
      identifier: process.env.MFC_AIR_ID,
    },
  },
  fid: {
    baudRate: parseInt(process.env.FID_BAUD_RATE, 10),
    delimiter: replaceSpecialChars(process.env.FID_DELIMITER),
    probe: process.env.FID_PROBE,
  },
};

export default env;
