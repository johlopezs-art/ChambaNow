import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
// Importaciones explícitas de componentes Ionic Standalone
import { 
  IonContent, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonNote, 
  IonButton 
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-error404',
  templateUrl: './error404.page.html',
  styleUrls: ['./error404.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Necesario para usar <lottie-player>
  imports: [
    CommonModule, 
    RouterLink,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonNote,
    IonButton
  ], 
})
export class Error404Page implements OnInit {

  constructor() {}

  ngOnInit() {}
}