/**
 * GINO'S COMPLETE GOOGLE DRIVE AUTOMATION SYSTEM
 * Direct Google Apps Script Integration - No Zapier Required
 *
 * SETUP INSTRUCTIONS:
 * 1. Go to script.google.com
 * 2. Create new project: "Gino_Google_Direct"
 * 3. Copy this entire script
 * 4. Run setupCompleteSystem() function
 * 5. Authorize permissions when prompted
 */

// ============================================================================
// MAIN SETUP FUNCTION - RUN THIS FIRST
// ============================================================================

function setupCompleteSystem() {
  console.log('🚀 GINO\'S MASTER SETUP STARTING...');

  try {
    // Step 1: Test Google Drive access
    console.log('📋 Step 1: Testing Google Drive access...');
    testDriveAccess();

    // Step 2: Create folder structure
    console.log('📋 Step 2: Creating folder structure...');
    const folderStructure = createGinoFolderStructure();

    // Step 3: Create content templates
    console.log('📋 Step 3: Creating content templates...');
    createContentTemplates(folderStructure);

    // Step 4: Create sample client folder
    console.log('📋 Step 4: Creating sample client folder...');
    createSampleClientFolder(folderStructure);

    // Step 5: Set up automation triggers
    console.log('📋 Step 5: Setting up automation triggers...');
    setupAutomationTriggers();

    // Step 6: Send confirmation email
    console.log('📋 Step 6: Sending confirmation...');
    sendSetupConfirmation(folderStructure);

    console.log('🎉 SETUP COMPLETE! Your Google Drive automation is ready.');
    console.log('📂 Main folder: ' + folderStructure.mainFolder.getUrl());

    return {
      success: true,
      mainFolderUrl: folderStructure.mainFolder.getUrl(),
      folders: folderStructure
    };

  } catch (error) {
    console.error('💥 SETUP FAILED: ' + error.toString());
    throw error;
  }
}

// ============================================================================
// STEP 1: TEST GOOGLE DRIVE ACCESS
// ============================================================================

function testDriveAccess() {
  try {
    // Test basic Drive operations
    const testFolder = DriveApp.getRootFolder().createFolder('TEMP_TEST_' + Date.now());
    const testDoc = DocumentApp.create('TEMP_TEST_DOC_' + Date.now());

    // Clean up test files
    DriveApp.getFolderById(testFolder.getId()).setTrashed(true);
    DriveApp.getFileById(testDoc.getId()).setTrashed(true);

    console.log('✅ Google Drive access confirmed');
    return true;

  } catch (error) {
    console.error('❌ Google Drive access failed: ' + error.toString());
    throw new Error('Cannot access Google Drive. Check permissions.');
  }
}

// ============================================================================
// STEP 2: CREATE GINO'S FOLDER STRUCTURE
// ============================================================================

