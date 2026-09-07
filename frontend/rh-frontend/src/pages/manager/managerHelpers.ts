import type { UserResponseDto } from '../../types/api';

export const findCurrentManager = (users: UserResponseDto[]): UserResponseDto | undefined => {
  const email = localStorage.getItem('email');
  if (!email) return undefined;
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
};

export const getTeamMembers = (users: UserResponseDto[], managerId?: number): UserResponseDto[] => {
  if (!managerId) return [];
  return users.filter((u) => u.managerId === managerId);
};