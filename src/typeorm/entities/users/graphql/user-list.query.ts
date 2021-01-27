import { AppError } from 'src/errors/errors';
import { getRepository } from 'typeorm';
import { User } from '../user-entity';

interface UserListParams {
  input: {
    limit: number;
    page: number;
  };
}

interface UserListResponse {
  info: {
    pages: number;
    page: number;
    limit: number;
  };
  users: User[];
}

export const list = async (_, { input }: UserListParams, context): Promise<UserListResponse> => {
  if (!context.token) {
    throw new AppError('Unauthorized. Please log in first.', 401, 'Token not provided.');
  }
  let { limit, page } = input;

  const usersRepository = getRepository(User);

  const usersCount = await usersRepository.count();

  limit = limit || 20;
  const pages = Math.ceil(usersCount / limit);
  page = page || 1;

  if (page > pages) {
    throw new AppError('Cannot find this page.', 404, `Page ${page} exceeds the page limit (${pages}).`);
  }
  if (page < 0) {
    throw new AppError('Cannot find this page.', 400, `Page cannot be negative.`);
  }

  const users = await usersRepository.find({
    take: limit,
    skip: limit * (page - 1),
    order: { name: 'ASC' },
  });

  if (!users) {
    throw new AppError('Cannot find users', 404, `Users could not be found.`);
  }

  const info = {
    limit,
    pages,
    page,
  };

  return { info, users };
};
