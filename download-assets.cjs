const fs = require('node:fs');
const path = require('node:path');
const manifest = require('./asset-manifest.json');

async function downloadAssets() {
    let failures = 0;
    await Promise.all(Object.entries(manifest).map(async ([id, asset]) => {
        const destination = path.join(__dirname, asset.url);
        if (fs.existsSync(destination) && fs.statSync(destination).size > 0) return;
        try {
            const response = await fetch(asset.remoteUrl, { signal: AbortSignal.timeout(60000) });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = Buffer.from(await response.arrayBuffer());
            if (!data.length) throw new Error('Empty download');
            fs.mkdirSync(path.dirname(destination), { recursive: true });
            fs.writeFileSync(destination, data);
            console.log(`Downloaded ${id}`);
        } catch (error) {
            failures++;
            console.error(`Failed ${id}: ${error.message}`);
        }
    }));
    if (failures) throw new Error(`${failures} asset downloads failed. Check your connection and retry npm start.`);
    console.log(`All ${Object.keys(manifest).length} assets are available locally.`);
}
module.exports = downloadAssets;
if (require.main === module) downloadAssets().catch(error => { console.error(error.message); process.exitCode = 1; });