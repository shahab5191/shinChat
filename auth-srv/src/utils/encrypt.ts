import bcrypt from "bcrypt";

export const hashPassword = async (
  password: string,
  salt?: string
) => {
  if(salt === undefined){
    salt = await bcrypt.genSalt();
  }
  const hashed = await bcrypt.hash(password, salt);
  return { hashed, salt };
};
