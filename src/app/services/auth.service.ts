import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ILoginResponse, IUser, IAuthority, IRoleType } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private accessToken!: string;
  private expiresIn!: number;
  private user: IUser = { email: '', authorities: [] };
  private http: HttpClient = inject(HttpClient);

  constructor() {
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

  public getUser(): IUser | undefined {
    return this.user;
  }

  public getAccessToken(): string | null {
    return this.accessToken;
  }

  public check(): boolean {
    return !!this.accessToken;
  }

  public login(credentials: { email: string; password: string }): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>('http://localhost:8080/auth/login', credentials).pipe(
      tap((response: ILoginResponse) => {
        if (!response.token) {
          console.error("No token received from backend", response);
          return;
        }
        console.log("Traditional login successful:", response.token);

        this.accessToken = response.token;
        this.user = response.authUser;
        this.expiresIn = response.expiresIn;
        this.save();
      })
    );
  }
  public hasRole(role: string): boolean {
    return this.user.authorities ? this.user?.authorities.some(authority => authority.authority == role) : false;
  }

  public isSuperAdmin(): boolean {
    return this.user.authorities ? this.user?.authorities.some(authority => authority.authority == IRoleType.superAdmin) : false;
  }

  public getUserAuthorities(): IAuthority[] | undefined {
    return this.getUser()?.authorities ? this.getUser()?.authorities : [];
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

    if (userAuthorities?.some(item => item.authority == IRoleType.admin || item.authority == IRoleType.superAdmin)) {
      isAdmin = true;
    }

    return allowedUser && isAdmin;
  }

  public getPermittedRoutes(routes: any[]): any[] {
    let permittedRoutes: any[] = [];
    for (const route of routes) {
      if (route.data && route.data.authorities) {
        if (this.hasRole(route.data.authorities)) {
          permittedRoutes.unshift(route);
        }
      }
    }
    return permittedRoutes;
  }

  public signup(user: IUser): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>('auth/signup', user);
  }

  public profile(): IUser | undefined {
    return this.user;
  }


  public logout(): void {
    this.accessToken = '';
    localStorage.removeItem('access_token');
    localStorage.removeItem('expiresIn');
    localStorage.removeItem('auth_user');
  }
}
