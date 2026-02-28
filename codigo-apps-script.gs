// =======================================================
// ARCHIVO: codigo-apps-script.gs
// Este código va en Google Apps Script (dentro de Google Sheets)
// Recibe los datos de SFMC y los escribe en la hoja
// =======================================================

function doPost(e) {
  try {
    var datos = JSON.parse(e.postData.contents);

    var hoja = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Crear encabezados si la hoja está vacía
    if (hoja.getLastRow() === 0) {
      var encabezados = hoja.getRange(1, 1, 1, 5);
      encabezados.setValues([["Fecha", "Contact Key", "Email", "Nombre", "Journey"]]);
      encabezados.setBackground("#0f9d58");
      encabezados.setFontColor("#ffffff");
      encabezados.setFontWeight("bold");
    }

    // Escribir la nueva fila con los datos recibidos
    hoja.appendRow([
      new Date().toLocaleString("es-CO"),
      datos.contactKey  || "",
      datos.email       || "",
      datos.firstName   || "",
      datos.journeyName || ""
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Función para probar sin necesitar SFMC
// Seleccionala en el menú y presiona Ejecutar ▶
function probarManualmente() {
  var simulacion = {
    postData: {
      contents: JSON.stringify({
        contactKey:  "TEST-001",
        email:       "prueba@miempresa.com",
        firstName:   "Ana",
        journeyName: "Journey de Prueba"
      })
    }
  };
  var resultado = doPost(simulacion);
  Logger.log("Resultado: " + resultado.getContent());
}
