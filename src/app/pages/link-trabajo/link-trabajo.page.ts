import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { LottieComponent } from 'ngx-lottie'; // ✅ cambio aquí


interface OfertaTrabajo {
  id: number;
  titulo: string;
  empresa: string;
  ubicacion: string;
  resumen: string;
  imagenUrl: string;
  descripcionCompleta: string;
  requisitos: string[];
  sueldo: string;
}

@Component({
  selector: 'app-link-trabajo',
  templateUrl: './link-trabajo.page.html',
  styleUrls: ['./link-trabajo.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, LottieComponent]
 // ✅ cambio aquí
})
export class LinkTrabajoPage implements OnInit {

  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  trabajo: OfertaTrabajo | undefined;
  cargando = false;
  mostrarAnimacion = false;

  private TODAS_LAS_OFERTAS: OfertaTrabajo[] = [
    {
      id: 1,
      titulo: 'Desarrollador Frontend (Angular)',
      empresa: 'Tech Solutions Ltda.',
      ubicacion: 'Santiago, CL',
      resumen: 'Desarrollo de interfaces...',
      imagenUrl: '/assets/logo_angular.png',
      descripcionCompleta: 'Buscamos un desarrollador apasionado por el frontend con 3+ años de experiencia en Angular, manejo de RxJS, y metodologías ágiles. Se valorará conocimiento de Ionic.',
      requisitos: ['3+ años de experiencia con Angular', 'Dominio de TypeScript y SCSS', 'Experiencia en consumo de APIs REST'],
      sueldo: '$1.500.000 CLP'
    },
    {
      id: 2,
      titulo: 'Analista de Datos Jr.',
      empresa: 'Data Insights Corp.',
      ubicacion: 'Viña del Mar, CL',
      resumen: 'Análisis e interpretación...',
      imagenUrl: '/assets/logo_data.png',
      descripcionCompleta: 'Responsable de la extracción, limpieza y visualización de datos. Se requiere proactividad y excelente capacidad de comunicación para reportar hallazgos.',
      requisitos: ['Título en Ingeniería o Estadística', 'Manejo avanzado de SQL', 'Conocimiento en Python o R'],
      sueldo: '$950.000 CLP'
    },
  ];

  ngOnInit() {
    this.cargarDetalleTrabajo();
  }

  cargarDetalleTrabajo() {
    this.activatedRoute.paramMap.subscribe(params => {
      const idStr = params.get('id');
      if (idStr) {
        const trabajoId = parseInt(idStr, 10);
        this.trabajo = this.TODAS_LAS_OFERTAS.find(t => t.id === trabajoId);
      }
    });
  }

  postularTrabajo() {
    this.cargando = true;
    setTimeout(() => {
      this.cargando = false;
      this.mostrarAnimacion = true;
      setTimeout(() => {
        this.mostrarAnimacion = false;
      }, 3000);
    }, 2500);
  }




}