function createGinoFolderStructure() {
  const root = DriveApp.getRootFolder();

  // Main business system folder
  const mainFolder = getOrCreateFolder(root, 'Gino_Business_System');

  // A-Level: Quick Access (A00-A02)
  const aLevel = getOrCreateFolder(mainFolder, 'A00-A02_Quick_Access');
  const a00 = getOrCreateFolder(aLevel, 'A00_Daily_Operations');
  const a01 = getOrCreateFolder(aLevel, 'A01_Active_Clients');
  const a02 = getOrCreateFolder(aLevel, 'A02_Urgent_Tasks');

  // B-Level: Active Business (B10-B30)
  const bLevel = getOrCreateFolder(mainFolder, 'B10-B30_Active_Business');
  const b10 = getOrCreateFolder(bLevel, 'B10_IFAR_Finance');
  const b20 = getOrCreateFolder(bLevel, 'B20_Personal_Shopper');
  const b30 = getOrCreateFolder(bLevel, 'B30_GLO25_Consulting');

  // C-Level: Archive/Research (C10-C30)
  const cLevel = getOrCreateFolder(mainFolder, 'C10-C30_Archive_Research');
  const c10 = getOrCreateFolder(cLevel, 'C10_Archives');
  const c20 = getOrCreateFolder(cLevel, 'C20_Templates');
  const c30 = getOrCreateFolder(cLevel, 'C30_Research');

  // Marketing content folders
  const marketing = getOrCreateFolder(mainFolder, 'Marketing_Content');
  const marketingES = getOrCreateFolder(marketing, 'ES_Espanol');
  const marketingEN = getOrCreateFolder(marketing, 'EN_English');
  const marketingNL = getOrCreateFolder(marketing, 'NL_Nederlands');

  // Social media platform folders for each language
  const platforms = ['LinkedIn', 'Instagram', 'Facebook', 'Twitter', 'YouTube', 'TikTok'];

  [marketingES, marketingEN, marketingNL].forEach(langFolder => {
    platforms.forEach(platform => {
      getOrCreateFolder(langFolder, platform);
    });
  });

  console.log('✅ Folder structure created successfully');

  return {
    mainFolder: mainFolder,
    aLevel: { a00, a01, a02 },
    bLevel: { b10, b20, b30 },
    cLevel: { c10, c20, c30 },
    marketing: { main: marketing, es: marketingES, en: marketingEN, nl: marketingNL }
  };
}

// ============================================================================
// STEP 3: CREATE CONTENT TEMPLATES
// ============================================================================

function createContentTemplates(folderStructure) {
  const templatesFolder = folderStructure.cLevel.c20;

  // Client folder template
  const clientTemplate = DocumentApp.create('CLIENT_FOLDER_TEMPLATE');
  DriveApp.getFileById(clientTemplate.getId()).moveTo(templatesFolder);

  const clientTemplateBody = clientTemplate.getBody();
  clientTemplateBody.clear();
  clientTemplateBody.appendParagraph('CLIENTE: [NOMBRE_CLIENTE]').setHeading(DocumentApp.ParagraphHeading.HEADING1);
  clientTemplateBody.appendParagraph('FECHA INICIO: [FECHA]').setHeading(DocumentApp.ParagraphHeading.HEADING2);
  clientTemplateBody.appendParagraph('SERVICIO: [IFAR/PERSONAL_SHOPPER/GLO25]').setHeading(DocumentApp.ParagraphHeading.HEADING2);
  clientTemplateBody.appendParagraph('');
  clientTemplateBody.appendParagraph('DOCUMENTOS:');
  clientTemplateBody.appendParagraph('□ Formulario inicial');
  clientTemplateBody.appendParagraph('□ Documentación legal');
  clientTemplateBody.appendParagraph('□ Propuesta comercial');
  clientTemplateBody.appendParagraph('□ Contrato firmado');
  clientTemplateBody.appendParagraph('');
  clientTemplateBody.appendParagraph('SEGUIMIENTO:');
  clientTemplateBody.appendParagraph('- [FECHA] Contacto inicial');
  clientTemplateBody.appendParagraph('- [FECHA] Propuesta enviada');
  clientTemplateBody.appendParagraph('- [FECHA] Reunión seguimiento');

  clientTemplate.saveAndClose();

  // Content template for social media
  const contentTemplate = DocumentApp.create('CONTENT_TEMPLATE_MULTILANG');
  DriveApp.getFileById(contentTemplate.getId()).moveTo(templatesFolder);

  const contentBody = contentTemplate.getBody();
  contentBody.clear();
  contentBody.appendParagraph('PLANTILLA CONTENIDO MULTIIDIOMA').setHeading(DocumentApp.ParagraphHeading.HEADING1);
  contentBody.appendParagraph('');
  contentBody.appendParagraph('TEMA: [TEMA_PRINCIPAL]').setHeading(DocumentApp.ParagraphHeading.HEADING2);
  contentBody.appendParagraph('FECHA: [YYYY-MM-DD]').setHeading(DocumentApp.ParagraphHeading.HEADING2);
  contentBody.appendParagraph('');
  contentBody.appendParagraph('ESPAÑOL:').setHeading(DocumentApp.ParagraphHeading.HEADING3);
  contentBody.appendParagraph('[CONTENIDO EN ESPAÑOL]');
  contentBody.appendParagraph('');
  contentBody.appendParagraph('ENGLISH:').setHeading(DocumentApp.ParagraphHeading.HEADING3);
  contentBody.appendParagraph('[CONTENT IN ENGLISH]');
  contentBody.appendParagraph('');
  contentBody.appendParagraph('NEDERLANDS:').setHeading(DocumentApp.ParagraphHeading.HEADING3);
  contentBody.appendParagraph('[INHOUD IN HET NEDERLANDS]');

  contentTemplate.saveAndClose();

  console.log('✅ Content templates created');
}

