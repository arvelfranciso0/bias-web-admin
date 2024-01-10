export function PaypalResponseCode(code) {
  switch (code) {
    case 200:
      return true;
    case 201:
      return true;
    case 400:
      return false;
    case 404:
      return false;
    case 405:
      return false;
    default:
      return "Invalid";
  }
}

export function PaypalResponseCodeMassage(code) {
  switch (code) {
    case 200:
      return "Succeeded";
    case 201:
      return "Succeeded";
    case 400:
      return "INVALID_REQUEST";
    case 404:
      return "RESOURCE_NOT_FOUND";
    case 405:
      return "METHOD_NOT_SUPPORTED";
    default:
      return "Invalid";
  }
}
