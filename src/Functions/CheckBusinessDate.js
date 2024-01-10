export function CheckBusinessDatesStatus(createdDate, todayDate) {
  const monthDifference = todayDate - createdDate;

  const oneMonthInMillis = 30 * 24 * 60 * 60 * 1000;

  if (monthDifference > oneMonthInMillis) {
    return true;
  } else {
    return false;
  }
}
