

export const validateField = (value: string, minLength: number): boolean => {
    return value.length >= minLength;
  };



export const validateUsername = (value: string): boolean => {
    return value.length >= 3;
  };
  
export const validatePassword = (value: string): boolean => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    return passwordRegex.test(value);
  };
  