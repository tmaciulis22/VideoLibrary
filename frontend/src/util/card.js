export const transformCards = (cards, date) => {
  const transformedVideosInformation = cards.reduce((acc, val) => {
    if (!acc[val[date]]) {
      acc[val[date]] = [];
    }
    acc[val[date]].push(val);
    return acc;
  }, {});
  return { transformedVideosInformation };
};

export const normalizeCards = (transformedVideosInformation) =>
  Object.values(transformedVideosInformation).reduce(
    (acc, val) => acc.concat(val),
    [],
  );

export const sortCardDates = (cards, ascending = true) =>
  Object.keys(cards).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    if (ascending) {
      if (dateA.getTime() < dateB.getTime()) return 1;
      if (dateA.getTime() === dateB.getTime()) return 0;
      return -1;
    }
    if (dateA.getTime() < dateB.getTime()) return -1;
    if (dateA.getTime() === dateB.getTime()) return 0;
    return 1;
  });
