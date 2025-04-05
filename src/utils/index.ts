export function validateEmail(email: string) {
  const re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
}

export function isPasswordMatch(password: string) {
  /**
   * o Minimum length of 8 characters.
     o At least one letter.
     o At least one number.
     o At least one special character.
   */
  const re = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
  return re.test(password);
}