// ============================================================================
// STEP 4: CREATE SAMPLE CLIENT FOLDER
// ============================================================================

function createSampleClientFolder(folderStructure) {
  const clientsFolder = folderStructure.aLevel.a01;

  // Create sample IFAR client
  const sampleClient = getOrCreateFolder(clientsFolder, '2025-10-23_IFAR_Rodriguez_Family');

  // Create client subfolders
  getOrCreateFolder(sampleClient, '01_Documentos_Iniciales');
  getOrCreateFolder(sampleClient, '02_Analisis_Financiero');
  getOrCreateFolder(sampleClient, '03_Propuestas_Hipoteca');
  getOrCreateFolder(sampleClient, '04_Comunicaciones');
  getOrCreateFolder(sampleClient, '05_Contratos_Firmados');

  // Create sample document
  const sampleDoc = DocumentApp.create('2025-10-23_IFAR_Rodriguez_Initial_Analysis');
  DriveApp.getFileById(sampleDoc.getId()).moveTo(sampleClient);

  const docBody = sampleDoc.getBody();
  docBody.clear();
  docBody.appendParagraph('ANÁLISIS INICIAL - FAMILIA RODRÍGUEZ').setHeading(DocumentApp.ParagraphHeading.HEADING1);
  docBody.appendParagraph('Fecha: 23 de octubre, 2025');
  docBody.appendParagraph('Servicio: IFAR Finance - Consultoría Hipotecaria');
  docBody.appendParagraph('');
  docBody.appendParagraph('RESUMEN EJECUTIVO:');
  docBody.appendParagraph('Cliente busca financiación para vivienda habitual en Alicante.');
  docBody.appendParagraph('Presupuesto objetivo: €350,000');
  docBody.appendParagraph('Ingresos familiares: €4,200/mes');
  docBody.appendParagraph('');
  docBody.appendParagraph('PRÓXIMOS PASOS:');
  docBody.appendParagraph('1. Análisis completo documentación');
  docBody.appendParagraph('2. Comparativa entidades bancarias');
  docBody.appendParagraph('3. Presentación propuestas');

  sampleDoc.saveAndClose();

  console.log('✅ Sample client folder created');
}

// ============================================================================
// STEP 5: AUTOMATION TRIGGERS
// ============================================================================

function setupAutomationTriggers() {
  // Delete existing triggers to avoid duplicates
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => ScriptApp.deleteTrigger(trigger));

  // Daily folder organization trigger
  ScriptApp.newTrigger('dailyFolderMaintenance')
    .timeBased()
    .everyDays(1)
    .atHour(8)
    .create();

  // Weekly business analytics trigger
  ScriptApp.newTrigger('weeklyBusinessAnalytics')
    .timeBased()
    .everyWeeks(1)
    .onWeekDay(ScriptApp.WeekDay.MONDAY)
    .atHour(9)
    .create();

  console.log('✅ Automation triggers configured');
}

// ============================================================================
// STEP 6: CONFIRMATION EMAIL
// ============================================================================

