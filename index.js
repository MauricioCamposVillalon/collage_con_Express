const express = require("express");
const app = express();
const expressFileUpload = require("express-fileupload");
const fs = require('fs');

//Proyecto esta con NODEMON
//MIDDLEWARE
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

// Ingreso el limite del archivo a subir
app.use(
    expressFileUpload({
        limits: { fileSize: 5000000 }, // limite de 5 Mb
        abortOnLimit: true,
        responseOnLimit: "El peso del archivo supera el limite permitido.",
    })
);

app.listen(3000, console.log("Servidor corriendo en http://localhost:3000"));


app.get("/", (req, res) => {
    res.sendFile(__dirname + '/formulario.html')
});

app.get("/collage", (req, res) => {
    res.sendFile(__dirname + "/collage.html");
});


app.post('/imagen', (req, res) => {
    try {
        const { target_file } = req.files;
        const { posicion } = req.body;
        // console.log(target_file.mimetype);
        const nombreimg = `imagen-${posicion}`;
        console.log(posicion);
        if ((posicion == "") || (posicion < 1 ) || (posicion > 8)) {
            res.send(`<h2>Ha ocurrido un error en los valores a ingrresar</h2>
            <br>
            <h3>Por favor vuelva a ingresar valores validos.</h3>
            <br>
            <form action="/">
            <input type="submit" value="Presione para Volver" />
            </form>
            `)
        } else {
            target_file.mv(`${__dirname}/public/imgs/${nombreimg}.jpg`, (err) => {
                if (err) {
                    res.send(`Ha ocurrido un error al intentar subir la imagen.
                    <br>
                    <form action="/">
                    <input type="submit" value="Presione para Volver" />
                    </form>
                    `)
                } else {

                    res.sendFile(__dirname + "/collage.html")
                }
            })

        }
    } catch (err) {
        res.send(`Ha ocurrido ${err} presione el boton para volver a ejecutar la accion.
                <br><br>
                <form action="/">
                <input type="submit" value="Presione para Volver" />
                </form>
                `)

    }

})



app.get("/deleteImg/:nombre", (req, res) => {
    const { nombre } = req.params;
    fs.unlink(`${__dirname}/public/imgs/${nombre}`, (err) => {
        err ? res.send(`Ha ocurrido un error al eliminar la imagen
        <br>
        <form action="/collage">
        <input type="submit" value="Presiones para Volver" />
        </form>
        `) : res.send(`imagen con ${nombre} fue eliminada exitosamente
        <br>
        <form action="/collage">
        <input type="submit" value="Volver a collage" />
        </form>`);
    });
});




///NO ME QUIER MOSTRAR LAS IMAGENES EN COLLAGE.HTML CUANDO CORRE CON EL SERVIDOR, PERO AL PROBAR LA PAGINA SOLA DE FORMA LOCAL ME CARGA LAS IMAGENES

