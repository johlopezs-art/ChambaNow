import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  
  // Asegúrate de que esta sea tu IP correcta y puerto 8000
  private apiUrl = 'http://192.168.1.23:8000'; 

  constructor() { }

  // ==========================================
  // 1. AUTENTICACIÓN Y REGISTRO
  // ==========================================

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  registrarUsuario(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuarios/`, data);
  }

  // ==========================================
  // 2. PERFIL DE USUARIO
  // ==========================================

  obtenerUsuario(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuarios/${id}`);
  }

  actualizarPerfil(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/perfil/${id}`, data);
  }

  actualizarUbicacion(id: number, lat: number, lng: number): Observable<any> {
    const data = { latitud: lat, longitud: lng };
    return this.http.patch(`${this.apiUrl}/perfil/${id}`, data);
  }

  // ==========================================
  // 3. SOLICITUDES DE TRABAJO (OFERTAS)
  // ==========================================

  crearSolicitud(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/solicitudes/`, data);
  }

  obtenerSolicitudes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/solicitudes/`);
  }

  // --- NUEVA FUNCIÓN AGREGADA ---
  // Obtiene el detalle de una sola solicitud por su ID
  obtenerSolicitudPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/solicitudes/${id}`);
  }

  // ==========================================
  // 4. BANDEJA DE ENTRADA Y POSTULACIONES
  // ==========================================

  /**
   * Postular a un trabajo.
   * @param data { solicitud_id: number, usuario_id: number }
   */
  postular(data: { solicitud_id: number, usuario_id: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/postular/`, data);
  }

  /**
   * Ver trabajos a los que YO he postulado y su estado (pendiente/aceptada).
   */
  obtenerMisPostulaciones(usuarioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/mis-postulaciones/${usuarioId}`);
  }

  /**
   * Ver trabajos que YO creé y la lista de gente que ha postulado a ellos.
   */
  obtenerMisSolicitudesConPostulantes(usuarioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/mis-solicitudes-creadas/${usuarioId}`);
  }

  /**
   * Aceptar o Rechazar a un postulante.
   * @param postulacionId ID de la postulación
   * @param estado 'aceptada' | 'rechazada'
   */
  cambiarEstadoPostulacion(postulacionId: number, estado: 'aceptada' | 'rechazada'): Observable<any> {
    // Enviamos el estado como Query Param (?estado=...)
    return this.http.put(`${this.apiUrl}/postulaciones/${postulacionId}/estado?estado=${estado}`, {});
  }
}