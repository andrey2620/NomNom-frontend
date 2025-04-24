import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IRecipe, ISuggestions } from '../../../interfaces';
import { RecipesService } from '../../../services/recipes.service';
import { retry, timer } from 'rxjs';
import { SousChefService } from '../../../services/sous-chef.service';
import { UserService } from '../../../services/user.service';
import { ToastService } from '../../../services/toast.service';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sous-chef',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sous-chef.component.html',
  styleUrls: ['./sous-chef.component.scss'],
})
export class SousChefComponent implements OnInit, OnDestroy {
  @Output() save = new EventEmitter<void>();
  @Input() recipe!: IRecipe;

  public volume = 0.5;
  public rate = 1;
  public isSpeaking = false;
  public isSousChefOn = false;
  public isCreatingAudio = false;

  public currentVoiceName: 'daniela' | 'mauricio' = 'daniela';
  public selectedVoice: SpeechSynthesisVoice | null = null;
  public audioInstance: HTMLAudioElement | null = null;

  public suggestions: ISuggestions = {
    ingredientSubstitutions: [],
    presentationTips: [],
    kidsParticipation: [],
  };

  constructor(
    private recipesService: RecipesService,
    private sousChefService: SousChefService,
    private userService: UserService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    console.log('Receta recibida por SousChef:', this.recipe);
    speechSynthesis.onvoiceschanged = () => this.setDefaultVoice();
    this.setDefaultVoice();
  }

  ngOnDestroy(): void {
    this.stop();
  }

  // ---------- FAVORITES ----------

  emitSave(): void {
    this.save.emit(); // el padre lo maneja igual que el otro botón
  }
  
  private saveFavoriteToLocal(recipe: IRecipe): void {
    const stored = localStorage.getItem('localFavorites');
    const currentFavorites: IRecipe[] = stored ? JSON.parse(stored) : [];
    const exists = currentFavorites.some(r => r.name === recipe.name);

    if (!exists) {
      currentFavorites.push(recipe);
      localStorage.setItem('localFavorites', JSON.stringify(currentFavorites));
      this.toastService.showSuccess('Receta guardada localmente como favorita');
    } else {
      this.toastService.showInfo('La receta ya estaba guardada localmente');
    }
  }

  // ---------- AUDIO ----------

  speak(): void {
    if (!this.recipe) return;
    if (this.audioInstance && !this.audioInstance.paused && !this.audioInstance.ended) return;

    const texto = this.buildText();
    this.prepareAudioState();

    this.cleanupPreviousAudio();
    this.sousChefService.getAudio(texto, this.currentVoiceName).subscribe({
      next: blob => this.playAudioBlob(blob),
      error: err => this.handleAudioFallback(err, texto),
    });
  }

  private prepareAudioState(): void {
    this.isSpeaking = true;
    this.isSousChefOn = true;
    this.isCreatingAudio = true;
  }

  private cleanupPreviousAudio(): void {
    if (this.audioInstance) {
      this.audioInstance.pause();
      this.audioInstance.src = '';
      this.audioInstance.load();
    }
  }

  private playAudioBlob(blob: Blob): void {
    const audioUrl = URL.createObjectURL(blob);
    this.audioInstance = new Audio(audioUrl);
    this.audioInstance.volume = this.volume;

    this.audioInstance.onended = () => this.resetAudioState();
    this.audioInstance.onplay = () => {
      this.isCreatingAudio = false;
      this.isSpeaking = true;
      this.isSousChefOn = true;
    };

    this.audioInstance.play();
  }

  private resetAudioState(): void {
    this.isSpeaking = false;
    this.isSousChefOn = false;
    this.audioInstance = null;
    this.isCreatingAudio = false;
  }

  private async handleAudioFallback(err: any, texto: string): Promise<void> {
    console.warn('ElevenLabs falló, usando voz del navegador.');

    if (this.currentVoiceName === 'daniela') {
      this.currentVoiceName = 'mauricio';
    }

    if (err.error instanceof Blob) {
      const errorText = await err.error.text();
      console.error('Detalle del error:', errorText);
    } else {
      console.error('Error inesperado:', err);
    }

    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.volume = this.volume;
    utterance.rate = this.rate;
    utterance.lang = 'es-ES';
    if (this.selectedVoice) utterance.voice = this.selectedVoice;

    speechSynthesis.speak(utterance);
    utterance.onend = () => this.resetAudioState();
  }

  toggleSousChef(): void {
    if (this.audioInstance) {
      if (this.audioInstance.paused) {
        this.audioInstance.play();
        this.isSpeaking = true;
        this.isSousChefOn = true;
      } else {
        this.audioInstance.pause();
        this.isSpeaking = false;
        this.isSousChefOn = false;
      }
    } else {
      this.speak();
    }
  }

  restartAudio(): void {
    if (this.audioInstance) {
      this.audioInstance.pause();
      this.audioInstance.currentTime = 0;
      this.audioInstance.play();
      this.isSpeaking = true;
      this.isSousChefOn = true;
    }
  }

  stop(): void {
    if (this.audioInstance) {
      this.audioInstance.pause();
      this.audioInstance.src = '';
      this.audioInstance.load();
      this.audioInstance = null;
    }
    this.isSpeaking = false;
    this.isSousChefOn = false;
    speechSynthesis.cancel();
  }

  toggleVoiceGender(): void {
    this.stop();
    this.currentVoiceName = this.currentVoiceName === 'daniela' ? 'mauricio' : 'daniela';
    setTimeout(() => this.speak(), 100);
  }

  private setDefaultVoice(): void {
    const voices = speechSynthesis.getVoices();
    this.selectedVoice =
      voices.find(v => v.lang === 'es-ES' && v.name.includes('Google')) ||
      voices.find(v => v.lang.startsWith('es')) ||
      voices[0] || null;
  }

  private buildText(): string {
    const intro = `¡Bienvenido a la NomNomcocina! Hoy vamos a preparar: ${this.recipe.name}.`;
    const lista = this.recipe.ingredients.map(i => i.name || 'ingrediente desconocido');
    const ingredientes = `Necesitaremos ${lista.length} ingrediente(s): ${lista.join(', ')}.`;
    const pasos = `Vamos a hacer los pasos uno por uno: ${this.recipe.instructions}.`;
    const despedida = `¡Nos vemos en la próxima receta!`;
    return `${intro} ${ingredientes} ${pasos} ${despedida}`;
  }

  // ---------- SUGERENCIAS ----------

  suggestPresentation(): void {
    if (!this.recipe) return;

    this.recipesService
      .generateSuggestions(this.recipe)
      .pipe(retry({ count: 10, delay: () => timer(2000) }))
      .subscribe({
        next: res => this.suggestions = res.data || this.suggestions,
        error: err => console.error('Error al generar sugerencias:', err),
      });
  }
}
