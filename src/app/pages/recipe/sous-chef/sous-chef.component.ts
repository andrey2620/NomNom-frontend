import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IRecipe } from '../../../interfaces';

@Component({
  selector: 'app-sous-chef',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './sous-chef.component.html',
  styleUrls: ['./sous-chef.component.scss']
})
export class SousChefComponent {
  @Input() recipe!: IRecipe;

  public volume: number = 0.5;
  public rate: number = 1;
  public isSpeaking: boolean = false;

  speak() {
    if (!this.recipe) return;

    const utterance = new SpeechSynthesisUtterance();
    utterance.text = this.buildText();
    utterance.volume = this.volume;
    utterance.rate = this.rate;
    utterance.lang = 'es-ES';

    speechSynthesis.speak(utterance);
    this.isSpeaking = true;

    utterance.onend = () => {
      this.isSpeaking = false;
    };
  }

  stop() {
    speechSynthesis.cancel();
    this.isSpeaking = false;
  }

  private buildText(): string {
    const intro = `Hola... Soy el sous chef de NomNom. Estoy en periodo de prueba y`;
    const ingredientes = `Aun no puedo ayudarte a cocinar, lo siento.`;
    const pasos = `Vuelve pronto`;
    const sugerencias = `Aun no tengo sugerencias por compartir.`;
    return `${intro} ${ingredientes} ${pasos}`;
  }

  public isSousChefOn: boolean = false;

  toggleSousChef() {
    this.isSousChefOn = !this.isSousChefOn;
  
    if (this.isSousChefOn) {
      this.speak(); //aun me falta poner el text to speack
    } else {
      this.stop(); 
    }
  }
  
}
