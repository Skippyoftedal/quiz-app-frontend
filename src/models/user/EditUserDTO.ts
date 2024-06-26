/**
 * Data Transfer Object for editing user data.
 */
export type EditUserDTO = {
  newPassword: string | null;
  newEmail: string | null;
  newName: string | null;
  newSurname: string | null;
};
