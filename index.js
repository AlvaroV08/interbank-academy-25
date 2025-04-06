//Creamos las constantes necesarias para el funcionamiento del programa y la lectura del archivo CSV
const fs = require('fs');
const csv = require('csv-parser');
//Creamos las variables necesarias que van a almacenar los datos de las transacciones y el balance final
let balance = 0;
let maxTrans = { id: null, monto: 0 };
let creditCount = 0;
let debitCount = 0;
let balanceCredit = 0;
let balanceDebit = 0;
//Leemos el archivo CSV y parseamos los datos
fs.createReadStream('data.csv')
  .pipe(csv())
  .on('data', (row) => {
    const id = row.id;
    const tipo = row.tipo.trim();
    const monto = parseFloat(row.monto);
//Comprobamos el tipo de transacción y actualizamos el balance y subimos el conteo correspondiente
    if (tipo === 'Crédito') {
      balance += monto;
      balanceCredit += monto;
      creditCount++;
    } else if (tipo === 'Débito') {
      balance -= monto;
      balanceDebit += monto;
      debitCount++;
    }
//Evaluamos si el monto de la transacción es mayor al máximo registrado y lo actualizamos
    if (monto > maxTrans.monto) {
      maxTrans = { id, monto };
    }
  })
  .on('end', () => {
    //Al finalizar la lectura del archivo, imprimimos el reporte de transacciones
    console.log('---------------------------------------------');
    console.log('Reporte de Transacciones');
    console.log('---------------------------------------------');
    console.log(`Balance Final: ${balance.toFixed(2)}`);
    console.log(`Balance Crédito: ${balanceCredit.toFixed(2)}`);
    console.log(`Balance Débito: ${balanceDebit.toFixed(2)}`);
    console.log(`Transacción de Mayor Monto: ID ${maxTrans.id} - ${maxTrans.monto.toFixed(2)}`);
    console.log(`Conteo de Transacciones: Crédito: ${creditCount} Débito: ${debitCount}`);
  });
