import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { LoaderComponent } from "../../components/loader/loader.component";
import { MapComponent } from "../../components/map/map.component";
import { IRecipe } from "../../interfaces";
import { MapRecipeViewComponent } from "../../components/map-recipeView/map-recipeView.component";

@Component({
    standalone: true,
    selector: 'app-interactive-map',
    templateUrl: './interactiveMap.component.html',
    styleUrls: ['./interactiveMap.component.scss'],
    imports: [
        CommonModule,
        LoaderComponent,
        MapComponent,
        MapRecipeViewComponent
    ]
})


export class InteractiveMapComponent {
    selectedRecipe: IRecipe | null = null;
    countrySelected: string = '';

    onCountrySelected(country: string) {
        this.countrySelected = country;
    }

    onRecipeSelected(recipe: IRecipe) {
        this.selectedRecipe = recipe;
        localStorage.setItem('mapRecipe', JSON.stringify(this.selectedRecipe));
        window.location.href = "/app/recipes";
    }
}