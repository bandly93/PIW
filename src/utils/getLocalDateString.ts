export const getLocalDateString = (): string => {
  const localeDate = new Date().toLocaleDateString(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const [month, day, year] = localeDate.split('/');

  // Handles formats like MM/DD/YYYY or DD/MM/YYYY depending on user locale
  const isMonthFirst = new Intl.DateTimeFormat().format(new Date(2020, 4, 1)).startsWith('5');

  const formattedDate = isMonthFirst
    ? `${year}-${month}-${day}`
    : `${year}-${day}-${month}`;

  return formattedDate;
};
