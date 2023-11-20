export function UpdateInstallments(todayDate, installments) {
  const listStartDate = [];
  const listEndDate = [];
  const initailDate = new Date(todayDate);
  const startDate = new Date(initailDate.setMonth(new Date().getMonth() + 1));

  for (let i = 0; i < installments.length; i++) {
    const nextStartDate = new Date(startDate);
    nextStartDate.setMonth(startDate.getMonth() + i);
    listStartDate.push(nextStartDate);

    const nextEndDate = new Date(nextStartDate);
    nextEndDate.setMonth(nextStartDate.getMonth() + 1);
    nextEndDate.setDate(nextStartDate.getDate() - 1);
    listEndDate.push(nextEndDate);
  }
  // console.log(listStartDate);
  // console.log(listEndDate);

  const updateReturnsWithDate = installments.map((item, index) => ({
    ...item,
    mindate: `${listStartDate[index].toDateString()} `,
    maxdate: `${listEndDate[index].toDateString()}`,
  }));

  return updateReturnsWithDate;
}
