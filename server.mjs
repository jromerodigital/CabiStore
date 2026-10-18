import http from 'node:http';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 8090;
const HOST = process.env.HOST || '0.0.0.0';
const DATA_DIR = path.join(__dirname, 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const SITE_DESIGN_FILE = path.join(DATA_DIR, 'site_design.json');
const UPLOADS_DIR = path.join(__dirname, 'assets', 'uploads');

// ===================== CREDENCIALES ADMIN (Configurables en Railway) =====================
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'vitacore2026';
const ADMIN_SECRET = process.env.ADMIN_SECRET || crypto.createHash('sha256').update(`vitacore-secret-${ADMIN_USER}-${ADMIN_PASS}`).digest('hex');
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 horas

// ===================== CATÁLOGO Y REGLAS DE NEGOCIO (Validación Server-Side) =====================
const FREE_SHIPPING_THRESHOLD = 200;

const COUPONS = {
  VITACORE10: { code: 'VITACORE10', discount: 10, description: 'S/. 10.00 de descuento' },
  BOOST10: { code: 'BOOST10', discount: 10, description: 'S/. 10.00 de descuento' }
};

const PRODUCTS_CATALOG = new Map([
  ['pistola-masaje-promax', {
    id: 'pistola-masaje-promax',
    title: 'Pistola de Masaje Percusión VITACORE Pro Max + 6 Cabezales de regalo 🎁',
    price: 169.00,
    bundlePrice: 319.00
  }],
  ['masajeador-manos-terapia', {
    id: 'masajeador-manos-terapia',
    title: 'Masajeador de manos + Muñequera de compresión de regalo 🎁',
    price: 179.00,
    bundlePrice: 339.00
  }],
  ['masajeador-cervical-4d', {
    id: 'masajeador-cervical-4d',
    title: 'Masajeador Cervical Térmico 4D Shiatsu para Cuello y Espalda',
    price: 139.00,
    bundlePrice: 259.00
  }],
  ['masajeador-ojos-presion', {
    id: 'masajeador-ojos-presion',
    title: 'Masajeador de ojos inteligente con termoterapia y música Bluetooth',
    price: 139.00,
    bundlePrice: 259.00
  }],
  ['dilatador-nasal-magnetico', {
    id: 'dilatador-nasal-magnetico',
    title: 'Dilatador nasal magnético ergonómico anti-ronquidos (Pack x 2)',
    price: 79.00,
    bundlePrice: 145.00
  }],
  ['smartwatch-ultra-amoled', {
    id: 'smartwatch-ultra-amoled',
    title: 'Smartwatch VITACORE Ultra Amoled + Correa deportiva extra de regalo ⌚',
    price: 189.00,
    bundlePrice: 350.00
  }],
  ['smartwatch-elegance-slim', {
    id: 'smartwatch-elegance-slim',
    title: 'Smartwatch VITACORE Elegance Slim (Batería 10 días + 100 Modos Sport)',
    price: 149.00,
    bundlePrice: 279.00
  }],
  ['audifonos-pro-anc', {
    id: 'audifonos-pro-anc',
    title: 'Audífonos Inalámbricos VITACORE SoundPro con Cancelación de Ruido',
    price: 149.00,
    bundlePrice: 279.00
  }],
  ['auriculares-air-sport', {
    id: 'auriculares-air-sport',
    title: 'Auriculares Inalámbricos Air Pro con Estuche de Carga Inalámbrica',
    price: 119.00,
    bundlePrice: 219.00
  }],
  ['parlante-smarthome-alexa', {
    id: 'parlante-smarthome-alexa',
    title: 'Altavoz Inteligente Smart Home con Control de Voz & Reloj LED',
    price: 139.00,
    bundlePrice: 259.00
  }],
  ['difusor-ultrasonico-smart', {
    id: 'difusor-ultrasonico-smart',
    title: 'Difusor Aromático Ultrasónico Smart Home con Luz Ambiente y App WiFi',
    price: 119.00,
    bundlePrice: 219.00
  }]
]);

// ===================== ESTADO EN MEMORIA Y PERSISTENCIA ASÍNCRONA =====================
let ordersMemory = [];
let productsMemory = [];
let siteDesignMemory = {
  slides: [],
  categories: [],
  announcements: []
};
let runtimeConfig = {
  sheetsWebhookUrl: process.env.GOOGLE_SHEETS_WEBHOOK_URL || '',
  lastSheetsSync: null,
  lastSheetsError: null
};

let writeQueuePromise = Promise.resolve();

function persistProductsAsync() {
  const snapshot = JSON.stringify(productsMemory, null, 2);
  writeQueuePromise = writeQueuePromise
    .then(() => fsp.writeFile(PRODUCTS_FILE, snapshot, 'utf-8'))
    .catch(err => console.error('[Storage] Error guardando products.json:', err));
  return writeQueuePromise;
}

function persistSiteDesignAsync() {
  siteDesignMemory.updatedAt = new Date().toISOString();
  const snapshot = JSON.stringify(siteDesignMemory, null, 2);
  writeQueuePromise = writeQueuePromise
    .then(() => fsp.writeFile(SITE_DESIGN_FILE, snapshot, 'utf-8'))
    .catch(err => console.error('[Storage] Error guardando site_design.json:', err));
  return writeQueuePromise;
}

function syncProductsCatalogMap() {
  PRODUCTS_CATALOG.clear();
  for (const p of productsMemory) {
    if (!p || !p.id) continue;
    PRODUCTS_CATALOG.set(p.id, {
      id: p.id,
      title: p.title,
      price: Number(p.price) || 0,
      bundlePrice: Number(p.bundlePrice) || (Number(p.price) * 1.8)
    });
  }
}

async function initStorage() {
  try {
    await fsp.mkdir(DATA_DIR, { recursive: true });

    if (fs.existsSync(CONFIG_FILE)) {
      const rawCfg = await fsp.readFile(CONFIG_FILE, 'utf-8');
      const parsedCfg = JSON.parse(rawCfg || '{}');
      if (!process.env.GOOGLE_SHEETS_WEBHOOK_URL && parsedCfg.sheetsWebhookUrl) {
        runtimeConfig.sheetsWebhookUrl = parsedCfg.sheetsWebhookUrl;
      }
    }

    if (fs.existsSync(ORDERS_FILE)) {
      const rawOrders = await fsp.readFile(ORDERS_FILE, 'utf-8');
      const parsed = JSON.parse(rawOrders || '[]');
      if (Array.isArray(parsed)) {
        ordersMemory = parsed;
      }
    } else {
      await fsp.writeFile(ORDERS_FILE, '[]', 'utf-8');
    }

    if (fs.existsSync(PRODUCTS_FILE)) {
      const rawProducts = await fsp.readFile(PRODUCTS_FILE, 'utf-8');
      const parsed = JSON.parse(rawProducts || '[]');
      if (Array.isArray(parsed) && parsed.length > 0) {
        productsMemory = parsed;
      }
    }
    syncProductsCatalogMap();

    if (fs.existsSync(SITE_DESIGN_FILE)) {
      const rawDesign = await fsp.readFile(SITE_DESIGN_FILE, 'utf-8');
      const parsedDesign = JSON.parse(rawDesign || '{}');
      if (parsedDesign && typeof parsedDesign === 'object') {
        siteDesignMemory = {
          slides: Array.isArray(parsedDesign.slides) ? parsedDesign.slides : [],
          categories: Array.isArray(parsedDesign.categories) ? parsedDesign.categories : [],
          announcements: Array.isArray(parsedDesign.announcements) ? parsedDesign.announcements : [],
          updatedAt: parsedDesign.updatedAt || new Date().toISOString()
        };
      }
    }

    // Si hay Google Sheets configurado, hidratar/sincronizar al arrancar (útil tras reinicios en Railway)
    if (runtimeConfig.sheetsWebhookUrl) {
      pullFromGoogleSheets().catch(err => {
        console.warn('[Google Sheets] Aviso en sincronización inicial:', err.message);
      });
    }
  } catch (err) {
    console.error('[Storage] Error inicializando datos:', err);
  }
}

function persistOrdersAsync() {
  const snapshot = JSON.stringify(ordersMemory, null, 2);
  writeQueuePromise = writeQueuePromise
    .then(() => fsp.writeFile(ORDERS_FILE, snapshot, 'utf-8'))
    .catch(err => console.error('[Storage] Error guardando orders.json:', err));
  return writeQueuePromise;
}

async function saveRuntimeConfig() {
  try {
    await fsp.writeFile(CONFIG_FILE, JSON.stringify({
      sheetsWebhookUrl: runtimeConfig.sheetsWebhookUrl,
      updatedAt: new Date().toISOString()
    }, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Storage] Error guardando config.json:', err);
  }
}

// ===================== CONECTOR BIDIRECCIONAL GOOGLE SHEETS =====================
async function pushToGoogleSheets(action, payload) {
  const url = runtimeConfig.sheetsWebhookUrl;
  if (!url) return { skipped: true };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...payload }),
      redirect: 'follow',
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    runtimeConfig.lastSheetsSync = new Date().toISOString();
    runtimeConfig.lastSheetsError = null;
    return { ok: true };
  } catch (err) {
    runtimeConfig.lastSheetsError = err.message;
    console.warn(`[Google Sheets] Error enviando acción "${action}":`, err.message);
    return { ok: false, error: err.message };
  }
}

