/* Password should containe - 
1. At least 8 characters and up to 16 characters
2. At leaste one number
3. At leaste one special character
4. At leaste one capital letter
*/

export const signUpRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&/]?)[A-Za-z\d@.#$!%*?&/]{8,16}$/
export const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/
export const jwtRegex = /^Bearer\s[A-Za-z0-9-_]+(?:\.[A-Za-z0-9-_]+){2}$/
