const flash = require('connect-flash');
const User = require('./models/User'); // Importa el modelo de usuario
const Report = require('./models/Report'); // Importa el modelo de reporte

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs'); // Necesario para hashing de contraseñas

const path = require('path'); // Módulo para trabajar con rutas de archivos

const port = 3000; // Puedes cambiar el puerto si es necesario

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/ECOCuliacan', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Conectado a MongoDB!'))
.catch(err => console.error('Error al conectar a MongoDB:', err));

// Configuración de EJS como motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Directorio donde se encuentran tus archivos .ejs

// Middlewares
app.use(express.static(path.join(__dirname, 'public'))); // Sirve archivos estáticos (CSS, JS, imágenes) desde la carpeta 'public'
app.use(express.urlencoded({ extended: true })); // Para parsear datos de formularios (req.body)
app.use(express.json()); // Para parsear cuerpos de solicitud JSON

// Configuración de sesiones
app.use(session({
    secret: 'un_secreto_muy_seguro_y_largo_para_tu_sesion', // CAMBIA ESTO: Usa una cadena larga y aleatoria en producción
    resave: false, // No guardar la sesión si no ha cambiado
    saveUninitialized: false // No guardar sesiones nuevas sin inicializar
}));

// Configuración de Passport (para autenticación)
app.use(passport.initialize()); // Inicializa Passport
app.use(passport.session()); // Permite que Passport use sesiones
app.use(flash()); // Usa connect-flash para mensajes flash (errores, éxitos)

// Configuración de la estrategia local de Passport (para login con usuario y contraseña)
passport.use(new LocalStrategy(
    (username, password, done) => {
        User.findOne({ username: username })
            .then(user => {
                if (!user) {
                    // Usuario no encontrado
                    return done(null, false, { message: 'Usuario no encontrado.' });
                }
                // Comparar la contraseña ingresada con la contraseña hasheada en la base de datos
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err; // Error en la comparación
                    if (isMatch) {
                        // Contraseña coincide
                        return done(null, user);
                    } else {
                        // Contraseña incorrecta
                        return done(null, false, { message: 'Contraseña incorrecta.' });
                    }
                });
            })
            .catch(err => done(err)); // Error en la búsqueda de usuario
    }
));

// Serializar y deserializar usuario para la sesión de Passport
// Serializar: Qué datos del usuario se guardan en la sesión
passport.serializeUser((user, done) => {
    done(null, user.id); // Solo guardamos el ID del usuario en la sesión
});

// Deserializar: Cómo recuperar el usuario completo a partir del ID guardado en la sesión
passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => {
            done(null, user); // Pasa el objeto de usuario completo
        })
        .catch(err => done(err)); // Error al buscar el usuario por ID
});

// Middleware para pasar los mensajes flash y el usuario autenticado a todas las vistas
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg'); // Mensajes de éxito
    res.locals.error_msg = req.flash('error_msg');     // Mensajes de error generales
    res.locals.error = req.flash('error');             // Mensajes de error específicos de Passport (ej. "Usuario no encontrado")
    res.locals.user = req.user || null;                // Pasa el usuario autenticado a las vistas (es 'null' si no hay sesión)
    next(); // Continúa con la siguiente función de middleware o ruta
});

// --- DEFINICIÓN DE RUTAS ---

// Ruta raíz (Página de INICIO, index.ejs)
app.get('/', (req, res) => {
    // Si el usuario está logueado, redirige a la página de bienvenida (bienvenida.ejs)
    if (req.isAuthenticated()) {
        return res.redirect('/bienvenida');
    }
    res.render('index'); // Renderiza tu archivo 'index.ejs' si no está logueado
});

// Ruta para mostrar la página de bienvenida (solo si el usuario está logueado)
app.get('/bienvenida', (req, res) => {
    if (!req.isAuthenticated()) {
        req.flash('error_msg', 'Por favor, inicia sesión para acceder a esta sección.');
        return res.redirect('/login'); // Redirige al login si no está autenticado
    }
    res.render('bienvenida'); // Renderiza tu archivo 'bienvenida.ejs'
});

// Rutas de Autenticación

// GET para mostrar el formulario de login
app.get('/login', (req, res) => {
    res.render('login');
});

// POST para procesar el formulario de login (con Passport.js)
app.post('/login', passport.authenticate('local', {
    successRedirect: '/bienvenida', // Redirige a la página de bienvenida después de un login exitoso
    failureRedirect: '/login', // Redirige de vuelta al login si falla
    failureFlash: true // Habilita los mensajes flash de error de Passport
}));

// GET para mostrar el formulario de registro
app.get('/registro', (req, res) => {
    res.render('registro');
});

