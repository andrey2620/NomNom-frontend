import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { LoaderComponent } from "../../components/loader/loader.component";
import { MapComponent } from "../../components/map/map.component";

@Component({
    standalone: true,
    selector: 'app-interactiveMap',
    templateUrl: './interactiveMap.component.html',
    styleUrls: ['./interactiveMap.component.scss'],
    imports: [
        LoaderComponent,
        MapComponent,
    ]
})

export class InteractiveMapComponent {

    
}