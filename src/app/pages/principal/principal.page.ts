import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonicModule, ViewWillEnter } from '@ionic/angular'; // Importamos ViewWillEnter
import { HeaderMenuComponent } from '../../components/header-menu/header-menu.component';
import { DBTaskService } from '../../services/dbservice';
import { addIcons } from 'ionicons';
import { locationOutline, arrowForwardOutline } from 'ionicons/icons';

interface OfertaTrabajo {
  id: number;
  titulo: string;
  empresa: string;
  ubicacion: string;
  resumen: string;
  imagenUrl: string;
  sueldo: string;
}

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, HeaderMenuComponent]
})
export class PrincipalPage implements OnInit, ViewWillEnter {

  usuario: any = null; 
  headerHidden = false;
  private lastScrollTop = 0;

  ofertas: OfertaTrabajo[] = [
    {
      id: 1,
      titulo: 'Desarrollador Frontend (Angular)',
      empresa: 'Tech Solutions Ltda.',
      ubicacion: 'Santiago, CL',
      resumen: 'Desarrollo de interfaces de usuario robustas con Angular 17+ y TypeScript.',
      imagenUrl: 'assets/icon/tech.jpg', 
      sueldo: '$1.500.000 CLP'
    },
    {
      id: 2,
      titulo: 'Analista de Datos Jr.',
      empresa: 'Data Insights Corp.',
      ubicacion: 'Viña del Mar, CL',
      resumen: 'Análisis e interpretación de grandes volúmenes de datos usando SQL y Python.',
      imagenUrl: 'assets/icon/datainsights.png',
      sueldo: '$950.000 CLP'
    }
  ];

  private router = inject(Router);
  private dbTask = inject(DBTaskService);

  constructor() {
    addIcons({ locationOutline, arrowForwardOutline });
  }

  ngOnInit() {
    // ngOnInit solo se ejecuta una vez al crear el componente.
    // Dejamos esto vacío o para configuraciones estáticas.
  }

  // SOLUCIÓN: Usamos ionViewWillEnter
  // Este evento se dispara CADA VEZ que la vista se vuelve activa.
  async ionViewWillEnter() {
    await this.cargarUsuario();
  }

  async cargarUsuario() {
    // 1. Intentamos obtener datos de la navegación (Login reciente)
    const navigationState = this.router.getCurrentNavigation()?.extras.state;
    
    if (navigationState && navigationState['usuario']) {
      this.usuario = navigationState['usuario'];
      console.log('Usuario cargado desde Navegación:', this.usuario);
    } else {
      // 2. Si no hay estado de navegación (recarga o caché), forzamos lectura de BD
      this.usuario = await this.dbTask.getCurrentUser();
      console.log('Usuario cargado desde Storage (Refresh):', this.usuario);
    }
  }

  verDetalle(trabajoId: number) {
    this.router.navigate(['/link-trabajo', trabajoId]);
  }

  onScroll(event: any) {
    const scrollTop = event.detail.scrollTop;
    if (scrollTop > this.lastScrollTop && scrollTop > 50) {
      this.headerHidden = true;
    } else if (scrollTop < this.lastScrollTop) {
      this.headerHidden = false;
    }
    this.lastScrollTop = scrollTop;
  }
}