async function pullFromGoogleSheets() {
  const url = runtimeConfig.sheetsWebhookUrl;
  if (!url) return { ok: false, error: 'URL de Google Sheets no configurada' };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    const separator = url.includes('?') ? '&' : '?';
    const response = await fetch(`${url}${separator}action=list`, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    if (Array.isArray(data.orders) && data.orders.length > 0) {
      // Combinar pedidos remotos de Sheets con los locales por ID (priorizando el más reciente)
      const byId = new Map();
      for (const o of ordersMemory) {
        if (o && o.id) byId.set(o.id, o);
      }
      for (const remoteOrder of data.orders) {
        if (!remoteOrder || !remoteOrder.id) continue;
        const local = byId.get(remoteOrder.id);
        if (!local) {
          byId.set(remoteOrder.id, remoteOrder);
        } else {
          const remoteTime = new Date(remoteOrder.updatedAt || remoteOrder.createdAt || 0).getTime();
          const localTime = new Date(local.updatedAt || local.createdAt || 0).getTime();
          if (remoteTime >= localTime) {
            byId.set(remoteOrder.id, remoteOrder);
          }
        }
      }
      ordersMemory = Array.from(byId.values()).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      await persistOrdersAsync();
    }

    runtimeConfig.lastSheetsSync = new Date().toISOString();
    runtimeConfig.lastSheetsError = null;
    return { ok: true, count: ordersMemory.length };
  } catch (err) {
    runtimeConfig.lastSheetsError = err.message;
    return { ok: false, error: err.message };
  }
}

