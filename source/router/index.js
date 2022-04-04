const express = require("express");
const dbContactos = require('../models/contactos.js');
const router = express.Router();
const mysql = require("mysql");

router.get('/', (req, res) => {
    res.send("Iniciamos Servidor");
});
router.get('/index', (req, res) => {
    res.render('index.html', { titulo: 'Index' })
});
router.get('/acercade', (req, res) => {
    res.render('acercade.html', { titulo: 'Acerca de' })
});
router.get('/contactos', (req, res) => {
    res.render('contactos.html', { titulo: 'Contactos', contactos: [], contacto: null })
});

router.post('/contactos', async (req, res) => {
    let contactos = await dbContactos.Contactos.mostrarTodos();
    if (!contactos.length) return res.render('contactos.html', { titulo: 'contactos de Contactos', contactos: [], contacto: null });

    res.render('contactos.html', { titulo: 'contactos de Contactos', contactos: contactos, contacto: null })
});

router.post('/contactos/nuevo', async (req, res) => {
    const { nombre, domicilio, telefono } = req.body;

    await dbContactos.Contactos.insertar({ nombre, domicilio, telefono });

    res.redirect('/contactos')
});

router.get('/contactos/id', async (req, res) => {
    const { idContactos } = req.query;
    if (!idContactos) return res.redirect('/contactos');

    const contacto = await dbContactos.Contactos.buscarId(idContactos);

    res.render('contactos.html', { titulo: 'contactos de Contactos', contactos: [], contacto: contacto[0] });
});

router.post('/contactos/id', async (req, res) => {
    const { idContactos, nombre, domicilio, telefono } = req.body;
    if (!idContactos) return res.redirect('/contactos');

    await dbContactos.Contactos.actualizar({ nombre, domicilio, telefono, idContactos });

    res.redirect('/contactos');
})

router.post('/contactos/id/borrar', async (req, res) => {

    const { idContactos } = req.body;

    if (!idContactos) return res.redirect('/contactos');

    await dbContactos.Contactos.borrar(idContactos);

    res.redirect('/contactos');
})

router.get('*', (req, res) => {
    res.send("No existe la pagina");
})

module.exports = router;