import bcrypt from 'bcrypt';


const saltRounds = 10;

export const generateHashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, saltRounds);
};

export const compareHashPassword = (password: string, hash: string): boolean => {
  return bcrypt.compare(password, hash);
};