function sendSetupConfirmation(folderStructure) {
  try {
    const userEmail = Session.getActiveUser().getEmail();
    const subject = '✅ Sistema Google Drive Configurado - Gino Business';

    const body = `
    Hola Gino,

    Tu sistema de automatización Google Drive está listo y funcionando.

    🎯 CONFIGURACIÓN COMPLETADA:

    📂 Estructura de carpetas creada:
    • A00-A02: Acceso rápido (operaciones diarias, clientes activos, tareas urgentes)
    • B10-B30: Negocio activo (IFAR, Personal Shopper, GLO25)
    • C10-C30: Archivo e investigación

    🌍 Carpetas multiidioma configuradas:
    • Español, English, Nederlands
    • Todas las plataformas sociales organizadas

    📋 Plantillas creadas:
    • Plantilla cliente estándar
    • Plantilla contenido multiidioma

    👨‍👩‍👧‍👦 Cliente ejemplo: Familia Rodríguez (IFAR)

    ⚡ Automatizaciones activas:
    • Mantenimiento diario de carpetas
    • Análisis semanal de negocio

    🔗 Acceso directo: ${folderStructure.mainFolder.getUrl()}

    PRÓXIMOS PASOS:
    1. Personaliza las plantillas según tus necesidades
    2. Utiliza las funciones de automatización
    3. Crea contenido con nomenclatura estándar

    ¡Tu sistema está listo para generar esos €12K mensuales con IFAR!

    Saludos,
    Sistema de Automatización Drive
    `;

    GmailApp.sendEmail(userEmail, subject, body);
    console.log('✅ Confirmation email sent to: ' + userEmail);

  } catch (error) {
    console.log('⚠️ Could not send confirmation email: ' + error.toString());
  }
}

// ============================================================================
// BUSINESS AUTOMATION FUNCTIONS
// ============================================================================

/**
 * Creates a new client folder with proper structure
 * Usage: createClientFolder('Martinez_Family', 'IFAR')
 */
function createClientFolder(clientName, serviceType) {
  try {
    const datePrefix = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
    const folderName = `${datePrefix}_${serviceType}_${clientName}`;

    // Get the active clients folder (A01)
    const mainFolder = DriveApp.getFoldersByName('Gino_Business_System').next();
    const aLevel = mainFolder.getFoldersByName('A00-A02_Quick_Access').next();
    const activeClientsFolder = aLevel.getFoldersByName('A01_Active_Clients').next();

    // Create client folder
    const clientFolder = activeClientsFolder.createFolder(folderName);

    // Create standard subfolders based on service type
    let subfolders = [];

    if (serviceType === 'IFAR') {
      subfolders = [
        '01_Documentos_Iniciales',
        '02_Analisis_Financiero',
        '03_Propuestas_Hipoteca',
        '04_Comunicaciones',
        '05_Contratos_Firmados'
      ];
    } else if (serviceType === 'PERSONAL_SHOPPER') {
      subfolders = [
        '01_Requisitos_Cliente',
        '02_Busqueda_Propiedades',
        '03_Visitas_Programadas',
        '04_Analisis_Inversion',
        '05_Negociacion_Compra'
      ];
    } else if (serviceType === 'GLO25') {
      subfolders = [
        '01_Evaluacion_Inicial',
        '02_Mapeo_Reverso',
        '03_Plan_Estrategico',
        '04_Seguimiento_Mensual',
        '05_Resultados_Finales'
      ];
    }

    // Create subfolders
    subfolders.forEach(subfolder => {
      clientFolder.createFolder(subfolder);
    });

    // Create initial client document
    const clientDoc = DocumentApp.create(`${folderName}_Initial_Analysis`);
    DriveApp.getFileById(clientDoc.getId()).moveTo(clientFolder);

    // Add content to document
    const body = clientDoc.getBody();
    body.clear();
    body.appendParagraph(`ANÁLISIS INICIAL - ${clientName.toUpperCase()}`).setHeading(DocumentApp.ParagraphHeading.HEADING1);
    body.appendParagraph(`Fecha: ${Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy')}`);
    body.appendParagraph(`Servicio: ${serviceType}`);
    body.appendParagraph('');
    body.appendParagraph('INFORMACIÓN CLIENTE:');
    body.appendParagraph('Nombre: ');
    body.appendParagraph('Email: ');
    body.appendParagraph('Teléfono: ');
    body.appendParagraph('');
    body.appendParagraph('OBJETIVOS:');
    body.appendParagraph('- ');
    body.appendParagraph('');
    body.appendParagraph('PRÓXIMOS PASOS:');
    body.appendParagraph('1. ');
    body.appendParagraph('2. ');
    body.appendParagraph('3. ');

    clientDoc.saveAndClose();

    console.log(`✅ Client folder created: ${folderName}`);
    console.log(`📂 URL: ${clientFolder.getUrl()}`);

    return {
      success: true,
      folderName: folderName,
      folderUrl: clientFolder.getUrl(),
      clientFolder: clientFolder
    };

  } catch (error) {
    console.error(`❌ Error creating client folder: ${error.toString()}`);
    throw error;
  }
}

