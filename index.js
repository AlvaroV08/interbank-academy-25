//Creamos las constantes necesarias para el funcionamiento del programa y la lectura del archivo CSV
const fs = require('fs');
const csv = require('csv-parser');
//Creamos una constante para almacenar los datos de las transacciones y las inicializamos con valores por defecto
const transactionData = {
  balance: 0,
  maxTrans: { id: null, monto: 0 },
  creditCount: 0,
  debitCount: 0,
  balanceCredit: 0,
  balanceDebit: 0
};
//Leemos el archivo CSV y parseamos los datos
fs.createReadStream('data.csv')
  .pipe(csv())
  .on('data', (row) => {
    const id = row.id;
    const tipo = row.tipo.trim();
    const monto = parseFloat(row.monto);
//Comprobamos el tipo de transacción y actualizamos el balance y subimos el conteo correspondiente
    if (tipo === 'Crédito') {
      transactionData.balance += monto;
      transactionData.balanceCredit += monto;
      transactionData.creditCount++;
    } else if (tipo === 'Débito') {
      transactionData.balance -= monto;
      transactionData.balanceDebit += monto;
      transactionData.debitCount++;
    }
//Evaluamos si el monto de la transacción es mayor al máximo registrado y lo actualizamos
    if (monto > transactionData.maxTrans.monto) {
      transactionData.maxTrans = { id, monto };
    }
  })
  .on('end', () => {
    //Al finalizar la lectura del archivo, imprimimos el reporte de transacciones
    console.log('---------------------------------------------');
    console.log('Reporte de Transacciones');
    console.log('---------------------------------------------');
    console.log(`Balance Final: ${transactionData.balance.toFixed(2)}`);
    console.log(`Balance Crédito: ${transactionData.balanceCredit.toFixed(2)}`);
    console.log(`Balance Débito: ${transactionData.balanceDebit.toFixed(2)}`);
    console.log(`Transacción de Mayor Monto: ID ${transactionData.maxTrans.id} - ${transactionData.maxTrans.monto.toFixed(2)}`);
    console.log(`Conteo de Transacciones: Crédito: ${transactionData.creditCount} Débito: ${transactionData.debitCount}`);
  }).on('error', (err) => {
    console.error('Error al leer el archivo CSV', err);
  });
