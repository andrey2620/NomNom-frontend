import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResponse } from '../interfaces';

@Injectable({
    providedIn: 'root'
})
export class ShoppingListService {
    private apiUrl = 'http://localhost:8080/shoppingList';

    constructor(private http: HttpClient) { }

    createShoppingList(userId: number, name: string): Observable<any> {
        return this.http.post(`${this.apiUrl}`, {
            userId,
            name
        });
    }

    getShoppingListDetails(listId: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/${listId}`);
    }

    addManualItems(listId: number, items: any[]): Observable<any> {
        return this.http.post(`${this.apiUrl}/${listId}/add-Items`, items);
    }

    downloadPdf(shoppingListId: number): Observable<Blob> {
        return this.http.get(`http://localhost:8080/shoppingList/${shoppingListId}/download`, {
            responseType: 'blob',
            headers: {
                'Accept': 'application/pdf'
            }
        });
    }

    getAllShoppingLists(): Observable<any> {
        return this.http.get(`${this.apiUrl}/all`);
    }

    updateShoppingListName(listId: number, name: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/${listId}/rename`, { name });
    }

    deleteShoppingList(listId: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${listId}`);
    }


}
