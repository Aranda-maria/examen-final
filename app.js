const express = require("express");
const Database = require("better-sqlite3");

const app = express();
const db = new Database("productos.db");
const PORT = 3000;

// Crear tabla
db.exec(`
CREATE TABLE IF NOT EXISTS productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    stock INTEGER,
    precio REAL
)
`);

// Verificar si hay productos
const row = db.prepare("SELECT COUNT(*) AS total FROM productos").get();

if (row.total === 0) {
    db.prepare("INSERT INTO productos (nombre, stock, precio) VALUES ('Teclado', 10, 100)").run();
    db.prepare("INSERT INTO productos (nombre, stock, precio) VALUES ('Mouse', 20, 50)").run();
    db.prepare("INSERT INTO productos (nombre, stock, precio) VALUES ('Monitor', 5, 300)").run();
}

// GET todos los productos
app.get("/productos", (req, res) => {
    const productos = db.prepare("SELECT * FROM productos").all();
    res.json(productos);
});

// GET producto por id
app.get("/productos/:id", (req, res) => {
    const id = req.params.id;
    const producto = db.prepare("SELECT * FROM productos WHERE id = ?").get(id);

    if (!producto) {
        res.json({ mensaje: "Producto no encontrado" });
    } else {
        res.json(producto);
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log("Servidor iniciado en puerto " + PORT);
});