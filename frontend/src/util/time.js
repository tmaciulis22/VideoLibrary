const secondsToHms = (seconds) => {
  const SECONDS_PER_DAY = 86400;
  const HOURS_PER_DAY = 24;

  const days = Math.floor(seconds / SECONDS_PER_DAY);
  const remainderSeconds = seconds % SECONDS_PER_DAY;
  const hms = new Date(remainderSeconds * 1000).toISOString().substring(11, 19);
  return hms.replace(/^(\d+)/, (h) =>
    `${Number(h) + days * HOURS_PER_DAY}`.padStart(2, '0'),
  );
};

/* eslint-disable import/prefer-default-export */
export { secondsToHms };
