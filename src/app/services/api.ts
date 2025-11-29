import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Inyectamos el cliente HTTP
  private http = inject(HttpClient);

  // --- ¡IMPORTANTE! ---
  // Cambia '192.168.1.15' por la IP de tu computadora (usa 'ipconfig' en Windows).
  // NO uses 'localhost' si vas a probar en el celular.
  private apiUrl = 'http://192.168.1.23:8000'; 

  constructor() { }

  // 0. LOGIN (POST /login)
  // Nota: Asegúrate de implementar este endpoint en tu FastAPI
  login(credentials: any): Observable<any> {
    // Se asume que el backend espera un form-data o JSON con username/password
    // Para FastAPI OAuth2PasswordRequestForm, se suele usar FormData.
    // Para un login JSON simple:
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  // 1. REGISTRO DE USUARIO (POST /usuarios/)
  registrarUsuario(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuarios/`, data);
  }

  // 2. OBTENER PERFIL (GET /usuarios/{id})
  obtenerUsuario(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuarios/${id}`);
  }

  // 3. ACTUALIZAR PERFIL PROFESIONAL (PUT /perfil/{id})
  // Úsalo cuando quieras guardar ocupación, profesión y habilidades.
  actualizarPerfil(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/perfil/${id}`, data);
  }

  // 4. ACTUALIZAR UBICACIÓN (PATCH /perfil/{id})
  // Úsalo para actualizar SOLO latitud/longitud sin borrar lo demás.
  actualizarUbicacion(id: number, lat: number, lng: number): Observable<any> {
    const data = { latitud: lat, longitud: lng };
    return this.http.patch(`${this.apiUrl}/perfil/${id}`, data);
  }
}