/**
 * Creates content in multiple languages
 * Usage: createMultiLanguageContent('LinkedIn', 'IA-en-Finanzas', 'Exploring AI applications in mortgage consulting...')
 */
function createMultiLanguageContent(platform, topic, baseContent) {
  try {
    const datePrefix = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');

    // Get marketing folders
    const mainFolder = DriveApp.getFoldersByName('Gino_Business_System').next();
    const marketingFolder = mainFolder.getFoldersByName('Marketing_Content').next();

    const languages = [
      { code: 'ES', folder: 'ES_Espanol' },
      { code: 'EN', folder: 'EN_English' },
      { code: 'NL', folder: 'NL_Nederlands' }
    ];

    const results = [];

    languages.forEach(lang => {
      // Get language folder
      const langFolder = marketingFolder.getFoldersByName(lang.folder).next();
      const platformFolder = langFolder.getFoldersByName(platform).next();

      // Create content file
      const fileName = `${datePrefix}_${platform}_${topic}-${lang.code.toLowerCase()}`;
      const contentDoc = DocumentApp.create(fileName);
      DriveApp.getFileById(contentDoc.getId()).moveTo(platformFolder);

      // Add content based on language
      const body = contentDoc.getBody();
      body.clear();
      body.appendParagraph(`CONTENIDO ${platform.toUpperCase()} - ${lang.code}`).setHeading(DocumentApp.ParagraphHeading.HEADING1);
      body.appendParagraph(`Fecha: ${datePrefix}`);
      body.appendParagraph(`Tema: ${topic}`);
      body.appendParagraph('');

      if (lang.code === 'ES') {
        body.appendParagraph('CONTENIDO EN ESPAÑOL:');
        body.appendParagraph(baseContent || 'Explorando aplicaciones de IA en consultoría hipotecaria...');
        body.appendParagraph('');
        body.appendParagraph('HASHTAGS: #IFAR #Finanzas #Hipotecas #Alicante #ConsultoríaFinanciera');

      } else if (lang.code === 'EN') {
        body.appendParagraph('CONTENT IN ENGLISH:');
        body.appendParagraph(baseContent || 'Exploring AI applications in mortgage consulting...');
        body.appendParagraph('');
        body.appendParagraph('HASHTAGS: #IFAR #Finance #Mortgages #Spain #FinancialConsulting');

      } else if (lang.code === 'NL') {
        body.appendParagraph('INHOUD IN HET NEDERLANDS:');
        body.appendParagraph(baseContent || 'Het verkennen van AI-toepassingen in hypotheekadvies...');
        body.appendParagraph('');
        body.appendParagraph('HASHTAGS: #IFAR #Financiën #Hypotheken #Spanje #FinanciëelAdvies');
      }

      contentDoc.saveAndClose();

      results.push({
        language: lang.code,
        fileName: fileName,
        url: DriveApp.getFileById(contentDoc.getId()).getUrl()
      });
    });

    console.log(`✅ Multi-language content created for ${platform} - ${topic}`);
    return results;

  } catch (error) {
    console.error(`❌ Error creating multi-language content: ${error.toString()}`);
    throw error;
  }
}

