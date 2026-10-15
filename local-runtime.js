// Local equivalents of the Astrocade APIs used by this game; no account required.
(() => {
    'use strict';
    const saveKey = 'sparky-count-and-kick:state:v1';
    let assetMap = {};
    const response = state => ({ userId: 'local-player', gameId: 'count-and-kick', state, success: true });
    window.lib = {
        getAsset: id => assetMap[id],
        log: message => console.log('[Count & Kick]', message),
        shouldUseTouchControls: () => matchMedia('(pointer: coarse), (hover: none)').matches,
        async getUserGameState() {
            try { return response(JSON.parse(localStorage.getItem(saveKey) || 'null')); }
            catch (error) { console.warn('Local save unavailable:', error); return response(null); }
        },
        async saveUserGameState(state) {
            try {
                localStorage.setItem(saveKey, JSON.stringify(state));
                return response(state);
            } catch (error) {
                console.warn('Could not write local save:', error);
                return { ...response(state), success: false };
            }
        },
        async deleteUserGameState() {
            try { localStorage.removeItem(saveKey); return { success: true }; }
            catch { return { success: false }; }
        },
        showGameParameters({ name, params }) {
            if (window.mode !== 'edit') return;
            const panel = document.createElement('details');
            panel.style.cssText = 'position:fixed;bottom:12px;right:12px;z-index:2000;background:white;color:#243e50;padding:14px;border-radius:12px;max-width:300px;font:16px sans-serif;touch-action:auto';
            const heading = document.createElement('summary');
            heading.textContent = name;
            panel.append(heading);
            for (const [label, param] of Object.entries(params)) {
                const keys = param.key.split('.');
                const parent = keys.slice(0, -1).reduce((object, key) => object[key], window.gameConfig);
                const key = keys.at(-1);
                const row = document.createElement('label');
                row.style.cssText = 'display:flex;gap:12px;justify-content:space-between;margin-top:12px';
                row.append(document.createTextNode(label));
                const input = document.createElement('input');
                input.type = param.type === 'checkbox' ? 'checkbox' : 'number';
                input.style.width = '64px';
                if (input.type === 'checkbox') input.checked = parent[key];
                else {
                    input.value = parent[key];
                    for (const attribute of ['min', 'max', 'step']) input[attribute] = param[attribute];
                }
                input.addEventListener('change', () => {
                    if (!input.checkValidity()) return;
                    const value = input.type === 'checkbox' ? input.checked : input.valueAsNumber;
                    if (param.onChange) param.onChange(value);
                    else parent[key] = value;
                });
                row.append(input);
                panel.append(row);
            }
            document.body.append(panel);
        }
    };
    window.mode = location.hash === '#edit' ? 'edit' : 'play';
    window.localGameReady = Promise.all(['config.json', 'asset-manifest.json'].map(async url => {
        const result = await fetch(url);
        if (!result.ok) throw new Error(`Could not load ${url} (${result.status})`);
        return result.json();
    })).then(([config, manifest]) => {
        window.gameConfig = config;
        assetMap = manifest;
    });
})();