// POST para procesar el formulario de registro
app.post('/registro', async (req, res) => {
    // Desestructuración para obtener los datos del formulario
    const { username, password, confirmPassword, gender } = req.body; 

    let errors = []; // Array para almacenar mensajes de error

    // Validaciones del lado del servidor para el registro
    if (!username || !password || !confirmPassword || !gender) {
        errors.push({ msg: 'Por favor, rellene todos los campos.' });
    }

    if (password !== confirmPassword) {
        errors.push({ msg: 'Las contraseñas no coinciden.' });
    }

    if (password.length < 6) {
        errors.push({ msg: 'La contraseña debe tener al menos 6 caracteres.' });
    }

    // Si hay errores, renderiza la página de registro de nuevo con los errores y los datos ingresados
    if (errors.length > 0) {
        res.render('registro', { 
            errors,           // Pasa el array de errores
            username,         // Mantiene el valor del usuario ingresado
            gender            // Mantiene el género seleccionado
        });
    } else {
        try {
            // Verificar si el nombre de usuario ya existe en la base de datos
            const existingUser = await User.findOne({ username: username });
            if (existingUser) {
                errors.push({ msg: 'El nombre de usuario ya está registrado.' });
                req.flash('error_msg', 'El nombre de usuario ya está registrado.'); // Mensaje flash
                res.render('registro', { 
                    errors, 
                    username, 
                    gender 
                });
            } else {
                // Crear una nueva instancia de usuario con los datos
                const newUser = new User({
                    username,
                    password,
                    gender // Guarda el género en el nuevo usuario
                });

                // Hashear la contraseña antes de guardarla en la base de datos
                const salt = await bcrypt.genSalt(10); // Genera un "salt" (cadena aleatoria)
                newUser.password = await bcrypt.hash(newUser.password, salt); // Hashea la contraseña con el salt
                
                // Guardar el nuevo usuario en la base de datos
                await newUser.save();
                // Establecer un mensaje flash de éxito y redirigir al login
                req.flash('success_msg', 'Registro exitoso, ¡ahora puedes iniciar sesión!');
                res.redirect('/login');
            }
        } catch (err) {
            // Manejo de errores en caso de problemas al guardar el usuario
            console.error(err);
            req.flash('error_msg', 'Error al registrar el usuario.');
            res.redirect('/registro');
        }
    }
});

// Ruta para cerrar sesión
app.get('/logout', (req, res, next) => {
    // req.logout() requiere un callback en Express 4.x+
    req.logout(function(err) {
        if (err) { return next(err); } // Pasa el error al siguiente middleware si ocurre
        req.flash('success_msg', 'Has cerrado sesión.'); // Mensaje de éxito
        res.redirect('/'); // Redirige a la página principal (index.ejs)
    });
});

// Middleware para proteger rutas (ejemplo)
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next(); // Si está autenticado, permite el acceso
    }
    req.flash('error_msg', 'Por favor, inicia sesión para acceder a esta sección.');
    res.redirect('/login'); // Si no, redirige al login con un mensaje
}

// --- RUTAS ESPECÍFICAS DE LA APLICACIÓN (REPORTES Y DONACIÓN) ---

// Ruta para mostrar la página de selección de zona (protegida)
app.get('/seleccion-zona', ensureAuthenticated, (req, res) => {
    res.render('seleccion_zona');
});

// Ruta para procesar la selección de zona y redirigir al formulario de reporte (protegida)
app.post('/seleccion-zona', ensureAuthenticated, (req, res) => {
    const { zona } = req.body; 
    console.log('Zona seleccionada:', zona);
    res.redirect('/crear-reporte');
});

// Ruta para mostrar el formulario de crear reporte (protegida)
app.get('/crear-reporte', ensureAuthenticated, (req, res) => {
    res.render('crear_reporte');
});

// Ruta para procesar el envío del reporte (protegida)
app.post('/crear-reporte', ensureAuthenticated, async (req, res) => {
    const { fullName, address, zipCode, phoneNumber, problemDescription } = req.body;

    let errors = [];

    // Validaciones del reporte
    if (!fullName || !address || !zipCode || !phoneNumber || !problemDescription) {
        errors.push({ msg: 'Por favor, rellene todos los campos del reporte.' });
    }

    if (errors.length > 0) {
        // Usa req.flash para almacenar los mensajes de error
        req.flash('error_msg', errors.map(e => e.msg).join(', '));
        return res.render('crear_reporte', {
            // Pasamos los datos del formulario de vuelta para que el usuario no los pierda
            fullName, address, zipCode, phoneNumber, problemDescription,
            // Los mensajes flash se recuperan automáticamente en res.locals.error_msg
        });
    } else {
        try {
            // Crear una nueva instancia de Report
            const newReport = new Report({
                fullName,
                address,
                zipCode,
                phoneNumber,
                problemDescription,
                userId: req.user.id // Asigna el ID del usuario logueado al reporte
            });

            // Guardar el reporte en la base de datos
            await newReport.save();
            req.flash('success_msg', 'Reporte creado exitosamente.'); 
            
            // REDIRECCION CLAVE: Aquí redirigimos a la ruta GET /reporte-creado
            res.redirect('/reporte-creado');

        } catch (err) {
            console.error(err);
            req.flash('error_msg', 'Error al crear el reporte.');
            res.redirect('/crear-reporte');
        }
    }
});

// RUTA PARA MOSTRAR LA PÁGINA DE CONFIRMACIÓN DE REPORTE CREADO
// Esta es la ruta a la que redirige app.post('/crear-reporte') después de guardar un reporte.
// Debe estar definida a nivel global en server.js, no dentro de otra ruta.
app.get('/reporte-creado', ensureAuthenticated, (req, res) => {
    // Puedes pasar variables a la vista si las necesitas, por ejemplo, para mostrar el botón de donar.
    // showDonateButton se pasa como 'true' aquí para que el botón siempre aparezca en la página de confirmación.
    const showDonateButton = true; 
    res.render('reporte_creado', { 
        success_msg: req.flash('success_msg'), // Recupera el mensaje flash de éxito si lo hay
        showDonateButton: showDonateButton 
    });
});


// Ruta para mostrar la página de donación
app.get('/donacion', (req, res) => {
    res.render('donacion');
});

// Ruta para procesar la donación (ejemplo básico, sin integración de pagos reales)
app.post('/donacion', (req, res) => {
    // req.flash('success_msg', '¡Gracias por tu donación!');
    res.redirect('/');
});


// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});