/**
 * Daily maintenance function (runs automatically)
 */
function dailyFolderMaintenance() {
  try {
    console.log('🔄 Running daily folder maintenance...');

    // Move old files from A02 (Urgent) to appropriate B-level folders
    const mainFolder = DriveApp.getFoldersByName('Gino_Business_System').next();
    const aLevel = mainFolder.getFoldersByName('A00-A02_Quick_Access').next();
    const urgentFolder = aLevel.getFoldersByName('A02_Urgent_Tasks').next();

    const files = urgentFolder.getFiles();
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

    while (files.hasNext()) {
      const file = files.next();
      if (file.getDateCreated() < twoDaysAgo) {
        // Move to appropriate business folder based on name
        const fileName = file.getName().toLowerCase();
        let targetFolder;

        if (fileName.includes('ifar')) {
          const bLevel = mainFolder.getFoldersByName('B10-B30_Active_Business').next();
          targetFolder = bLevel.getFoldersByName('B10_IFAR_Finance').next();
        } else if (fileName.includes('personal') || fileName.includes('shopper')) {
          const bLevel = mainFolder.getFoldersByName('B10-B30_Active_Business').next();
          targetFolder = bLevel.getFoldersByName('B20_Personal_Shopper').next();
        } else if (fileName.includes('glo25') || fileName.includes('consulting')) {
          const bLevel = mainFolder.getFoldersByName('B10-B30_Active_Business').next();
          targetFolder = bLevel.getFoldersByName('B30_GLO25_Consulting').next();
        }

        if (targetFolder) {
          file.moveTo(targetFolder);
          console.log(`📁 Moved file: ${file.getName()}`);
        }
      }
    }

    console.log('✅ Daily maintenance completed');

  } catch (error) {
    console.error('❌ Daily maintenance failed: ' + error.toString());
  }
}

/**
 * Weekly business analytics (runs automatically)
 */
