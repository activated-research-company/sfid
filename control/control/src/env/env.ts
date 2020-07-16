const env = {
  alicat: {
    baudRate: parseInt(process.env.ALICAT_BAUD_RATE, 10),
    hydrogen: {
      identifier: process.env.ALICAT_HYDROGEN_ID,
    },
    air: {
      identifier: process.env.ALICAT_AIR_ID,
    },
  },
};

export default env;