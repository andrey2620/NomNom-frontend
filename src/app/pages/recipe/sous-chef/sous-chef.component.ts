import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IRecipe, ISuggestions } from '../../../interfaces';
import { RecipesService } from '../../../services/recipes.service';
import { retry, timer } from 'rxjs';

@Component({
  selector: 'app-sous-chef',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sous-chef.component.html',
  styleUrls: ['./sous-chef.component.scss'],
})
export class SousChefComponent {
  @Input() recipe!: IRecipe;


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


    return `${intro} ${ingredientes} ${pasos} ${despedida}`;
  }
}

