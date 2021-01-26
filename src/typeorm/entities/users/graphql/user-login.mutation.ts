import { AppError } from 'src/errors/errors';
import { validateEmail } from 'src/utils';
import { getRepository } from 'typeorm';
import { HashProvider } from '../providers/hash-provider/hash-provider';
import { JWTProvider } from '../providers/jwt-provider/jwt-provider';
import { User } from '../user-entity';

interface UserLoginParams {
  input: {
    email: string;
    password: string;
    rememberMe: boolean;
  };
}

interface UserLoginResponse {
  token: string;
  user: User;
  rememberMe: boolean;
}

export const login = async (_, { input }: UserLoginParams): Promise<UserLoginResponse> => {
  const hashProvider = new HashProvider();
  const jwtProvider = new JWTProvider();
  const { email, password, rememberMe = false } = input;
  const usersRepository = getRepository(User);

  if (!email || !password) {
    throw new AppError('Unauthorized. Possible invalid credentials.', 401, 'Email or Password is null.');
  }

  if (email && !validateEmail(email)) {
    throw new AppError('Unauthorized. Possible invalid credentials.', 401, 'Invalid email format.');
  }

  const user = await usersRepository.findOne({ email });

  if (!user) {
    throw new AppError('Unauthorized. Possible invalid credentials.', 401, 'User not found.');
  }

  const passswordMatch = await hashProvider.verify(password, user.password);

  if (!passswordMatch) {
    throw new AppError('Unauthorized. Possible invalid credentials.', 401, 'Password does not match.');
  }

  const token = jwtProvider.sign({ payload: { userId: user.id }, rememberMe });

  return { user, token, rememberMe };
};
