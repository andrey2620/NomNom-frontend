import { inject, Injectable, signal } from "@angular/core";
import { IAllergies, IResponse, ISearch } from "../interfaces";
import { AlertService } from "./alert.service";
import { BaseService } from "./base-service";

@Injectable({
    providedIn: 'root'
})
export class AllergiesService extends BaseService<IAllergies> {
    private allergiesSignal = signal<IAllergies[]>([]);
    public allAllergies: IAllergies[] = [];
    private alertService: AlertService = inject(AlertService);
    protected override source: string = 'allergies';

    public search: ISearch = {
        page: 1,
        size: 18
    };

    public totalItems: number[] = [];

    get allergies$() {

        return this.allergiesSignal;
    }

    getAll() {
        this.findAllWithParams(this.search).subscribe({
            next: (response: IResponse<IAllergies[]>) => {
                this.search = { ...this.search, ...response.meta };
                this.totalItems = Array.from(
                    { length: this.search.totalPages ? this.search.totalPages : 0 },
                    (_, i) => i + 1
                );

                // debugger;
                this.allAllergies = response.data;
                this.allergiesSignal.set(response.data);
            },
            error: (err: any) => {
                console.error('Error al obtener las alergias:', err);
            }
        });
    }

    getByName(name: string, page: number = 1) {
        this.search.page = page;

        this.findAllWithParamsAndCustomSource(`name/${name}`, { page: this.search.page, size: this.search.size }).subscribe({
            next: (response: any) => {
                this.search = { ...this.search, ...response.meta };
                this.totalItems = Array.from({ length: this.search.totalPages ? this.search.totalPages : 0 }, (_, i) => i + 1);
                this.allergiesSignal.set(response.data);
            },
            error: (err: any) => {
                console.error('Error fetching preference by name:', err);
            }
        });
    }

    filterAllergies(criteria: string) {
        const filtered = this.allAllergies.filter(allergy =>
            (allergy.name?.toLowerCase() ?? '').includes(criteria.toLowerCase()) // Previene el error
        );
        this.allergiesSignal.set(filtered);
    }

}
