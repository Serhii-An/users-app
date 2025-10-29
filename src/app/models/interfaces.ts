export interface User {
    firstName: string;
    lastName?: string;
    nickName: string;
    avatar?: File | null;
    phoneNumber?: string;
    email?: string;
    city?: string;
    address?: string;
    id: string
}

export type NewUser = Omit<User, 'id'>;

export interface UserFormValue {
  firstName: string | null;
  lastName: string | null;
  nickName: string | null;
  avatar: File | null;
  phoneNumber: string | null;
  email: string | null;
  city: string | null;
  address: string | null;
  id?: string
}

export interface CitySearchResult {
  success: string,
  error: {
    code: string,
    text: string
  },
  data: CityInSearchResponse[]
}

export interface CityInSearchResponse {
    description: string
  }

export interface registeredUser {
  login: string,
  password: string,
  role: string
}
