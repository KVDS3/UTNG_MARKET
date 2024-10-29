const Usuario = require('../model/users.model'); // Asegúrate de ajustar la ruta al modelo
const bcrypt = require('bcrypt');
const RFC=require('../model/rfc.models')
const jwt=require('jsonwebtoken')

exports.registrarUsuario = async (req, res) => {
  try {
    const { nombre, correoElectronico, telefono, direccion, tipoUsuario,username, password, estudiante, tienda } = req.body;

    console.log(req.body)

    // Validar que el correo electrónico no exista
    const existeUsuario = await Usuario.findOne({ correoElectronico });
    if (existeUsuario) {
      return res.status(400).json({ message: 'El correo electrónico ya está en uso' });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el nuevo usuario
    const nuevoUsuario = new Usuario({
      nombre,
      correoElectronico,
      telefono,
      direccion,
      tipoUsuario,
      username,
      password: hashedPassword,
      estudiante: tipoUsuario === 'student' ? estudiante : undefined,
      tienda: tipoUsuario === 'shop' ? tienda : undefined
    });

    // Guardar el usuario en la base de datos
    await nuevoUsuario.save();
    return res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return res.status(500).json({ message: 'Error del servidor' });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(req.body)

    // Verificar que el usuario existe
    const usuario = await Usuario.findOne({ username:username });
    if (!usuario) {
      return res.status(400).json({ message: 'Credenciales incorrectas' });
    }

    // Comparar la contraseña ingresada con la almacenada
    const esPasswordCorrecta = await bcrypt.compare(password, usuario.password);
    if (!esPasswordCorrecta) {
      return res.status(400).json({ message: 'Credenciales incorrectas' });
    }

    // Crear el token JWT
    const token = jwt.sign(
      { id: usuario._id, tipoUsuario: usuario.tipoUsuario },
      process.env.JWT_SECRET, // Asegúrate de tener esta variable en tu entorno
      { expiresIn: '1h' } // El token expirará en 1 hora
    );

    // Responder con el token
    return res.status(200).json({ message: 'Inicio de sesión exitoso', token });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return res.status(500).json({ message: 'Error del servidor' });
  }
};

exports.getRFC = async (req, res) => {
  const { rfc } = req.params;

  // Busca el RFC en la base de datos
  const record = await RFC.findOne({ rfc: rfc });

  // Verifica si el RFC existe
  const existence = record != null;

  // Envía la respuesta
  return res.status(200).json({ exists: existence });
};

