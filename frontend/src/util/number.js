const toFixedDown = (number, precision = 2) => {
  const precisionSafe = precision < 0 ? 0 : precision;
  const regex = new RegExp(`(\\d+\\.\\d{${precisionSafe}})(\\d)`);
  const matched = number.toString().match(regex);
  return matched ? parseFloat(matched[1]) : number.valueOf();
};

const formatBytesToString = (bytes, precision = 2) => {
  if (bytes === 0) return '0 Bytes';
  const precisionSafe = precision < 0 ? 0 : precision;
  const degree = Math.floor(Math.log(bytes) / Math.log(1024));
  const parsedBytes = toFixedDown(
    parseFloat(bytes / 1024 ** degree, precisionSafe),
  );
  const type = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'][
    degree
  ];
  return `${parsedBytes} ${type}`;
};

export { toFixedDown, formatBytesToString };
