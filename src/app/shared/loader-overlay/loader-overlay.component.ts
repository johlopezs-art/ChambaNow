// src/app/components/loader-overlay/loader-overlay.component.ts
import { Component, Input, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-loader-overlay',
  templateUrl: './loader-overlay.component.html',
  styleUrls: ['./loader-overlay.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule] 
})
export class LoaderOverlayComponent implements OnInit {

  @Input() visible: boolean = false; // Control de visibilidad
  @Input() defaultDuration: number = 5000; // Duración por defecto

  constructor() { }

  ngOnInit(): void {}

  /** 🔹 Muestra el loader por una duración específica */
  showFor(ms: number = this.defaultDuration): void { 
    if (this.visible) return;
    this.visible = true;

    setTimeout(() => {
      this.visible = false;
    }, ms);
  }

  /** 🔹 Muestra el overlay indefinidamente */
  show(): void {
    this.visible = true;
  }

  /** 🔹 Oculta el overlay manualmente */
  hide(): void {
    this.visible = false;
  }
}
