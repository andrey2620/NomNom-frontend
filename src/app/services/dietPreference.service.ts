import { inject, Injectable, signal } from "@angular/core";
import { IDietPreferences, IResponse, ISearch } from "../interfaces";
import { AlertService } from "./alert.service";
import { BaseService } from "./base-service";

@Injectable({
    providedIn: 'root'
})
export class DietPreferenceService extends BaseService<IDietPreferences> {
    private dietPreferencesSignal = signal<IDietPreferences[]>([]);
    public allDietPreferences: IDietPreferences[] = [];
    private alertService: AlertService = inject(AlertService);
    protected override source: string = 'diet_preferences';

    public search: ISearch = {
        page: 1,
        size: 100
    };

    public totalItems: number[] = [];

    get dietPreferences$() {

        return this.dietPreferencesSignal;
    }

    getAll() {
        this.findAllWithParams(this.search).subscribe({
            next: (response: IResponse<IDietPreferences[]>) => {
                this.search = { ...this.search, ...response.meta };
                this.totalItems = Array.from(
                    { length: this.search.totalPages ? this.search.totalPages : 0 },
                    (_, i) => i + 1
                );
                this.allDietPreferences = response.data;
                this.dietPreferencesSignal.set(response.data);
            },
            error: (err: any) => {
                console.error('Error al obtener las preferencias dietéticas:', err);
            }
        });
    }

    getByName(name: string, page: number = 1) {
        this.search.page = page;

        this.findAllWithParamsAndCustomSource(`name/${name}`, { page: this.search.page, size: this.search.size }).subscribe({
            next: (response: any) => {
                this.search = { ...this.search, ...response.meta };
                this.totalItems = Array.from({ length: this.search.totalPages ? this.search.totalPages : 0 }, (_, i) => i + 1);
                this.dietPreferencesSignal.set(response.data);
            },
            error: (err: any) => {
                console.error('Error fetching preference by name:', err);
            }
        });
    }

    filterDietPreferences(criteria: string) {
        const filtered = this.allDietPreferences.filter(preference =>
            (preference.name?.toLowerCase() ?? '').includes(criteria.toLowerCase()) // Previene el error
        );
        this.dietPreferencesSignal.set(filtered);
    }

}
