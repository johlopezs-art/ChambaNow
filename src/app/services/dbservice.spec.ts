import { TestBed } from '@angular/core/testing';
import { DBTaskService } from './dbservice'; // NOMBRE CORRECTO
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

describe('DBTaskService', () => {
  let service: DBTaskService;

  // Spies (Objetos simulados)
  let sqliteSpy: jasmine.SpyObj<SQLite>;
  let sqliteObjectSpy: jasmine.SpyObj<SQLiteObject>;
  let platformSpy: jasmine.SpyObj<Platform>;
  let storageSpy: jasmine.SpyObj<Storage>;

  beforeEach(() => {
    // 1. Mock de la conexión abierta de SQLite
    sqliteObjectSpy = jasmine.createSpyObj('SQLiteObject', ['executeSql']);
    sqliteObjectSpy.executeSql.and.returnValue(Promise.resolve({ rows: { length: 0, item: (i: number) => {} } }));

    // 2. Mock del plugin SQLite
    sqliteSpy = jasmine.createSpyObj('SQLite', ['create']);
    sqliteSpy.create.and.returnValue(Promise.resolve(sqliteObjectSpy));

    // 3. Mock de Storage
    storageSpy = jasmine.createSpyObj('Storage', ['create', 'set', 'get', 'remove', 'clear']);
    storageSpy.create.and.returnValue(Promise.resolve(storageSpy));
    storageSpy.set.and.returnValue(Promise.resolve());
    storageSpy.remove.and.returnValue(Promise.resolve());
    storageSpy.clear.and.returnValue(Promise.resolve());

    // 4. Mock de Platform
    platformSpy = jasmine.createSpyObj('Platform', ['ready', 'is']);
    platformSpy.ready.and.returnValue(Promise.resolve('ready'));
    platformSpy.is.and.returnValue(true); // Simulamos móvil por defecto

    TestBed.configureTestingModule({
      providers: [
        DBTaskService,
        { provide: SQLite, useValue: sqliteSpy },
        { provide: Platform, useValue: platformSpy },
        { provide: Storage, useValue: storageSpy }
      ]
    });

    service = TestBed.inject(DBTaskService);
  });

  it('debería crearse el servicio', () => {
    expect(service).toBeTruthy();
  });

  // --- PRUEBA ASÍNCRONA CORREGIDA (SOLUCIÓN AL ERROR DE NULL) ---
  it('getCurrentUser debería devolver los datos del usuario desde Storage', async () => {
    // 1. Arrange
    const mockUser = { name: 'Juan' };
    storageSpy.get.and.returnValue(Promise.resolve(mockUser));

    // 2. Act (Usamos await para esperar el valor real)
    const user = await service.getCurrentUser();

    // 3. Assert
    expect(user).toEqual(mockUser);
    expect(storageSpy.get).toHaveBeenCalledWith('user_data');
  });

  it('isSessionActive debería devolver TRUE si Storage lo dice', async () => {
    storageSpy.get.and.returnValue(Promise.resolve(true));

    const isActive = await service.isSessionActive();

    expect(isActive).toBeTrue();
    expect(storageSpy.get).toHaveBeenCalledWith('session_active');
  });

  it('createSession debería guardar en SQLite y Storage', async () => {
    const mockUser = { id: 1, nombre: 'Pepe', email: 'pepe@test.com' };
    
    // Inyectamos la BD simulada manualmente
    (service as any).dbInstance = sqliteObjectSpy;

    await service.createSession(mockUser);

    // Verificamos Storage
    expect(storageSpy.set).toHaveBeenCalledWith('session_active', true);
    expect(storageSpy.set).toHaveBeenCalledWith('user_data', mockUser);
    
    // Verificamos SQLite
    expect(sqliteObjectSpy.executeSql).toHaveBeenCalled();
  });

  it('closeSession debería limpiar Storage y actualizar SQLite', async () => {
    (service as any).dbInstance = sqliteObjectSpy;

    await service.closeSession();

    expect(storageSpy.remove).toHaveBeenCalledWith('session_active');
    expect(sqliteObjectSpy.executeSql).toHaveBeenCalled();
  });
});