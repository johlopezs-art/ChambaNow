import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DBTaskService {
  // Variable para manipular la BD nativa
  private dbInstance: SQLiteObject | null = null;
  
  // Observable para saber si la BD está lista antes de hacer consultas
  private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private sqlite: SQLite,
    private platform: Platform,
    private storage: Storage
  ) {
    this.init();
  }

  dbState() {
    return this.isDbReady.asObservable();
  }

  // 1. INICIALIZACIÓN COMPLETA
  async init() {
    // Iniciar Storage (Key/Value)
    await this.storage.create();

    // Iniciar SQLite (Nativo) solo si estamos en celular
    this.platform.ready().then(async () => {
      if (this.platform.is('capacitor') || this.platform.is('cordova')) {
        try {
          const db = await this.sqlite.create({
            name: 'chambanow_native.db',
            location: 'default'
          });
          
          this.dbInstance = db;
          await this.createTables();
          this.isDbReady.next(true); // ¡Base de datos lista!

        } catch (e) {
          console.error('Error al crear BD SQLite', e);
        }
      } else {
        // Fallback para web (opcional, aquí solo usamos Storage en web)
        this.isDbReady.next(true); 
      }
    });
  }

  // 2. CREACIÓN DE TABLAS
  private async createTables() {
    try {
      if (!this.dbInstance) return;

      // Tabla SESIONES: Guardamos historial de logins
      // active: 1 = iniciada, 0 = cerrada
      await this.dbInstance.executeSql(`
        CREATE TABLE IF NOT EXISTS sesiones (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          user_name TEXT,
          email TEXT,
          token TEXT,
          active INTEGER DEFAULT 1,
          login_date TEXT
        )
      `, []);
      
      console.log('Tablas creadas correctamente');
    } catch (e) {
      console.error('Error creando tablas', e);
    }
  }

  // --- MÉTODOS DE SESIÓN (CRUD) ---

  /**
   * CREAR SESIÓN:
   * 1. Guarda en SQLite (Historial).
   * 2. Guarda en Ionic Storage (Acceso rápido).
   */
  async createSession(userData: any) {
    // A. Guardar en SQLite
    if (this.dbInstance) {
      const sql = `INSERT INTO sesiones (user_id, user_name, email, active, login_date) VALUES (?, ?, ?, ?, ?)`;
      const date = new Date().toISOString();
      await this.dbInstance.executeSql(sql, [userData.id, userData.nombre, userData.email, 1, date]);
    }

    // B. Guardar en Storage (Persistencia rápida de sesión activa)
    await this.storage.set('session_active', true);
    await this.storage.set('user_data', userData);
  }

  /**
   * CERRAR SESIÓN:
   * 1. Actualiza SQLite (pone active = 0).
   * 2. Limpia Storage.
   */
  async closeSession() {
    // A. Actualizar SQLite (Marcar como inactiva la última sesión)
    if (this.dbInstance) {
      const sql = `UPDATE sesiones SET active = 0 WHERE active = 1`;
      await this.dbInstance.executeSql(sql, []);
    }

    // B. Limpiar Storage
    await this.storage.remove('session_active');
    await this.storage.remove('user_data');
    // await this.storage.clear(); // Opcional: Borra TODO
  }

  /**
   * VALIDAR SESIÓN:
   * Verifica rápidamente en Storage si hay alguien logueado.
   */
  async isSessionActive(): Promise<boolean> {
    return await this.storage.get('session_active') === true;
  }

  /**
   * OBTENER USUARIO ACTUAL:
   * Recupera los datos del usuario desde Storage.
   */
  async getCurrentUser() {
    return await this.storage.get('user_data');
  }

  /**
   * VER HISTORIAL (Solo SQLite):
   * Ejemplo de lectura de datos.
   */
  async getLoginHistory() {
    if (!this.dbInstance) return [];
    
    const res = await this.dbInstance.executeSql(`SELECT * FROM sesiones ORDER BY id DESC`, []);
    let items = [];
    if (res.rows.length > 0) {
      for (var i = 0; i < res.rows.length; i++) {
        items.push(res.rows.item(i));
      }
    }
    return items;
  }
}