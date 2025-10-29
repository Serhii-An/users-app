import { User } from "../../models/interfaces";

export interface UsersState {
 allUsers: User[];
}

export const initialUsersState: UsersState = {
  allUsers: [],
};
