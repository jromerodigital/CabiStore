/**
 * ============================================================================
 * CABI STORE PERÚ - BACKEND GOOGLE SHEETS & DASHBOARD AUTOMATIZADO
 * ============================================================================
 * Conector oficial bidireccional para tienda e-commerce COD (Contra Entrega).
 * 
 * Este script gestiona 3 hojas automáticas en tu Google Spreadsheet:
 *  1. 'Dashboard': Métricas ejecutivas, finanzas, AOV, tasa de entrega y KPIs con fórmulas.
 *  2. 'Pedidos': Registro detallado de órdenes, estados de despacho y montos.
 *  3. 'Productos': Catálogo, precios de oferta/pack x2, inventario y fotos reales.
 * ============================================================================
 */

// Menú personalizado al abrir la hoja de cálculo
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🚀 Cabi Store')
    .addItem('📊 Inicializar / Reparar Estructura y Fórmulas', 'setupFullSpreadsheet')
    .addItem('🔄 Recalcular Dashboard de KPIs', 'setupDashboardSheet')
    .addItem('ℹ️ Ayuda de Conexión con Tienda', 'showConnectionHelp')
    .addToUi();
}

function showConnectionHelp() {
  var ui = SpreadsheetApp.getUi();
  ui.alert(
    'Conexión Cabi Store',
    'Para conectar este backend con tu tienda:\n\n' +
    '1. Ve a "Implementar > Administrar implementaciones" o "Nueva implementación".\n' +
    '2. Tipo: "Aplicación web".\n' +
    '3. Quién tiene acceso: "Cualquier persona" (Anyone).\n' +
    '4. Copia la URL terminada en "/exec".\n' +
    '5. Pégala en tu panel admin en: Conectar Google Sheets > Guardar y Conectar.',
    ui.ButtonSet.OK
  );
}

/**
 * Endpoint GET: Permite a la tienda leer pedidos y productos en tiempo real.
 */
function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ensureSheetsStructure(ss);

  var ordersSheet = ss.getSheetByName('Pedidos');
  var productsSheet = ss.getSheetByName('Productos');

  var orders = readAllOrders(ordersSheet);
  var products = readAllProducts(productsSheet);

  var output = {
    ok: true,
    store: 'Cabi Store Perú',
    timestamp: new Date().toISOString(),
    totalOrders: orders.length,
    totalProducts: products.length,
    orders: orders,
    products: products
  };

  return ContentService.createTextOutput(JSON.stringify(output))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Endpoint POST: Recibe pedidos nuevos de la tienda y actualizaciones del Admin.
 */