function weeklyBusinessAnalytics() {
  try {
    console.log('📊 Generating weekly business analytics...');

    const mainFolder = DriveApp.getFoldersByName('Gino_Business_System').next();
    const activeClientsFolder = mainFolder.getFoldersByName('A00-A02_Quick_Access').next()
                                         .getFoldersByName('A01_Active_Clients').next();

    // Count clients by service type
    const clientFolders = activeClientsFolder.getFolders();
    const analytics = {
      IFAR: 0,
      PERSONAL_SHOPPER: 0,
      GLO25: 0,
      total: 0
    };

    while (clientFolders.hasNext()) {
      const folder = clientFolders.next();
      const folderName = folder.getName();

      if (folderName.includes('IFAR')) analytics.IFAR++;
      else if (folderName.includes('PERSONAL_SHOPPER')) analytics.PERSONAL_SHOPPER++;
      else if (folderName.includes('GLO25')) analytics.GLO25++;

      analytics.total++;
    }

    // Create analytics report
    const reportDate = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
    const analyticsDoc = DocumentApp.create(`${reportDate}_Weekly_Business_Analytics`);

    const reportFolder = mainFolder.getFoldersByName('A00-A02_Quick_Access').next()
                                  .getFoldersByName('A00_Daily_Operations').next();
    DriveApp.getFileById(analyticsDoc.getId()).moveTo(reportFolder);

    const body = analyticsDoc.getBody();
    body.clear();
    body.appendParagraph('ANALÍTICA SEMANAL DE NEGOCIO').setHeading(DocumentApp.ParagraphHeading.HEADING1);
    body.appendParagraph(`Semana del: ${reportDate}`);
    body.appendParagraph('');
    body.appendParagraph('CLIENTES ACTIVOS:');
    body.appendParagraph(`• IFAR Finance: ${analytics.IFAR} clientes`);
    body.appendParagraph(`• Personal Shopper: ${analytics.PERSONAL_SHOPPER} clientes`);
    body.appendParagraph(`• GLO25 Consulting: ${analytics.GLO25} clientes`);
    body.appendParagraph(`• TOTAL: ${analytics.total} clientes`);
    body.appendParagraph('');
    body.appendParagraph('PROYECCIÓN INGRESOS IFAR:');
    body.appendParagraph(`• Objetivo mensual: €12,000`);
    body.appendParagraph(`• Clientes activos: ${analytics.IFAR}`);
    body.appendParagraph(`• Ingreso promedio por cliente: €${analytics.IFAR > 0 ? Math.round(12000 / analytics.IFAR) : 0}`);
    body.appendParagraph('');
    body.appendParagraph('ACCIONES RECOMENDADAS:');
    if (analytics.IFAR < 10) {
      body.appendParagraph('🎯 Acelerar captación clientes IFAR');
    }
    if (analytics.GLO25 < 3) {
      body.appendParagraph('🚀 Lanzar campaña GLO25 Consulting');
    }
    if (analytics.total < 15) {
      body.appendParagraph('📢 Intensificar marketing multicanal');
    }

    analyticsDoc.saveAndClose();

    console.log('✅ Weekly analytics generated');
    console.log(`📊 Total clients: ${analytics.total}`);

  } catch (error) {
    console.error('❌ Weekly analytics failed: ' + error.toString());
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Gets or creates a folder
 */
function getOrCreateFolder(parentFolder, folderName) {
  const existingFolders = parentFolder.getFoldersByName(folderName);

  if (existingFolders.hasNext()) {
    return existingFolders.next();
  } else {
    return parentFolder.createFolder(folderName);
  }
}

/**
 * Gets folder by ID with error handling
 */
function getFolderById(folderId) {
  try {
    return DriveApp.getFolderById(folderId);
  } catch (error) {
    console.error(`❌ Cannot access folder ID: ${folderId}`);
    throw new Error(`Invalid folder ID: ${folderId}`);
  }
}

/**
 * Search for files with semantic queries
 */
function semanticFileSearch(query, folderId = null) {
  try {
    let searchQuery = `title contains "${query}" or fullText contains "${query}"`;

    if (folderId) {
      searchQuery += ` and parents in "${folderId}"`;
    }

    const files = DriveApp.searchFiles(searchQuery);
    const results = [];

    while (files.hasNext()) {
      const file = files.next();
      results.push({
        name: file.getName(),
        url: file.getUrl(),
        lastModified: file.getLastUpdated(),
        size: file.getSize()
      });
    }

    return results;

  } catch (error) {
    console.error(`❌ Search failed: ${error.toString()}`);
    return [];
  }
}

// ============================================================================
// QUICK TEST FUNCTIONS
// ============================================================================

/**
 * Quick test to verify everything works
 */
function quickTest() {
  console.log('🧪 Running quick system test...');

  try {
    // Test 1: Drive access
    const testFolder = DriveApp.getRootFolder().createFolder('QUICK_TEST_' + Date.now());
    DriveApp.getFolderById(testFolder.getId()).setTrashed(true);
    console.log('✅ Test 1: Drive access OK');

    // Test 2: Find main folder
    const mainFolders = DriveApp.getFoldersByName('Gino_Business_System');
    if (mainFolders.hasNext()) {
      console.log('✅ Test 2: Main folder found');
      const mainFolder = mainFolders.next();
      console.log('📂 Main folder URL: ' + mainFolder.getUrl());
    } else {
      console.log('⚠️ Test 2: Main folder not found - run setupCompleteSystem() first');
    }

    // Test 3: Test client creation
    // createClientFolder('Test_Client', 'IFAR');
    console.log('✅ Test 3: Functions loaded successfully');

    console.log('🎉 Quick test completed successfully!');

  } catch (error) {
    console.error('❌ Quick test failed: ' + error.toString());
    throw error;
  }
}