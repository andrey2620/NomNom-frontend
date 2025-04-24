import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ShoppingListService {
    private apiUrl = 'http://localhost:8080/shoppingList';

    constructor(private http: HttpClient) { }

    createShoppingList(userId: number, name: string): Observable<any> {
        const body = {
            userId,
            name
        };
        return this.http.post(`${this.apiUrl}`, body);
    }
}