function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ensureSheetsStructure(ss);

  var ordersSheet = ss.getSheetByName('Pedidos');
  var productsSheet = ss.getSheetByName('Productos');

  var body = {};
  try {
    body = JSON.parse(e.postData.contents || '{}');
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'JSON malformado' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var action = body.action || 'create';

  // Sincronización de Pedidos
  if (action === 'create' || action === 'update') {
    upsertOrderRow(ordersSheet, body.order);
  } else if (action === 'delete' && body.id) {
    deleteRowById(ordersSheet, body.id);
  } else if (action === 'sync_all' && Array.isArray(body.orders)) {
    body.orders.forEach(function(o) {
      upsertOrderRow(ordersSheet, o);
    });
  } 
  // Sincronización de Productos (Mini CRM)
  else if (action === 'create_product' || action === 'update_product') {
    upsertProductRow(productsSheet, body.product);
  } else if (action === 'delete_product' && body.id) {
    deleteRowById(productsSheet, body.id);
  } else if (action === 'sync_products' && Array.isArray(body.products)) {
    body.products.forEach(function(p) {
      upsertProductRow(productsSheet, p);
    });
  } else if (action === 'setup') {
    setupFullSpreadsheet();
  }

  return ContentService.createTextOutput(JSON.stringify({
    ok: true,
    action: action,
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Configuración maestra de las 3 hojas con encabezados, formatos y fórmulas.
 */
function setupFullSpreadsheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ensureSheetsStructure(ss);
  cleanDefaultEmptySheet(ss);
  SpreadsheetApp.flush();
  try {
    SpreadsheetApp.getActiveSpreadsheet().toast('✅ Estructura y fórmulas configuradas con éxito.', 'Cabi Store', 5);
  } catch (e) {}
}

function ensureSheetsStructure(ss) {
  // 1. Hoja Pedidos
  var orderHeaders = [
    'ID Pedido', 'Fecha / Hora', 'Estado', 'Cliente', 'DNI / CE', 
    'Teléfono WhatsApp', 'Departamento', 'Provincia', 'Distrito', 
    'Dirección Completa', 'Referencia', 'Artículos Comprados', 
    'Total a Cobrar (S/.)', 'Método Envío', 'JSON_RAW'
  ];
  var ordersSheet = getOrCreateSheet(ss, 'Pedidos', orderHeaders, '#0f172a');
  applyOrdersValidation(ordersSheet);
  SpreadsheetApp.flush();

  // 2. Hoja Productos
  var productHeaders = [
    'ID Producto', 'Título del Producto', 'Marca', 'Categoría', 
    'Precio Venta (S/.)', 'Precio Regular (S/.)', 'Precio Pack x2 (S/.)', 
    'Stock', 'Estado', 'Foto Portada (URL)', 'Total Fotos', 
    'Descripción Resumen', 'JSON_RAW'
  ];
  var productsSheet = getOrCreateSheet(ss, 'Productos', productHeaders, '#065f46');
  applyProductsValidation(productsSheet);
  SpreadsheetApp.flush();

  // 3. Hoja Dashboard con fórmulas nativas
  setupDashboardSheet();
  SpreadsheetApp.flush();
}

/**
 * Elimina la "Hoja 1" o "Sheet1" vacía inicial que crea Google Sheets automáticamente.
 */
function cleanDefaultEmptySheet(ss) {
  var defaultNames = ['Hoja 1', 'Sheet1'];
  defaultNames.forEach(function(name) {
    var s = ss.getSheetByName(name);
    if (s && ss.getSheets().length > 1 && s.getLastRow() <= 1) {
      try {
        ss.deleteSheet(s);
      } catch (e) {}
    }
  });
}

/**
 * Genera el Dashboard Ejecutivo con fórmulas nativas de Google Sheets.
 */
function setupDashboardSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Dashboard');
  if (!sheet) {
    sheet = ss.insertSheet('Dashboard', 0);
  } else {
    try {
      sheet.getRange('A1:G30').breakApart();
    } catch (e) {}
    sheet.clear();
  }

  // Título principal
  sheet.getRange('A1:G1').merge()
    .setValue('📊 CABI STORE PERÚ — TABLERO DE CONTROL & MÉTRICAS E-COMMERCE')
    .setFontWeight('bold')
    .setFontSize(14)
    .setBackground('#0f172a')
    .setFontColor('#ffffff')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle');
  sheet.setRowHeight(1, 40);

  sheet.getRange('A2:G2').merge()
    .setValue('Resumen financiero, logística COD e inventario sincronizado en tiempo real.')
    .setFontStyle('italic')
    .setFontSize(10)
    .setBackground('#f8fafc')
    .setFontColor('#64748b')
    .setHorizontalAlignment('center');
  sheet.setRowHeight(2, 24);

  // SECCIÓN 1: FINANZAS Y FACTURACIÓN
  sheet.getRange('A4:G4').merge()
    .setValue('💰 1. MÉTRICAS FINANCIERAS & CONVERSIÓN')
    .setFontWeight('bold')
    .setFontSize(11)
    .setBackground('#e2e8f0')
    .setFontColor('#0f172a');

  var finHeaders = ['Facturado Bruto (S/.)', 'Cobrado Efectivo (S/.)', 'Ticket Promedio (AOV)', 'Tasa Entrega Efectiva'];
  for (var i = 0; i < finHeaders.length; i++) {
    sheet.getRange(5, i + 1).setValue(finHeaders[i]).setFontWeight('bold').setFontSize(9).setBackground('#f1f5f9');
  }

  // Fórmulas financieras vinculadas a la hoja 'Pedidos' (con formato de soles seguro con comillas dobles)
  sheet.getRange('A6').setFormula('=IFERROR(SUM(Pedidos!M2:M), 0)').setNumberFormat('"S/. "#,##0.00').setFontWeight('bold').setFontSize(13);
  sheet.getRange('B6').setFormula('=IFERROR(SUMIF(Pedidos!C:C, "Entregado", Pedidos!M:M), 0)').setNumberFormat('"S/. "#,##0.00').setFontWeight('bold').setFontSize(13).setFontColor('#059669');
  sheet.getRange('C6').setFormula('=IFERROR(AVERAGEIF(Pedidos!C:C, "<>Cancelado", Pedidos!M:M), 0)').setNumberFormat('"S/. "#,##0.00').setFontWeight('bold').setFontSize(13);
  sheet.getRange('D6').setFormula('=IFERROR(COUNTIF(Pedidos!C:C, "Entregado") / MAX(1, (COUNTIF(Pedidos!C:C, "Entregado") + COUNTIF(Pedidos!C:C, "Cancelado"))), 0)').setNumberFormat('0.0%').setFontWeight('bold').setFontSize(13).setFontColor('#2563eb');

  // SECCIÓN 2: LOGÍSTICA & ESTADOS DE PEDIDOS COD
  sheet.getRange('A8:G8').merge()
    .setValue('📦 2. GESTIÓN DE PEDIDOS & LOGÍSTICA CONTRA ENTREGA')
    .setFontWeight('bold')
    .setFontSize(11)
    .setBackground('#e2e8f0')
    .setFontColor('#0f172a');

  var logHeaders = ['Total Pedidos', 'Pendientes', 'En Preparación', 'Despachados', 'Entregados', 'Cancelados'];
  for (var j = 0; j < logHeaders.length; j++) {
    sheet.getRange(9, j + 1).setValue(logHeaders[j]).setFontWeight('bold').setFontSize(9).setBackground('#f1f5f9');
  }

  sheet.getRange('A10').setFormula('=IFERROR(COUNTA(Pedidos!A2:A), 0)').setFontWeight('bold').setFontSize(13);
  sheet.getRange('B10').setFormula('=COUNTIF(Pedidos!C:C, "Pendiente")').setFontWeight('bold').setFontSize(13).setFontColor('#d97706');
  sheet.getRange('C10').setFormula('=COUNTIF(Pedidos!C:C, "En Preparación")').setFontWeight('bold').setFontSize(13).setFontColor('#2563eb');
  sheet.getRange('D10').setFormula('=COUNTIF(Pedidos!C:C, "Despachado")').setFontWeight('bold').setFontSize(13).setFontColor('#7c3aed');
  sheet.getRange('E10').setFormula('=COUNTIF(Pedidos!C:C, "Entregado")').setFontWeight('bold').setFontSize(13).setFontColor('#059669');
  sheet.getRange('F10').setFormula('=COUNTIF(Pedidos!C:C, "Cancelado")').setFontWeight('bold').setFontSize(13).setFontColor('#dc2626');

  // SECCIÓN 3: INVENTARIO & CATÁLOGO (MINI CRM)
  sheet.getRange('A12:G12').merge()
    .setValue('🏷️ 3. INVENTARIO & CONTROL DE CATÁLOGO')
    .setFontWeight('bold')
    .setFontSize(11)
    .setBackground('#e2e8f0')
    .setFontColor('#0f172a');

  var invHeaders = ['Total Modelos', 'En Stock Disponible', 'Modelos Agotados', 'Unidades Totales'];
  for (var k = 0; k < invHeaders.length; k++) {
    sheet.getRange(13, k + 1).setValue(invHeaders[k]).setFontWeight('bold').setFontSize(9).setBackground('#f1f5f9');
  }

  sheet.getRange('A14').setFormula('=IFERROR(COUNTA(Productos!A2:A), 0)').setFontWeight('bold').setFontSize(13);
  sheet.getRange('B14').setFormula('=COUNTIF(Productos!I:I, "Disponible")').setFontWeight('bold').setFontSize(13).setFontColor('#059669');
  sheet.getRange('C14').setFormula('=COUNTIF(Productos!I:I, "Agotado")').setFontWeight('bold').setFontSize(13).setFontColor('#dc2626');
  sheet.getRange('D14').setFormula('=IFERROR(SUM(Productos!H2:H), 0)').setFontWeight('bold').setFontSize(13);
}

/**
 * Validador desplegable de estados para la hoja Pedidos.
 */
function applyOrdersValidation(sheet) {
  try {
    var maxRows = sheet.getMaxRows();
    if (maxRows > 1) {
      var targetRows = Math.min(maxRows - 1, 500);
      var rule = SpreadsheetApp.newDataValidation()
        .requireValueInList(['Pendiente', 'En Preparación', 'Despachado', 'Entregado', 'Cancelado'], true)
        .setAllowInvalid(false)
        .build();
      sheet.getRange(2, 3, targetRows, 1).setDataValidation(rule);
    }
  } catch (err) {
    Logger.log('Validation Pedidos: ' + err);
  }
}

/**
 * Validador desplegable de estados para la hoja Productos.
 */
function applyProductsValidation(sheet) {
  try {
    var maxRows = sheet.getMaxRows();
    if (maxRows > 1) {
      var targetRows = Math.min(maxRows - 1, 300);
      var rule = SpreadsheetApp.newDataValidation()
        .requireValueInList(['Disponible', 'Agotado'], true)
        .setAllowInvalid(false)
        .build();
      sheet.getRange(2, 9, targetRows, 1).setDataValidation(rule);
    }
  } catch (err) {
    Logger.log('Validation Productos: ' + err);
  }
}

function getOrCreateSheet(ss, name, headers, headerColor) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    var range = sheet.getRange(1, 1, 1, headers.length);
    range.setBackground(headerColor || '#0f172a')
      .setFontColor('#ffffff')
      .setFontWeight('bold')
      .setFontSize(10)
      .setHorizontalAlignment('center');
    try {
      sheet.setFrozenRows(1);
      sheet.setRowHeight(1, 32);
    } catch (e) {}
  }
  return sheet;
}

