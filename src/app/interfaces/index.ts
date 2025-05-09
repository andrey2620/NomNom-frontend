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
export interface IResponsev2<T> {
  data: T;
  message: string;
  meta: {
    method: string;
    url: string;
    totalPages?: number;
    totalElements?: number;
    pageNumber?: number;
    pageSize?: number;
    [key: string]: unknown;
  };
}

export interface IUser {
  id?: number | string;
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
  recipes?: IRecipe[];
  menus?: IMenu[];
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
  id?: any;
  data?: any;
  id_recipe?: number;
  name: string;
  description?: string; // ← este
  instructions: string;
  preparationTime: number;
  nutritionalInfo?: string; // ← este
  image_url?: string;
  recipeCategory: string;
  ingredients: IIngredient[];
  suggestion?: ISuggestions;
  country?: string;
}

export interface IIngredient {
  name: string;
  quantity: string;
  measurement?: string;
}

export interface IIngredients {
  id?: number;
  name?: string;
  description?: string;
  image?: string;
}

export interface IMenu {
  id: number;
  name: string;
  items: IMenuItem[];
}

export interface IMenuItem {
  id: number;
  recipe: IRecipe;
  mealType: 'BREAKFAST' | 'LUNCH' | 'SNACK' | 'DINNER';
  dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
}

export interface IMenuCreateDTO {
  name: string;
  userId: number;
  items: {
    recipeId: number;
    mealType: string;
    dayOfWeek: string;
  }[];
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
