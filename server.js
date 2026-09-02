const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const dataFilePath = path.join(__dirname, 'src', 'assets', 'data.json');

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
        // Simple validation
        if (!newData || typeof newData !== 'object') {
            return res.status(400).json({ success: false, message: 'Invalid data format' });
        }

        fs.writeFileSync(dataFilePath, JSON.stringify(newData, null, 2), 'utf-8');
        console.log('✅ Content saved successfully to src/assets/data.json');
        res.json({ success: true, message: 'Content saved successfully' });
    } catch (error) {
        console.error('❌ Error saving content:', error);
        res.status(500).json({ success: false, message: 'Server error saving content' });
    }
});

app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🛠️  Local Backend Simulation Running 🛠️`);
    console.log(`=========================================`);
    console.log(`Server listening on http://localhost:${PORT}`);
    console.log(`Ready to save Delfos content to: ${dataFilePath}`);
    console.log(`=========================================`);
});