// ===================== AUTENTICACIÓN ADMIN (HMAC TOKEN + COOKIE) =====================
function createAdminToken(username) {
  const payload = Buffer.from(JSON.stringify({
    sub: username,
    exp: Date.now() + TOKEN_TTL_MS
  })).toString('base64url');

  const sig = crypto
    .createHmac('sha256', ADMIN_SECRET)
    .update(payload)
    .digest('base64url');

  return `${payload}.${sig}`;
}

function verifyAdminToken(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return null;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return null;

  const expectedSig = crypto
    .createHmac('sha256', ADMIN_SECRET)
    .update(payload)
    .digest('base64url');

  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'));
    if (!data.exp || Date.now() > data.exp) return null;
    return data;
  } catch {
    return null;
  }
}

function parseCookies(cookieHeader = '') {
  const out = {};
  cookieHeader.split(';').forEach(pair => {
    const idx = pair.indexOf('=');
    if (idx > -1) {
      const k = pair.slice(0, idx).trim();
      const v = pair.slice(idx + 1).trim();
      out[k] = decodeURIComponent(v);
    }
  });
  return out;
}

function getAuthenticatedAdmin(req) {
  const authHeader = req.headers.authorization || '';
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim();
    const verified = verifyAdminToken(token);
    if (verified) return verified;
  }
  const cookies = parseCookies(req.headers.cookie || '');
  if (cookies.vitacore_admin_token) {
    return verifyAdminToken(cookies.vitacore_admin_token);
  }
  return null;
}

function safeCompare(a, b) {
  const hashA = crypto.createHash('sha256').update(String(a)).digest();
  const hashB = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(hashA, hashB) && String(a) === String(b);
}

// ===================== RATE LIMITING (ANTI-SATURACIÓN Y ANTI-BOTS) =====================
const rateBuckets = new Map();

function checkRateLimit(key, maxRequests, windowMs) {
  const now = Date.now();
  const record = rateBuckets.get(key);
  if (!record || now > record.resetAt) {
    rateBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (record.count >= maxRequests) {
    return false;
  }
  record.count += 1;
  return true;
}

setInterval(() => {
  const now = Date.now();
  for (const [key, val] of rateBuckets.entries()) {
    if (now > val.resetAt) rateBuckets.delete(key);
  }
}, 5 * 60 * 1000).unref();

function getClientIp(req) {
  const xff = req.headers['x-forwarded-for'];
  if (typeof xff === 'string' && xff.length > 0) {
    return xff.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || 'unknown';
}

// ===================== HELPERS HTTP Y COMPRESIÓN GZIP =====================
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.json': 'application/json; charset=utf-8',
  '.ico': 'image/x-icon'
};

const compressibleExts = new Set(['.html', '.css', '.js', '.json', '.svg']);

function sendJson(req, res, statusCode, payload, extraHeaders = {}) {
  const raw = JSON.stringify(payload);
  const acceptEncoding = req.headers['accept-encoding'] || '';
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...extraHeaders
  };

  if (acceptEncoding.includes('gzip') && raw.length > 512) {
    zlib.gzip(Buffer.from(raw, 'utf-8'), (err, compressed) => {
      if (err) {
        res.writeHead(statusCode, headers);
        res.end(raw);
        return;
      }
      res.writeHead(statusCode, { ...headers, 'Content-Encoding': 'gzip' });
      res.end(compressed);
    });
  } else {
    res.writeHead(statusCode, headers);
    res.end(raw);
  }
}

function readJsonBody(req, maxBytes = 64 * 1024) {
  return new Promise((resolve, reject) => {
    let body = '';
    let size = 0;
    req.on('data', chunk => {
      size += chunk.length;
      if (size > maxBytes) {
        reject(new Error('Payload demasiado grande'));
        req.destroy();
        return;
      }
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch {
        reject(new Error('JSON inválido'));
      }
    });
    req.on('error', reject);
  });
}

function sanitizeText(val, maxLen = 200) {
  return String(val ?? '').trim().slice(0, maxLen);
}

// ===================== SERVIDOR HTTP PRINCIPAL =====================
await initStorage();

