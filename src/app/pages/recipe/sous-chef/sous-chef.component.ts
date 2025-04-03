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
  public isSousChefOn: boolean = false;
  public selectedVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    speechSynthesis.onvoiceschanged = () => {
      const voices = speechSynthesis.getVoices();
      this.selectedVoice = voices.find(v => v.lang === 'es-ES' && v.name.includes('Google español')) ||
      voices.find(v => v.lang.startsWith('es')) ||
      null;
      console.log('Voz seleccionada:', this.selectedVoice?.name);
    };
  }

  speak() {
    if (!this.recipe) return;

    const utterance = new SpeechSynthesisUtterance();
    utterance.text = this.buildText();
    utterance.volume = this.volume;
    utterance.rate = this.rate;
    utterance.lang = 'es-ES';

    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }

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

  toggleSousChef() {
    this.isSousChefOn = !this.isSousChefOn;

    if (this.isSousChefOn) {
      this.speak();
    } else {
      this.stop();
    }
  }

  private buildText(): string {
    const intro = `¡Bienvenido a la NomNomcocina! ... ¿Tienes tu delantal listo? Yo soy tu Sous Chef, Hoy tenemos una receta que te va a encantar. Vamos a preparar: ${this.recipe.name}. ¡Va a ser riquísimo!`;
  
    const ingredientes = `Para empezar, vamos a necesitar estos ingredientes: ${this.recipe.instructions}. ¿Estás listo?`;
  
    const pasos = `Ahora, atención, porque vamos a hacer los pasos uno por uno: ${this.recipe.instructions}. ¡Buen trabajo, chef!`;
  
    const despedida = `Eso fue todo por hoy. ¡Nos vemos en la próxima receta!`;
  
    return `${intro} ${ingredientes} ${pasos} ${despedida}`;
  }
}

