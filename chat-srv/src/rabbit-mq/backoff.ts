export const backoffFunc = async <T>(
  func: Function,
  currentTry: number,
  maxTries: number,
  delay: number
): Promise<T> => {
  console.log(`trying to connect to rabbitMQ ... try number  ${currentTry}`);
  try {
    return await func();
  } catch (err) {
    if (currentTry < maxTries) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      return backoffFunc(func, currentTry + 1, maxTries, delay * maxTries);
    } else {
      throw new Error(err + "");
    }
  }
};