const server = http.createServer(async (req, res) => {
  // Cabeceras de Seguridad
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname;
  try {
    pathname = decodeURIComponent(parsedUrl.pathname);
  } catch {
    sendJson(req, res, 400, { success: false, error: 'URL inválida' });
    return;
  }

  const clientIp = getClientIp(req);

  // ===================== 0. HEALTHCHECK PARA RAILWAY =====================
  if (req.method === 'GET' && pathname === '/api/health') {
    sendJson(req, res, 200, {
      status: 'ok',
      service: 'vitacore-store',
      uptime: Math.round(process.uptime()),
      timestamp: new Date().toISOString()
    });
    return;
  }

  // ===================== 1. VALIDACIÓN DE CUPONES (PÚBLICO) =====================
  if (req.method === 'POST' && pathname === '/api/coupons/validate') {
    try {
      const { code } = await readJsonBody(req);
      const normalized = sanitizeText(code, 32).toUpperCase();
      const coupon = COUPONS[normalized];
      if (!coupon) {
        sendJson(req, res, 404, { valid: false, discount: 0, message: 'El código de descuento no es válido o ha expirado.' });
        return;
      }
      sendJson(req, res, 200, {
        valid: true,
        code: coupon.code,
        discount: coupon.discount,
        message: `¡Cupón "${coupon.code}" aplicado con éxito! Descuento de S/. ${coupon.discount.toFixed(2)} en tu orden.`
      });
    } catch {
      sendJson(req, res, 400, { valid: false, discount: 0, message: 'Solicitud inválida' });
    }
    return;
  }

  // ===================== 2. AUTENTICACIÓN ADMIN =====================
  if (req.method === 'POST' && pathname === '/api/admin/login') {
    if (!checkRateLimit(`login:${clientIp}`, 10, 15 * 60 * 1000)) {
      sendJson(req, res, 429, { success: false, error: 'Demasiados intentos de inicio de sesión. Espera unos minutos.' });
      return;
    }

    try {
      const { username, password } = await readJsonBody(req);
      const validUser = safeCompare(sanitizeText(username, 64), ADMIN_USER);
      const validPass = safeCompare(String(password ?? ''), ADMIN_PASS);

      if (!validUser || !validPass) {
        sendJson(req, res, 401, { success: false, error: 'Usuario o contraseña incorrectos.' });
        return;
      }

      const token = createAdminToken(ADMIN_USER);
      const cookie = `vitacore_admin_token=${encodeURIComponent(token)}; HttpOnly; Path=/; Max-Age=${Math.floor(TOKEN_TTL_MS / 1000)}; SameSite=Lax`;
      sendJson(req, res, 200, {
        success: true,
        user: ADMIN_USER,
        token
      }, { 'Set-Cookie': cookie });
    } catch {
      sendJson(req, res, 400, { success: false, error: 'Datos de inicio de sesión inválidos.' });
    }
    return;
  }

  if (req.method === 'POST' && pathname === '/api/admin/logout') {
    const expiredCookie = 'vitacore_admin_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax';
    sendJson(req, res, 200, { success: true }, { 'Set-Cookie': expiredCookie });
    return;
  }

  if (req.method === 'GET' && pathname === '/api/admin/session') {
    const admin = getAuthenticatedAdmin(req);
    if (!admin) {
      sendJson(req, res, 401, { authenticated: false });
      return;
    }
    sendJson(req, res, 200, {
      authenticated: true,
      user: admin.sub,
      sheetsConfigured: Boolean(runtimeConfig.sheetsWebhookUrl),
      lastSheetsSync: runtimeConfig.lastSheetsSync,
      lastSheetsError: runtimeConfig.lastSheetsError
    });
    return;
  }

  // ===================== 3. CONFIGURACIÓN Y SYNC GOOGLE SHEETS (SOLO ADMIN) =====================
  if (pathname === '/api/admin/sheets-config') {
    const admin = getAuthenticatedAdmin(req);
    if (!admin) {
      sendJson(req, res, 401, { success: false, error: 'No autorizado' });
      return;
    }

    if (req.method === 'GET') {
      sendJson(req, res, 200, {
        success: true,
        sheetsWebhookUrl: runtimeConfig.sheetsWebhookUrl,
        fromEnv: Boolean(process.env.GOOGLE_SHEETS_WEBHOOK_URL),
        lastSheetsSync: runtimeConfig.lastSheetsSync,
        lastSheetsError: runtimeConfig.lastSheetsError
      });
      return;
    }

    if (req.method === 'POST') {
      try {
        const { sheetsWebhookUrl } = await readJsonBody(req);
        const cleanUrl = sanitizeText(sheetsWebhookUrl, 500);
        if (cleanUrl && !cleanUrl.startsWith('https://script.google.com/')) {
          sendJson(req, res, 400, {
            success: false,
            error: 'La URL debe ser una aplicación web válida de Google Apps Script (https://script.google.com/macros/s/.../exec)'
          });
          return;
        }
        runtimeConfig.sheetsWebhookUrl = cleanUrl;
        await saveRuntimeConfig();

        let syncResult = null;
        if (cleanUrl) {
          syncResult = await pushToGoogleSheets('sync_all', { orders: ordersMemory });
        }
        sendJson(req, res, 200, {
          success: true,
          sheetsWebhookUrl: runtimeConfig.sheetsWebhookUrl,
          syncResult,
          lastSheetsSync: runtimeConfig.lastSheetsSync
        });
      } catch {
        sendJson(req, res, 400, { success: false, error: 'Error guardando configuración de Google Sheets' });
      }
      return;
    }
  }

  if (req.method === 'POST' && pathname === '/api/admin/sheets-sync') {
    const admin = getAuthenticatedAdmin(req);
    if (!admin) {
      sendJson(req, res, 401, { success: false, error: 'No autorizado' });
      return;
    }
    if (!runtimeConfig.sheetsWebhookUrl) {
      sendJson(req, res, 400, { success: false, error: 'Primero configura la URL de tu Google Sheets.' });
      return;
    }

    const pullRes = await pullFromGoogleSheets();
    const pushRes = await pushToGoogleSheets('sync_all', { orders: ordersMemory });
    sendJson(req, res, 200, {
      success: Boolean(pullRes.ok || pushRes.ok),
      totalOrders: ordersMemory.length,
      lastSheetsSync: runtimeConfig.lastSheetsSync,
      lastSheetsError: runtimeConfig.lastSheetsError
    });
    return;
  }

  // ===================== 3.6. REST API DE PRODUCTOS & UPLOADS (MINI CRM) =====================
  // 3.6.1 GET /api/products (Público para la tienda)
  if (req.method === 'GET' && pathname === '/api/products') {
    sendJson(req, res, 200, { success: true, products: productsMemory });
    return;
  }

  // 3.6.2 POST /api/admin/products (Crear nuevo producto)
  if (req.method === 'POST' && pathname === '/api/admin/products') {
    const admin = getAuthenticatedAdmin(req);
    if (!admin) {
      sendJson(req, res, 401, { success: false, error: 'No autorizado' });
      return;
    }
    try {
      const data = await readJsonBody(req);
      if (!data.title || data.price === undefined) {
        sendJson(req, res, 400, { success: false, error: 'El título y el precio son obligatorios.' });
        return;
      }

      const id = (data.id || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')) || `prod-${Date.now()}`;
      
      const newProduct = {
        id,
        title: sanitizeText(data.title, 200),
        brand: sanitizeText(data.brand || 'VITACORE', 80),
        category: sanitizeText(data.category || 'cargadores', 50),
        price: Number(data.price) || 0,
        oldPrice: Number(data.oldPrice) || (Number(data.price) * 1.5),
        bundlePrice: Number(data.bundlePrice) || (Number(data.price) * 1.8),
        savings: Number(data.savings) || Math.max(0, (Number(data.price) * 2) - (Number(data.bundlePrice) || 0)),
        rating: Number(data.rating) || 5.0,
        reviewsCount: Number(data.reviewsCount) || 1,
        ordersCount: Number(data.ordersCount) || 0,
        releasedAt: new Date().toISOString().split('T')[0],
        isBestSeller: Boolean(data.isBestSeller),
        isNew: Boolean(data.isNew),
        badge: sanitizeText(data.badge || 'Oferta', 40),
        isSoldOut: Boolean(data.isSoldOut),
        stockLeft: Number(data.stockLeft) || 10,
        images: Array.isArray(data.images) && data.images.length > 0 ? data.images : ['/assets/images/categoria-cargadores.png'],
        description: sanitizeText(data.description || '', 1000),
        features: Array.isArray(data.features) ? data.features : []
      };

      const existingIdx = productsMemory.findIndex(p => p.id === id);
      if (existingIdx !== -1) {
        productsMemory[existingIdx] = newProduct;
      } else {
        productsMemory.unshift(newProduct);
      }

      await persistProductsAsync();
      syncProductsCatalogMap();

      pushToGoogleSheets('create_product', { product: newProduct });
      sendJson(req, res, 201, { success: true, product: newProduct });
    } catch (err) {
      sendJson(req, res, 500, { success: false, error: 'Error al registrar el producto.' });
    }
    return;
  }

  // 3.6.3 PUT /api/admin/products/:id (Actualizar producto existente)
  if (req.method === 'PUT' && pathname.startsWith('/api/admin/products/')) {
    const admin = getAuthenticatedAdmin(req);
    if (!admin) {
      sendJson(req, res, 401, { success: false, error: 'No autorizado' });
      return;
    }
    const productId = decodeURIComponent(pathname.replace('/api/admin/products/', '')).trim();
    const index = productsMemory.findIndex(p => p.id === productId);
    if (index === -1) {
      sendJson(req, res, 404, { success: false, error: 'Producto no encontrado' });
      return;
    }

    try {
      const updates = await readJsonBody(req);
      const current = productsMemory[index];
      const updated = {
        ...current,
        title: updates.title !== undefined ? sanitizeText(updates.title, 200) : current.title,
        brand: updates.brand !== undefined ? sanitizeText(updates.brand, 80) : current.brand,
        category: updates.category !== undefined ? sanitizeText(updates.category, 50) : current.category,
        price: updates.price !== undefined ? Number(updates.price) : current.price,
        oldPrice: updates.oldPrice !== undefined ? Number(updates.oldPrice) : current.oldPrice,
        bundlePrice: updates.bundlePrice !== undefined ? Number(updates.bundlePrice) : current.bundlePrice,
        savings: updates.savings !== undefined ? Number(updates.savings) : current.savings,
        rating: updates.rating !== undefined ? Number(updates.rating) : current.rating,
        reviewsCount: updates.reviewsCount !== undefined ? Number(updates.reviewsCount) : current.reviewsCount,
        badge: updates.badge !== undefined ? sanitizeText(updates.badge, 40) : current.badge,
        isBestSeller: updates.isBestSeller !== undefined ? Boolean(updates.isBestSeller) : current.isBestSeller,
        isNew: updates.isNew !== undefined ? Boolean(updates.isNew) : current.isNew,
        isSoldOut: updates.isSoldOut !== undefined ? Boolean(updates.isSoldOut) : current.isSoldOut,
        stockLeft: updates.stockLeft !== undefined ? Number(updates.stockLeft) : current.stockLeft,
        images: Array.isArray(updates.images) && updates.images.length > 0 ? updates.images : current.images,
        description: updates.description !== undefined ? sanitizeText(updates.description, 1000) : current.description,
        features: Array.isArray(updates.features) ? updates.features : current.features,
        updatedAt: new Date().toISOString()
      };

      productsMemory[index] = updated;
      await persistProductsAsync();
      syncProductsCatalogMap();

      pushToGoogleSheets('update_product', { product: updated });
      sendJson(req, res, 200, { success: true, product: updated });
    } catch (err) {
      sendJson(req, res, 500, { success: false, error: 'Error al actualizar producto.' });
    }
    return;
  }

  // 3.6.4 DELETE /api/admin/products/:id (Eliminar producto)
  if (req.method === 'DELETE' && pathname.startsWith('/api/admin/products/')) {
    const admin = getAuthenticatedAdmin(req);
    if (!admin) {
      sendJson(req, res, 401, { success: false, error: 'No autorizado' });
      return;
    }
    const productId = decodeURIComponent(pathname.replace('/api/admin/products/', '')).trim();
    const index = productsMemory.findIndex(p => p.id === productId);
    if (index === -1) {
      sendJson(req, res, 404, { success: false, error: 'Producto no encontrado' });
      return;
    }

    productsMemory.splice(index, 1);
    await persistProductsAsync();
    syncProductsCatalogMap();

    pushToGoogleSheets('delete_product', { id: productId });
    sendJson(req, res, 200, { success: true, id: productId });
    return;
  }

  // 3.6.5 POST /api/admin/upload (Subida de fotos reales)
  if (req.method === 'POST' && pathname === '/api/admin/upload') {
    const admin = getAuthenticatedAdmin(req);
    if (!admin) {
      sendJson(req, res, 401, { success: false, error: 'No autorizado' });
      return;
    }
    try {
      const { filename, dataBase64 } = await readJsonBody(req, 10 * 1024 * 1024);
      if (!dataBase64) {
        sendJson(req, res, 400, { success: false, error: 'No se envió ninguna imagen.' });
        return;
      }
      const matches = dataBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      const buffer = matches ? Buffer.from(matches[2], 'base64') : Buffer.from(dataBase64, 'base64');
      const ext = path.extname(filename || 'foto.png').toLowerCase() || '.png';
      const safeName = `real_${Date.now()}_${crypto.randomBytes(3).toString('hex')}${ext}`;
      
      await fsp.mkdir(UPLOADS_DIR, { recursive: true });
      await fsp.writeFile(path.join(UPLOADS_DIR, safeName), buffer);

      const url = `/assets/uploads/${safeName}`;
      sendJson(req, res, 200, { success: true, url, filename: safeName });
    } catch (err) {
      sendJson(req, res, 500, { success: false, error: 'Error al procesar la imagen.' });
    }
    return;
  }

  // 3.6.6 POST /api/admin/sheets-sync-products (Sincronizar catálogo completo a Google Sheets)
  if (req.method === 'POST' && pathname === '/api/admin/sheets-sync-products') {
    const admin = getAuthenticatedAdmin(req);
    if (!admin) {
      sendJson(req, res, 401, { success: false, error: 'No autorizado' });
      return;
    }
    if (!runtimeConfig.sheetsWebhookUrl) {
      sendJson(req, res, 400, { success: false, error: 'Primero configura la URL de tu Google Sheets en Ajustes.' });
      return;
    }
    const pushRes = await pushToGoogleSheets('sync_products', { products: productsMemory });
    sendJson(req, res, 200, {
      success: Boolean(pushRes.ok),
      totalProducts: productsMemory.length,
      lastSheetsSync: runtimeConfig.lastSheetsSync,
      lastSheetsError: runtimeConfig.lastSheetsError
    });
    return;
  }

  // ===================== 3.7 API CONSTRUCTOR VISUAL (SLIDERS, CATEGORÍAS, ANUNCIOS) =====================
  if (req.method === 'GET' && (pathname === '/api/site-design' || pathname === '/api/sliders')) {
    sendJson(req, res, 200, {
      success: true,
      design: siteDesignMemory
    });
    return;
  }

  if ((req.method === 'POST' || req.method === 'PUT') && pathname === '/api/admin/site-design') {
    const admin = getAuthenticatedAdmin(req);
    if (!admin) {
      sendJson(req, res, 401, { success: false, error: 'No autorizado' });
      return;
    }
    try {
      const payload = await readJsonBody(req);
      if (Array.isArray(payload.slides)) {
        siteDesignMemory.slides = payload.slides.map((s, idx) => ({
          id: sanitizeText(s.id || `slide-${Date.now()}-${idx}`, 60),
          title: sanitizeText(s.title || `Slide ${idx + 1}`, 140),
          active: s.active !== undefined ? Boolean(s.active) : true,
          layoutMode: s.layoutMode === 'split' ? 'split' : 'banner',
          desktopImage: sanitizeText(s.desktopImage || '', 600),
          mobileImage: sanitizeText(s.mobileImage || '', 600),
          mobileRatio: ['adapt', '4:5', '1:1', '16:9'].includes(s.mobileRatio) ? s.mobileRatio : 'adapt',
          showOverlayText: Boolean(s.showOverlayText),
          eyebrow: sanitizeText(s.eyebrow || '', 140),
          headline: sanitizeText(s.headline || '', 200),
          description: sanitizeText(s.description || '', 400),
          ctaText: sanitizeText(s.ctaText || 'OBTENER OFERTA 🎁', 80),
          ctaSub: sanitizeText(s.ctaSub || 'Envíos a todo el Perú 🇵🇪', 100),
          actionType: ['product', 'category', 'section'].includes(s.actionType) ? s.actionType : 'product',
          actionTarget: sanitizeText(s.actionTarget || 'pistola-masaje-promax', 120),
          oldPrice: Number(s.oldPrice) || 0,
          price: Number(s.price) || 0,
          bgColor: sanitizeText(s.bgColor || '#f4f4f4', 30),
          textAlign: s.textAlign === 'center' ? 'center' : 'left'
        }));
      }
      if (Array.isArray(payload.categories)) {
        siteDesignMemory.categories = payload.categories.map(c => ({
          id: sanitizeText(c.id, 40),
          name: sanitizeText(c.name, 80),
          image: sanitizeText(c.image, 600)
        }));
      }
      if (Array.isArray(payload.announcements)) {
        siteDesignMemory.announcements = payload.announcements
          .map(a => sanitizeText(a, 220))
          .filter(Boolean);
      }

      await persistSiteDesignAsync();
      sendJson(req, res, 200, {
        success: true,
        design: siteDesignMemory
      });
    } catch (err) {
      sendJson(req, res, 400, { success: false, error: 'Error guardando configuración visual.' });
    }
    return;
  }

  // ===================== 4. REST API DE PEDIDOS =====================
  // 4.1 POST /api/orders (Público para compradores, con validación server-side y rate-limit)
  if (req.method === 'POST' && pathname === '/api/orders') {
    if (!checkRateLimit(`order:${clientIp}`, 15, 10 * 60 * 1000)) {
      sendJson(req, res, 429, { success: false, error: 'Has enviado demasiadas solicitudes seguidas. Intenta nuevamente en unos minutos.' });
      return;
    }

    try {
      const orderData = await readJsonBody(req);
      const rawItems = Array.isArray(orderData.items) ? orderData.items : [];
      const firstItem = rawItems[0] || {};
      const catalogProduct = PRODUCTS_CATALOG.get(firstItem.id);

      const units = Number(firstItem.quantity) === 2 ? 2 : 1;
      const couponCode = sanitizeText(orderData.couponCode, 32).toUpperCase();
      const coupon = COUPONS[couponCode];
      const discountAmount = coupon ? coupon.discount : 0;

      // Calcular subtotal real en el servidor si el producto existe en el catálogo
      let verifiedSubtotal;
      let verifiedItems;
      if (catalogProduct) {
        const baseSubtotal = units === 2 ? catalogProduct.bundlePrice : catalogProduct.price;
        verifiedSubtotal = Math.max(0, baseSubtotal - discountAmount);
        verifiedItems = [{
          id: catalogProduct.id,
          title: catalogProduct.title,
          quantity: units,
          price: catalogProduct.price
        }];
      } else {
        verifiedSubtotal = Math.max(0, Number(orderData.subtotal) || 0);
        verifiedItems = rawItems.map(i => ({
          id: sanitizeText(i.id, 64),
          title: sanitizeText(i.title, 160),
          quantity: Math.max(1, Math.min(10, Number(i.quantity) || 1)),
          price: Math.max(0, Number(i.price) || 0)
        }));
      }

      // Validar tarifa de envío
      const requestedShipPrice = Number(orderData.shippingRate?.price) || 0;
      const validShippingPrices = new Set([0, 10, 12, 15]);
      const verifiedShipPrice = validShippingPrices.has(requestedShipPrice) ? requestedShipPrice : 0;
      const verifiedTotal = verifiedSubtotal + verifiedShipPrice;

      const orderId = `VIT-${Math.floor(100000 + Math.random() * 900000)}`;
      const newOrder = {
        id: orderId,
        createdAt: new Date().toISOString(),
        customer: {
          name: sanitizeText(orderData.customer?.name, 120),
          email: sanitizeText(orderData.customer?.email, 120),
          phone: sanitizeText(orderData.customer?.phone, 20),
          dni: sanitizeText(orderData.customer?.dni, 20),
          address: sanitizeText(orderData.customer?.address, 220),
          reference: sanitizeText(orderData.customer?.reference, 220),
          department: sanitizeText(orderData.customer?.department || 'Lima (Metropolitana)', 80),
          province: sanitizeText(orderData.customer?.province || 'Lima', 80),
          district: sanitizeText(orderData.customer?.district, 80)
        },
        items: verifiedItems,
        couponCode: coupon ? coupon.code : null,
        discount: discountAmount,
        subtotal: verifiedSubtotal,
        shippingRate: {
          name: sanitizeText(orderData.shippingRate?.name || 'Envío Delivery VITACORE', 120),
          price: verifiedShipPrice
        },
        total: verifiedTotal,
        paymentMethod: sanitizeText(orderData.paymentMethod || 'Pago Contra Entrega (Efectivo / Yape)', 100),
        status: 'Pendiente',
        notes: sanitizeText(orderData.notes || `Pedido generado en web. Promo: ${units} unidad(es).`, 300)
      };

      if (!newOrder.customer.name || !newOrder.customer.phone || !newOrder.customer.address) {
        sendJson(req, res, 400, { success: false, error: 'Faltan datos obligatorios del cliente.' });
        return;
      }

      ordersMemory.unshift(newOrder);
      persistOrdersAsync();

      // Enviar a Google Sheets en segundo plano sin bloquear al comprador
      pushToGoogleSheets('create', { order: newOrder });

      sendJson(req, res, 201, { success: true, order: newOrder });
    } catch (err) {
      sendJson(req, res, 400, { success: false, error: err.message || 'Datos de orden inválidos' });
    }
    return;
  }

  // 4.2 Rutas protegidas de Pedidos y Métricas (SOLO ADMIN)
  if (req.method === 'GET' && pathname === '/api/orders') {
    if (!getAuthenticatedAdmin(req)) {
      sendJson(req, res, 401, { success: false, error: 'No autorizado. Inicia sesión en el panel Admin.' });
      return;
    }
    const sorted = [...ordersMemory].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    sendJson(req, res, 200, sorted);
    return;
  }

  if (req.method === 'PATCH' && pathname.startsWith('/api/orders/')) {
    if (!getAuthenticatedAdmin(req)) {
      sendJson(req, res, 401, { success: false, error: 'No autorizado.' });
      return;
    }
    const id = pathname.replace('/api/orders/', '').trim();
    try {
      const updates = await readJsonBody(req);
      const index = ordersMemory.findIndex(o => o.id === id);

      if (index === -1) {
        sendJson(req, res, 404, { success: false, error: 'Pedido no encontrado' });
        return;
      }

      if (updates.status) ordersMemory[index].status = sanitizeText(updates.status, 40);
      if (updates.notes !== undefined) ordersMemory[index].notes = sanitizeText(updates.notes, 400);
      ordersMemory[index].updatedAt = new Date().toISOString();

      persistOrdersAsync();
      pushToGoogleSheets('update', { order: ordersMemory[index] });

      sendJson(req, res, 200, { success: true, order: ordersMemory[index] });
    } catch {
      sendJson(req, res, 400, { success: false, error: 'Error procesando actualización' });
    }
    return;
  }

  if (req.method === 'DELETE' && pathname.startsWith('/api/orders/')) {
    if (!getAuthenticatedAdmin(req)) {
      sendJson(req, res, 401, { success: false, error: 'No autorizado.' });
      return;
    }
    const id = pathname.replace('/api/orders/', '').trim();
    const initialLen = ordersMemory.length;
    ordersMemory = ordersMemory.filter(o => o.id !== id);

    if (ordersMemory.length === initialLen) {
      sendJson(req, res, 404, { success: false, error: 'Pedido no encontrado' });
      return;
    }

    persistOrdersAsync();
    pushToGoogleSheets('delete', { id });

    sendJson(req, res, 200, { success: true, message: 'Pedido eliminado correctamente' });
    return;
  }

  if (req.method === 'GET' && pathname === '/api/stats') {
    if (!getAuthenticatedAdmin(req)) {
      sendJson(req, res, 401, { success: false, error: 'No autorizado.' });
      return;
    }
    const validOrders = ordersMemory.filter(o => o.status !== 'Cancelado');
    const totalSales = validOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

    const pendingCount = ordersMemory.filter(o => o.status === 'Pendiente').length;
    const confirmedCount = ordersMemory.filter(o => o.status === 'Confirmado WhatsApp').length;
    const inTransitCount = ordersMemory.filter(o => o.status === 'En Camino').length;
    const deliveredCount = ordersMemory.filter(o => o.status === 'Entregado').length;
    const cancelledCount = ordersMemory.filter(o => o.status === 'Cancelado').length;

    const stats = {
      totalOrders: ordersMemory.length,
      totalSales: Math.round(totalSales * 100) / 100,
      averageTicket: validOrders.length > 0 ? Math.round((totalSales / validOrders.length) * 100) / 100 : 0,
      statusCounts: {
        pending: pendingCount,
        confirmed: confirmedCount,
        inTransit: inTransitCount,
        delivered: deliveredCount,
        cancelled: cancelledCount
      }
    };

    sendJson(req, res, 200, stats);
    return;
  }

  // ===================== 5. ARCHIVOS ESTÁTICOS (LISTA BLANCA ESTRICTA) =====================
  if (pathname === '/') pathname = '/index.html';
  if (pathname === '/admin' || pathname === '/admin/') pathname = '/admin.html';

  const isAllowedStatic =
    pathname === '/index.html' ||
    pathname === '/admin.html' ||
    pathname === '/google-sheets-backend.js' ||
    pathname.startsWith('/assets/');

  if (!isAllowedStatic) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found - Recurso no disponible');
    return;
  }

  const normalizedRel = path.normalize(pathname).replace(/^(\.\.(\/|\\|$))+/, '');
  const fullPath = path.join(__dirname, normalizedRel);

  // Evitar Path Traversal fuera del proyecto
  if (!fullPath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 Forbidden');
    return;
  }

  try {
    const stats = await fsp.stat(fullPath);
    if (!stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(fullPath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    const acceptEncoding = req.headers['accept-encoding'] || '';
    const headers = {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache, must-revalidate'
    };

    if (compressibleExts.has(ext) && acceptEncoding.includes('gzip')) {
      res.writeHead(200, { ...headers, 'Content-Encoding': 'gzip' });
      fs.createReadStream(fullPath).pipe(zlib.createGzip()).pipe(res);
    } else {
      res.writeHead(200, headers);
      fs.createReadStream(fullPath).pipe(res);
    }
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found - Archivo no encontrado');
  }
});

server.listen(PORT, HOST, () => {
  console.log(`[VITACORE Store] Servidor escuchando en: http://${HOST}:${PORT} (Local: http://localhost:${PORT})`);
  console.log(`[VITACORE Store] Panel de Control Admin protegido: http://localhost:${PORT}/admin`);
});
