import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';


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
  imports: [CommonModule, IonicModule]
})
export class PrincipalPage implements OnInit {

  usuario: string = '';
  password: string = ''; 
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
  
  private router: Router = inject(Router);

  constructor() {}

  ngOnInit() {
    this.recibirDatosDeLogin();
  }

  recibirDatosDeLogin() {
    const navigationState = this.router.getCurrentNavigation()?.extras.state;

    if (navigationState) {
      this.usuario = navigationState['usuario'] || 'Invitado';
      this.password = navigationState['password'] || '********';
      console.log('Datos recibidos:', this.usuario, this.password);
    } else {
      console.warn('No se recibieron datos de navegación.');
    }
  }

  verDetalle(trabajoId: number) {
    this.router.navigate(['/link-trabajo', trabajoId]);
  }

  async cerrarSesion() {
    this.router.navigate(['/login']);
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
