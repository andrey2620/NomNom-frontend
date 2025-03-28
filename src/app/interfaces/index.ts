export interface ILoginResponse {
  token: string;
  authUser: IUser;
  expiresIn: number;
}

export interface IGoogleLoginResponse {
  accessToken: string;
  authUser: IUser;
  exists: boolean;
}

export interface IResponse<T> {
  data: T;
  message: string;
  meta: T;
}

export interface IUser {
  id?: number;
  name?: string;
  lastname?: string;
  email?: string;
  password?: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
  authorities?: IAuthority[];
  role?: IRole;
  picture?: string;
}

export interface IAuthority {
  authority: string;
}

export interface IFeedBackMessage {
  type?: IFeedbackStatus;
  message?: string;
}

export enum IFeedbackStatus {
  success = 'SUCCESS',
  error = 'ERROR',
  default = '',
}

export enum IRoleType {
  user = 'ROLE_USER',
  superAdmin = 'ROLE_SUPER_ADMIN',
}

export interface IRole {
  createdAt: string;
  description: string;
  id: number;
  name: string;
  updatedAt: string;
}

export interface IGame {
  id?: number;
  name?: string;
  imgURL?: string;
  status?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IOrder {
  id?: number;
  description?: string;
  total?: number;
}

export interface ISearch {
  page?: number;
  size?: number;
  pageNumber?: number;
  pageSize?: number;
  totalElements?: number;
  totalPages?: number;
}

export interface IMovie {
  id?: number;
  title?: string;
  director?: string;
  description?: string;
}

export interface IPreferenceList {
  id?: number;
  name?: string;
  movies?: IMovie[];
}

export interface IRecipe {
  id_recipe?: number;
  name?: string;
  description?: string;
  instructions?: string;
  preparation_time?: number;
  nutritional_info?: string;
  image_url?: string;
}
