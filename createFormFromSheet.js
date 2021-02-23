/**
 * createFormFromSheet
 */
function createFormFromSheet() {

  // Obtiene la hoja (activa) donde están los datos registrados para generar la forma
  var book = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = book.getActiveSheet();
  // Obtiene la zona coloreada en la hoja (ver imagen en Readme) que corresponde a los datos necesarios para la forma
  var datos = sheet.getRange( 1, 3, 3, 1 ).getDisplayValues();

  // Crea la forma con el mombre dado en la hoja y cargado en datos[ 0 ]
  var form = FormApp.create( datos[ 0 ] );
  var item = form.addMultipleChoiceItem() 
                 .setTitle( 'Confirmar asistencia' ) 
                 .setChoiceValues( [ 'Presente','Tarde','Intermitente', 'Justificado' ] );

  console.log( `Published URL: ${form.getPublishedUrl()} `);
  console.log( `Editor URL:  ${form.getEditUrl()} `);

  // Asigan mensahe de confirmación
  form.setConfirmationMessage( 'Asistencia confirmada' );
  form.setCollectEmail( false );

  // Crea un nuevo libro para almacenar las respuestas
  var respBook = SpreadsheetApp.create( 'form_' + datos[ 0 ] );
  form.setDestination( FormApp.DestinationType.SPREADSHEET, respBook.getId() );

  // Obtiene la hoja de respuestas recien asignada - El nombre puede variar según el idioma
  // le cambia el nombre al dado en la hoja y que esta cargado en datos[ 1 ]
  var respSheet = respBook.getSheetByName( 'Form Responses 1' );
  if ( respSheet !== null ) {
    respSheet.setName( datos[ 1 ] );
  };

  // Mueve la hoja de respuestas y la forma al folder (con id) cargado en datos[ 2 ]
  var folder = DriveApp.getFolderById( datos[ 2 ] );
  var file = DriveApp.getFileById( respBook.getId() );
  file.moveTo( folder );
  // Mueve la forma
  var fileForm = DriveApp.getFileById( form.getId() );
  fileForm.moveTo( folder );

};
