import { randomBytes, randomInt } from "crypto";

export const createUser = () => {
  let randomEmail = `${randomText(5)}@${randomText(5)}.com`;
  let randomPass = `${randomText(5)}#${randomNum(5)}`;
  return { email: randomEmail, password: randomPass };
};

const randomText = (size: number) => {
  let text = "";
  for (let i = 0; i < size; i++) {
    let rand;
    rand = i % 2 === 0 ? randomInt(65, 90) : randomInt(97, 122);
    text += String.fromCharCode(rand);
  }
  return text;
};

const randomNum = (size: number) => {
  let num = "";
  for (let i = 0; i < size; i++) {
    num += randomInt(9);
  }
  return parseInt(num);
};
