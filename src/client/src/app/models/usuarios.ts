export class Usuarios {
    _id?: string;
    nombre: string;
    correoElectronico: string;
    telefono: string;
    direccion: string;
    rol: string;
    fechaRegistro: Date;
  
    constructor(nombre: string, correoElectronico: string, telefono: string, direccion: string, rol: string, fechaRegistro: Date, _id?: string) {
      this._id = _id;
      this.nombre = nombre;
      this.correoElectronico = correoElectronico;
      this.telefono = telefono;
      this.direccion = direccion;
      this.rol = rol;
      this.fechaRegistro = fechaRegistro;
    }
  }
  