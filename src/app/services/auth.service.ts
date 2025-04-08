import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, switchMap, tap, map } from 'rxjs';
import { ILoginResponse, IUser, IAuthority, IRoleType, IResponse } from '../interfaces';
import { IngredientService } from './ingredient.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private accessToken!: string;
  private expiresIn!: number;
  private user: IUser = { email: '', authorities: [] };

  constructor(
    private http: HttpClient,
    private ingredientService: IngredientService
  ) {
    this.load();
  }

  private save(): void {
    if (this.user) localStorage.setItem('auth_user', JSON.stringify(this.user));
    if (this.accessToken) localStorage.setItem('access_token', this.accessToken);
    if (this.expiresIn) localStorage.setItem('expiresIn', this.expiresIn.toString());
  }

  private load(): void {
    const token = localStorage.getItem('access_token');
    if (token) this.accessToken = token;
    const exp = localStorage.getItem('expiresIn');
    if (exp) this.expiresIn = Number(exp);
    const user = localStorage.getItem('auth_user');
    if (user) this.user = JSON.parse(user);
  }

  public getUser(): IUser {
    return this.user;
  }

  public getAccessToken(): string | null {
    return this.accessToken;
  }

  public check(): boolean {
    return !!this.accessToken;
  }

  public login(credentials: { email: string; password: string }): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>('auth/login', credentials).pipe(
      tap((response: ILoginResponse) => {
        if (!response.authUser) {
          console.error('Error: No se encontró información del usuario.');
          return;
        }

        this.accessToken = response.token;
        this.user = response.authUser;
        this.expiresIn = response.expiresIn;

        this.user.picture = response.authUser.picture || 'assets/default-avatar.png';

        this.save();
      })
    );
  }

  public initializeUserSession(authUser: IUser, token: string, expiresIn = 3600000000): Observable<void> {
    this.user = authUser;
    this.accessToken = token;
    this.expiresIn = expiresIn;

    this.save();

    const userId = authUser.id!;
    return this.ingredientService.getFormattedIngredientsByUser(userId).pipe(
      tap((ingredientsRes: IResponse<string[]>) => {
        localStorage.setItem('user_ingredients', JSON.stringify(ingredientsRes.data));
      }),
      map(() => {})
    );
  }

  public setAuthData(authUser: IUser, token: string, exists: boolean): void {
    this.user = authUser;
    this.accessToken = token;
    this.expiresIn = 3600000000;

    this.save();
  }

  public isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  public hasRole(role: string): boolean {
    const user = this.getUser();
    if (!user || !user.authorities) return false;
    return user.authorities.some(authority => authority.authority === role);
  }

  public isSuperAdmin(): boolean {
    return this.user.authorities
      ? this.user?.authorities.some(authority => authority.authority == IRoleType.superAdmin)
      : false;
  }

  public getUserAuthorities(): IAuthority[] | undefined {
    return this.getUser()?.authorities ?? [];
  }

  public areActionsAvailable(routeAuthorities: string[]): boolean {
    let allowedUser = false;
    let isAdmin = false;
    let userAuthorities = this.getUserAuthorities();

    for (const authority of routeAuthorities) {
      if (userAuthorities?.some(item => item.authority == authority)) {
        allowedUser = true;
        break;
      }
    }

    if (userAuthorities?.some(item => item.authority == IRoleType.superAdmin)) {
      isAdmin = true;
    }

    return !!allowedUser && !!isAdmin;
  }


  public getPermittedRoutes(routes: any[]): any[] {
    return routes.filter(route =>
      route.data && route.data.authorities && this.hasRole(route.data.authorities)
    );
  }

  public signup(user: IUser): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>('auth/signup', user);
  }

  public profile(): IUser | undefined {
    return this.user;
  }

  public logout(): void {
    this.accessToken = '';
    sessionStorage.clear();
    localStorage.clear();
  }

  public sendResetLink(email: string): Observable<IResponse<any>> {
    return this.http.post<IResponse<any>>(`auth/forgot-password?email=${encodeURIComponent(email)}`, {});
  }

  public resetPassword(token: string, newPassword: string): Observable<IResponse<any>> {
    const params = new HttpParams().set('token', token);
    return this.http.post<IResponse<any>>('auth/reset-password', newPassword, { params });
  }

  public getCurrentUserId(): number | null {
    const userJson = localStorage.getItem('auth_user');
    if (!userJson) return null;
    try {
      const user = JSON.parse(userJson);
      return user?.id ?? null;
    } catch (e) {
      console.error('Error parsing auth_user from localStorage:', e);
      return null;
    }
  }
}
