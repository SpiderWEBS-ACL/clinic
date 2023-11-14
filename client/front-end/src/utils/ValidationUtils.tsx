export const validateField = (value: string, minLength: number): boolean => {
  return value.length >= minLength;
};

export const validateUsername = (value: string): boolean => {
  if (value == "") return true;
  return value.length >= 3;
};

export const validatePassword = (value: string): boolean => {
  if (value == "") return true;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
  return passwordRegex.test(value);
};

export const validateMobile = (value: number | undefined): boolean => {
  if (value != undefined && value.toString() != "") {
    const mobileRegex = /^([+]\d{1})?\d{11}$/;
    return mobileRegex.test(value.toString());
  }
  return true;
};
