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
  allergies?: IAllergies[];
  preferences?: IDietPreferences[];
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
  createdAt?: string;
  description?: string;
  id?: number;
  name?: string;
  updatedAt?: string;
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


export interface IAllergies {
  id: number;
  name: string;
  isSelected: boolean;
}



export interface IDietPreferences {
  id?: number;
  name?: string;
  isSelected?: boolean;
}

export interface IRecipe {
  id_recipe?: number;
  name: string;
  description: string;
  instructions: string;
  preparationTime: number;
  nutritionalInfo: string;
  image_url?: string;
  recipeCategory: string;
  ingredients: {
    name: string;
    quantity: string;
    measurement: string;
  }[];
  suggestion?: ISuggestions;
}

export interface IIngredients {
  id?: number;
  name?: string;
  description?: string;
  image?: string;
}

export const CATEGORY_IMAGE_MAP: Record<string, string> = {
  comida: 'meal1.png',
  ensalada: 'salads.png',
  jugos: 'juices.png',
  postre: 'sweets.png',
  panes: 'breads.png',
};

export interface ISuggestions {
  ingredientSubstitutions: string[];
  presentationTips: string[];
  kidsParticipation: string[];
}