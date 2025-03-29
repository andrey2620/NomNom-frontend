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

  public volume: number = 1;
  public rate: number = 0.5;
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
    const intro = `Vamos a preparar .`;
    const ingredientes = `Los ingredientes son:.`;
    const pasos = `Y los pasos son: s`;
    return `${intro} ${ingredientes} ${pasos}`;
  }

  toggleSousChef() {
    console.log("Toggling Sous Chef...");
  }
  
}
