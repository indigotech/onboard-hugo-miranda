import { AppError } from 'src/errors/errors';
import { formatCpf, validateCpf, validateEmail, validatePassword } from 'src/utils';
import { getRepository } from 'typeorm';
import { HashProvider } from '../providers/hash-provider/hash-provider';
import { User } from '../user-entity';

interface UserRegisterParams {
  input: {
    name: string;
    email: string;
    password: string;
    cpf: string;
    birthDate: string;
  };
}

interface UserRegisterResponse {
  user: User;
}

export const register = async (_, { input }: UserRegisterParams, context): Promise<UserRegisterResponse> => {
  if (!context.token) {
    throw new AppError('Unauthorized. Please log in first.', 401, 'Token not provided.');
  }

  const { name, email, cpf, birthDate } = input;

  const hashProvider = new HashProvider();
  const usersRepository = getRepository(User);

  if (!name || !email || !cpf || !birthDate || !input.password) {
    throw new AppError('Register could not be done.', 400, 'Verify if all fields are filled with valid data.');
  }

  if (!validateEmail(email)) {
    throw new AppError('Register could not be done.', 400, 'Verify if email field has a valid format.');
  }

  const emailAlreadyExists = await usersRepository.findOne({ email });

  if (emailAlreadyExists) {
    throw new AppError('Register could not be done.', 401, 'Email already registred.');
  }

  if (!validatePassword(input.password)) {
    throw new AppError(
      'Register could not be done.',
      400,
      'Verify if password field has a valid format. Min 7 characters, 1 letter and 1 number',
    );
  }
  if (!validateCpf(cpf)) {
    throw new AppError('Register could not be done.', 400, 'Verify if cpf field has a valid format.');
  }

  const password = await hashProvider.generate(input.password);
  const formattedCpf = formatCpf(cpf);

  const user = await usersRepository.save({
    birthDate,
    cpf: formattedCpf,
    email,
    name,
    password,
  });

  return { user };
};
