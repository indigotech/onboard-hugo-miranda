import { AppError } from 'src/errors/errors';
import { getRepository } from 'typeorm';
import { User } from '../user-entity';

interface UserSearchParams {
  input: {
    id: number;
  };
}

interface UserSearchResponse {
  user: User;
}

export const search = async (_, { input }: UserSearchParams): Promise<UserSearchResponse> => {
  const { id } = input;

  const usersRepository = getRepository(User);

  const user = await usersRepository.findOne(id);

  if (!user) {
    throw new AppError('Cannot find this user', 400, `User ${id} could not be found.`);
  }

  return { user };
};
