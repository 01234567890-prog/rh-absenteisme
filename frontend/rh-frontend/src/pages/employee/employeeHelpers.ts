import type { UserResponseDto } from '../../types/api';

export const findCurrentEmployee = (users: UserResponseDto[]): UserResponseDto | undefined => {
  const email = localStorage.getItem('email');
  if (!email) return undefined;
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
};