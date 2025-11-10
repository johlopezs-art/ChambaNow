// src/app/pages/error404/error404.page.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router'; // ⬅️ Necesario para usar routerLink en el botón

@Component({
  selector: 'app-error404',
  templateUrl: './error404.page.html', // ⬅️ Apunta al archivo HTML
  styleUrls: ['./error404.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterLink] // ⬅️ RouterLink incluido en imports
})
export class Error404Page implements OnInit { // ⬅️ Nombre de la clase confirmado

  constructor() { }

  ngOnInit() {
  }

}