function upsertOrderRow(sheet, o) {
  if (!o || !o.id) return;
  var items = (o.items || []).map(function(item) {
    return (item.quantity || 1) + 'x ' + (item.title || item.id);
  }).join('; ');

  var c = o.customer || {};
  var total = Number(o.total || 0);

  var rowData = [
    o.id,
    o.createdAt || new Date().toISOString(),
    o.status || 'Pendiente',
    c.name || '',
    c.dni || '',
    c.phone || '',
    c.department || '',
    c.province || '',
    c.district || '',
    c.address || '',
    c.reference || '',
    items,
    total,
    (o.shippingRate && o.shippingRate.name) || 'Delivery',
    JSON.stringify(o)
  ];

  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === String(o.id).trim()) {
      sheet.getRange(i + 1, 1, 1, rowData.length).setValues([rowData]);
      try { sheet.getRange(i + 1, 13).setNumberFormat('"S/. "#,##0.00'); } catch (e) {}
      return;
    }
  }

  sheet.appendRow(rowData);
  try { sheet.getRange(sheet.getLastRow(), 13).setNumberFormat('"S/. "#,##0.00'); } catch (e) {}
}

function upsertProductRow(sheet, p) {
  if (!p || !p.id) return;

  var images = Array.isArray(p.images) ? p.images : (p.image ? [p.image] : []);
  var mainImage = images[0] || '';
  var totalPhotos = images.length;

  var rowData = [
    p.id,
    p.title || '',
    p.brand || 'CABI STORE',
    p.category || 'cargadores',
    Number(p.price || 0),
    Number(p.oldPrice || 0),
    Number(p.bundlePrice || 0),
    Number(p.stockLeft !== undefined ? p.stockLeft : 10),
    p.isSoldOut ? 'Agotado' : 'Disponible',
    mainImage,
    totalPhotos,
    p.description || '',
    JSON.stringify(p)
  ];

  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === String(p.id).trim()) {
      sheet.getRange(i + 1, 1, 1, rowData.length).setValues([rowData]);
      try { sheet.getRange(i + 1, 5, 1, 3).setNumberFormat('"S/. "#,##0.00'); } catch (e) {}
      return;
    }
  }

  sheet.appendRow(rowData);
  try { sheet.getRange(sheet.getLastRow(), 5, 1, 3).setNumberFormat('"S/. "#,##0.00'); } catch (e) {}
}

