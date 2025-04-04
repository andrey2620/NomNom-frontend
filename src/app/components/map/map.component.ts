import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, EventEmitter, Output, ViewEncapsulation } from "@angular/core";
import * as statesData from '../../../assets/geoJSON/us-states.json';
import * as L from 'leaflet';
import { IRecipe } from "../../interfaces";

@Component({
    selector: 'app-map',
    standalone: true,
    imports: [
        CommonModule,
    ],
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class MapComponent implements AfterViewInit {

    private map!: L.Map;
    private info!: L.Control;
    private geojson!: L.GeoJSON;

    @Output() recipesSelected = new EventEmitter<IRecipe[]>();

    ngAfterViewInit(): void {
        this.map = L.map('map', {
            center: [37.8, -96], // Centered on the US
            zoom: 2,
            maxBounds: [
                [85, -180], // Northeast corner
                [-85, 180]  // Southwest corner
            ],
            maxBoundsViscosity: 1.0 // Makes the map "bounce" back when panned outside
        }).setView([37.8, -96], 2); // Centered on the US

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 7,
            minZoom: 2,
            noWrap: true
        }).addTo(this.map);

        // Control that shows state info on hover
        this.info = new L.Control({ position: 'topright' }) as L.Control;

        this.info.onAdd = () => {
            const div = L.DomUtil.create('div', 'info') as HTMLDivElement;
            div.classList.add('info'); //nt
            return div;
        };

        this.info.addTo(this.map);

        // GeoJSON with styles and interactivity
        this.geojson = L.geoJSON(statesData as unknown as GeoJSON.FeatureCollection, {
            style: (feature: any) => this.styleFeature(feature),
            onEachFeature: this.onEachFeature.bind(this)
        }).addTo(this.map);

        // Add legend to the map
         this.addLegend();
    }

    private getColor(d: number): string {
        return d > 700 ? '#4B0016' :
       d > 600 ? '#800026' :
       d > 500 ? '#BD0026' :
       d > 400 ? '#E31A1C' :
       d > 300 ? '#FC4E2A' :
       d > 200 ? '#FD8D3C' :
       d > 100 ? '#FEB24C' : '#FFEDA0';

    }

    private styleFeature(feature: any): L.PathOptions {
        return {
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7,
            fillColor: this.getColor(feature.properties.density)
        };
    }

    private highlightFeature = (e: L.LeafletEvent) => {
        const layer = e.target as L.Path;
        layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
        });
        layer.bringToFront();
        this.updateInfo((layer as any).feature.properties);
    };

    private resetHighlight = (e: L.LeafletEvent) => {
        this.geojson.resetStyle(e.target as L.Path);
        this.updateInfo();
    };

    private zoomToFeature = (e: L.LeafletEvent) => {
        this.map.fitBounds((e.target as L.FeatureGroup).getBounds());
    };

    private onEachFeature(_: any, layer: L.Layer) {
        layer.on({
            mouseover: this.highlightFeature,
            mouseout: this.resetHighlight,
            click: this.zoomToFeature
        });
    }

    private updateInfo(props?: any): void {
        const div = document.querySelector('.info') as HTMLDivElement;
        if (div) {
            let content = 'Haz click en tu país:';
            
            if(props && !props?.recipes){
                content = `<b>${props.name}</b><br/> <ul> No hay recetas disponibles para este país. </ul>`;
                this.recipesSelected.emit([]);
            }

            if (props && props.recipes) {                
                const recipesList = Object.entries(props.recipes)
                    .map(([key, recipe]: [string, any]) => ({
                        name: recipe.name,
                        description: recipe.description,
                        image_url: recipe.image_url,
                    }));
                
                /*this.recipesSelected.emit(recipesList);
                content = `<b>${props.name}</b><br /><ul>${recipesList
                    .map(recipe => `<li><b>${recipe.name}</b></li>`)
                    .join('')}</ul>`;*/
            }

            /*if (props && props.recipes) {                
                const recipesList = Object.entries(props.recipes)
                    .map(([key, recipe]: [string, any]) => ({
                        name: recipe.name,
                        description: recipe.description,
                    }));
                
                this.recipesSelected.emit(recipesList);
                content = `<b>${props.name}</b><br /><ul>${recipesList
                    .map(recipe => `<li><b>${recipe.name}</b>: ${recipe.description}</li>`)
                    .join('')}</ul>`;
            }*/
    
            div.innerHTML = `<h3>Recetas de todo el mundo!</h3>${content}`;
        }
    }
    

    private addLegend() {
        const legend = new L.Control({ position: 'bottomright' });

        legend.onAdd = () => {
            const div = L.DomUtil.create('div', 'info legend');
            const grades = [100, 200, 300, 400, 500, 600, 700];
            const labels = [];

            for (let i = 0; i < grades.length; i++) {
                const from = grades[i];
                const to = grades[i + 1];
                labels.push(`<i style="background:${this.getColor(from)}"></i> ${from}${to ? "" : '+'}`);
            }

            div.innerHTML = labels.join('<br>');
            return div;
        };

        legend.addTo(this.map);
    }
}
