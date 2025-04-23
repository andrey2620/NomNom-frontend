import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IRecipe, ISuggestions } from '../../../interfaces';
import { RecipesService } from '../../../services/recipes.service';
import { retry, timer } from 'rxjs';
import { SousChefService } from '../../../services/sous-chef.service';

@Component({
  selector: 'app-sous-chef',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sous-chef.component.html',
  styleUrls: ['./sous-chef.component.scss'],
})
export class SousChefComponent implements OnInit {
  @Input() recipe!: IRecipe;

  constructor(
    private recipesService: RecipesService,
    private sousChefService: SousChefService
  ) {}

  public volume = 0.5;
  public rate = 1;
  public isSpeaking = false;
  public isSousChefOn = false;
  public currentVoiceName: 'daniela' | 'mauricio' = 'daniela';
  public selectedVoice: SpeechSynthesisVoice | null = null;
  public audioInstance: HTMLAudioElement | null = null;

  public suggestions: ISuggestions = {
    ingredientSubstitutions: [],
    presentationTips: [],
    kidsParticipation: [],
  };

  ngOnInit(): void {
    speechSynthesis.onvoiceschanged = () => this.setDefaultVoice();
    this.setDefaultVoice();
  }

  private setDefaultVoice() {
    const voices = speechSynthesis.getVoices();
    this.selectedVoice =
      voices.find(v => v.lang === 'es-ES' && v.name.includes('Google')) ||
      voices.find(v => v.lang.startsWith('es')) ||
      voices[0] || null;
  }

  speak() {
    if (!this.recipe) return;

    const texto = this.buildText();
    this.isSpeaking = true;

    this.sousChefService.getAudio(texto, this.currentVoiceName).subscribe({
      next: (audioBlob: Blob) => {
        const audioUrl = URL.createObjectURL(audioBlob);
        this.audioInstance = new Audio(audioUrl);
        this.audioInstance.volume = this.volume;
        this.audioInstance.play();

        this.audioInstance.onended = () => {
          this.isSpeaking = false;
          this.audioInstance = null;
        };
      },
      error: async err => {
        console.warn('ElevenLabs falló, usando voz del navegador.');

        if (this.currentVoiceName === 'daniela') {
          console.warn('Cambiando a voz de Mauricio por fallback.');
          this.currentVoiceName = 'mauricio';
        }

        if (err.error instanceof Blob) {
          const errorText = await err.error.text();
          console.error('Detalle del error 500:', errorText);
        } else {
          console.error('Error no esperado:', err);
        }

        // Fallback: voz del navegador
        console.warn('Cambiando a voz de Google como Back up.');
        const utterance = new SpeechSynthesisUtterance();
        utterance.text = texto;
        utterance.volume = this.volume;
        utterance.rate = this.rate;
        utterance.lang = 'es-ES';

        if (this.selectedVoice) {
          utterance.voice = this.selectedVoice;
        }

        speechSynthesis.speak(utterance);
        utterance.onend = () => {
          this.isSpeaking = false;
        };
      },
    });
  }

  stop() {
    if (this.audioInstance) {
      this.audioInstance.pause();
      this.audioInstance.currentTime = 0;
      this.audioInstance = null;
    }

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

  toggleVoiceGender(): void {
    this.stop();
    this.currentVoiceName =
      this.currentVoiceName === 'daniela' ? 'mauricio' : 'daniela';
  }

  suggestPresentation(): void {
    if (!this.recipe) return;

    this.recipesService
      .generateSuggestions(this.recipe)
      .pipe(
        retry({
          count: 10,
          delay: (_, retryCount) => timer(2000),
        })
      )
      .subscribe({
        next: res => {
          this.suggestions = res.data || {
            ingredientSubstitutions: [],
            presentationTips: [],
            kidsParticipation: [],
          };
        },
        error: err => {
          console.error('Error al generar sugerencias:', err);
        },
      });
  }

  private buildText(): string {
    const intro = `¡Bienvenido a la NomNomcocina! ... ¿Tienes tu delantal listo? Yo soy tu Sous Chef, Hoy tenemos una receta que te va a encantar. Vamos a preparar: ${this.recipe.name}. ¡Va a ser riquísimo!`;
    const ingredientes = `Para empezar, vamos a necesitar estos ingredientes: ${this.recipe.instructions}. ¿Estás listo?`;
    const pasos = `Ahora, atención, porque vamos a hacer los pasos uno por uno: ${this.recipe.instructions}. ¡Buen trabajo, chef!`;
    const despedida = `Eso fue todo por hoy. ¡Nos vemos en la próxima receta!`;

    return `${intro} ${ingredientes} ${pasos} ${despedida}`;
  }
}
