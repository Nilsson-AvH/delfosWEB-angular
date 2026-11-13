const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const dataFilePath = path.join(__dirname, 'src', 'assets', 'data.json');
const publicDir = path.join(__dirname, 'public');

// Carpetas permitidas para subir archivos y los tipos aceptados en cada una
const UPLOAD_RULES = {
    pdf: { exts: ['.pdf'], maxMb: 30 },
    images: { exts: ['.webp', '.jpg', '.jpeg', '.png', '.svg', '.avif'], maxMb: 10 }
};

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Create the file and directories if they don't exist
const ensureFileExists = () => {
    try {
        const dir = path.dirname(dataFilePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        if (!fs.existsSync(dataFilePath)) {
            fs.writeFileSync(dataFilePath, JSON.stringify({}), 'utf-8');
        }
    } catch (error) {
        console.error('Error creating data.json:', error);
    }
};

ensureFileExists();

app.post('/api/save-content', (req, res) => {
    try {
        const newData = req.body;
        if (!newData || typeof newData !== 'object') {
            return res.status(400).json({ success: false, message: 'Formato de datos inválido' });
        }

        fs.writeFileSync(dataFilePath, JSON.stringify(newData, null, 2), 'utf-8');
        console.log('✅ Contenido guardado en src/assets/data.json');
        res.json({ success: true, message: 'Contenido guardado' });
    } catch (error) {
        console.error('❌ Error guardando contenido:', error);
        res.status(500).json({ success: false, message: 'Error del servidor al guardar' });
    }
});

/**
 * Subida de archivos (PDF del folleto o imágenes).
 * POST /api/upload?folder=pdf|images&name=archivo.pdf  — cuerpo: el archivo en binario.
 * Se guarda en public/<folder>/ y se devuelve la ruta pública relativa.
 */
app.post('/api/upload', express.raw({ type: () => true, limit: '30mb' }), (req, res) => {
    try {
        const folder = String(req.query.folder || '');
        const rule = UPLOAD_RULES[folder];
        if (!rule) {
            return res.status(400).json({ success: false, message: 'Carpeta no permitida' });
        }

        const original = path.basename(String(req.query.name || 'archivo'));
        const ext = path.extname(original).toLowerCase();
        if (!rule.exts.includes(ext)) {
            return res.status(400).json({ success: false, message: `Tipo de archivo no permitido (${ext})` });
        }

        const body = req.body;
        if (!Buffer.isBuffer(body) || body.length === 0) {
            return res.status(400).json({ success: false, message: 'Archivo vacío' });
        }
        if (body.length > rule.maxMb * 1024 * 1024) {
            return res.status(413).json({ success: false, message: `El archivo supera ${rule.maxMb} MB` });
        }
        if (folder === 'pdf' && body.subarray(0, 4).toString() !== '%PDF') {
            return res.status(400).json({ success: false, message: 'El archivo no es un PDF válido' });
        }

        // Nombre seguro: sin acentos, espacios ni caracteres especiales
        const base = path.basename(original, ext)
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-+|-+$/g, '') || 'archivo';
        const fileName = `${base}${ext}`;

        const targetDir = path.join(publicDir, folder);
        fs.mkdirSync(targetDir, { recursive: true });
        fs.writeFileSync(path.join(targetDir, fileName), body);

        const publicPath = `${folder}/${fileName}`;
        console.log(`📄 Archivo subido: public/${publicPath}`);
        res.json({ success: true, path: publicPath });
    } catch (error) {
        console.error('❌ Error subiendo archivo:', error);
        res.status(500).json({ success: false, message: 'Error del servidor al subir el archivo' });
    }
});

app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🛠️  Backend local de Delfos en ejecución 🛠️`);
    console.log(`=========================================`);
    console.log(`Servidor: http://localhost:${PORT}`);
    console.log(`Contenido: ${dataFilePath}`);
    console.log(`Archivos subidos: ${publicDir}/{pdf,images}`);
    console.log(`=========================================`);
});
