export function calculateAge(birthdate) {
  const currentDate = new Date();

  const birthdateDate = new Date(birthdate);

  const timeDifference = currentDate - birthdateDate;

  const ageInMilliseconds = timeDifference;

  const millisecondsInYear = 1000 * 60 * 60 * 24 * 365.25;
  const ageInYears = ageInMilliseconds / millisecondsInYear;

  const age = Math.floor(ageInYears);

  return age;
}

export function calculateBirthdate(birthdate) {
  const bdate = new Date(birthdate);
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = `${bdate.toLocaleDateString(undefined, options)}`;

  return formattedDate;
}

export function computerRemain(totalAmout, capital) {
  return capital - totalAmout;
}

export function calculateTotalAccumalatedAmount(installment) {
  const accumalted = installment.reduce(
    (sum, item) => sum + parseFloat(item.invest_amount),
    0
  );

  return accumalted;
}

export function checkUseFundsCompletion(filterUseFunds) {
  const allAreTrue = filterUseFunds.every(
    (item) =>
      item.bussFunds_reciept && item.bussFunds_reciept_status === "approved"
  );
  console.log(allAreTrue);

  return allAreTrue;
}