function deleteRowById(sheet, id) {
  var data = sheet.getDataRange().getValues();
  for (var i = data.length - 1; i >= 1; i--) {
    if (String(data[i][0]).trim() === String(id).trim()) {
      sheet.deleteRow(i + 1);
      return;
    }
  }
}

function readAllOrders(sheet) {
  var data = sheet.getDataRange().getValues();
  var list = [];
  for (var i = 1; i < data.length; i++) {
    var rawJson = data[i][14];
    if (rawJson) {
      try {
        var parsed = JSON.parse(rawJson);
        parsed.status = data[i][2] || parsed.status; // Respetar estado si se cambió en Sheets
        list.push(parsed);
        continue;
      } catch (err) {}
    }
    // Reconstrucción de respaldo si no hay JSON
    if (data[i][0]) {
      list.push({
        id: data[i][0],
        createdAt: data[i][1],
        status: data[i][2],
        customer: { name: data[i][3], dni: data[i][4], phone: data[i][5], department: data[i][6], province: data[i][7], district: data[i][8], address: data[i][9], reference: data[i][10] },
        total: Number(data[i][12] || 0)
      });
    }
  }
  return list;
}

function readAllProducts(sheet) {
  var data = sheet.getDataRange().getValues();
  var list = [];
  for (var i = 1; i < data.length; i++) {
    var rawJson = data[i][12];
    if (rawJson) {
      try {
        var parsed = JSON.parse(rawJson);
        parsed.isSoldOut = (data[i][8] === 'Agotado');
        parsed.stockLeft = Number(data[i][7] || 0);
        list.push(parsed);
        continue;
      } catch (err) {}
    }
    if (data[i][0]) {
      list.push({
        id: data[i][0],
        title: data[i][1],
        brand: data[i][2],
        category: data[i][3],
        price: Number(data[i][4] || 0),
        oldPrice: Number(data[i][5] || 0),
        bundlePrice: Number(data[i][6] || 0),
        stockLeft: Number(data[i][7] || 0),
        isSoldOut: data[i][8] === 'Agotado',
        images: [data[i][9]]
      });
    }
  }
  return list;
}
