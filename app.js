require('colors');

const { guardarDB, leerDB } = require('./helpers/guardarArchivo');
const { inquirerMenu, pausa, leerInput, listarTareasBorrar, confirmar, mostrarListadoChecklist } = require('./helpers/inquirer');
//const Tarea = require('./models/tarea');
const Tareas = require('./models/tareas');

//console.clear();

const main = async () => {
    let opt = '';
    const tareas = new Tareas();
    const tareasDB = leerDB();
    if (tareasDB) {
        //cargar tareas
        tareas.cargarTareasFromArray(tareasDB);
    }

    //await pausa();

    do {
        //esta funcion imprime el menú
        opt = await inquirerMenu();
        //console.log({ opt });

        switch (opt) {
            case '1':
                // crear opcion
                const desc = await leerInput('Descripción:');
                //console.log(desc); 
                tareas.crearTarea(desc);
            break;

            case '2':
                //console.log( tareas.listadoArr ); 
                tareas.listadoCompleto();
                break;

            case '3':
                tareas.listarPendientesCompletadas(true);
            break;

            case '4':
                tareas.listarPendientesCompletadas(false);
            break;
            
            case '5':
                const ids = await mostrarListadoChecklist(tareas.listadoArr);
                //console.log(ids);
                tareas.toggleCompletadas( ids );
            break;


            case '6':
                const id = await listarTareasBorrar(tareas.listadoArr);
                if (id !== '0') {
                    const ok = await confirmar('Está seguro que decea borrar?');
                    //preguntar si esta segura de borrar
                    if (ok) {
                        tareas.borrarTarea(id);
                        console.log('Tarea borrada');
                    }

                }

                //console.log({ok});
            break;
        }

        guardarDB(tareas.listadoArr);
        await pausa();

        //if( opt !== 0) await pausa();

    } while (opt !== '0');
    //pausa();

}

main();
