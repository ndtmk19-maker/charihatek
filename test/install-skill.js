import https from 'https';
import fs from 'fs';
import path from 'path';

const TARGET_DIR = 'C:\\Users\\Administrator\\.gemini\\config\\skills\\ppt-master';

function getJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: { 'User-Agent': 'Antigravity-Agent' }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function downloadRaw(url, dest) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(dest);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const file = fs.createWriteStream(dest);
    https.get(url, {
      headers: { 'User-Agent': 'Antigravity-Agent' }
    }, (res) => {
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', err => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

async function main() {
  console.log('Fetching repo tree...');
  const treeData = await getJson('https://api.github.com/repos/hugohe3/ppt-master/git/trees/main?recursive=1');
  
  if (!treeData.tree) {
    console.error('Failed to get tree:', treeData);
    return;
  }

  // Filter items in skills/ppt-master
  const prefix = 'skills/ppt-master/';
  const skillItems = treeData.tree.filter(item => {
    if (!item.path.startsWith(prefix)) return false;
    // Skip templates/icons (thousands of icons not needed for skill core)
    if (item.path.includes('/templates/icons/')) return false;
    return true;
  });

  console.log(`Filtered to ${skillItems.length} essential skill items.`);

  for (const item of skillItems) {
    const relPath = item.path.substring(prefix.length);
    const destPath = path.join(TARGET_DIR, relPath);

    if (item.type === 'tree') {
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
    } else if (item.type === 'blob') {
      if (fs.existsSync(destPath) && fs.statSync(destPath).size > 0) {
        // already downloaded
        continue;
      }
      const rawUrl = `https://raw.githubusercontent.com/hugohe3/ppt-master/main/${item.path}`;
      process.stdout.write(`Downloading: ${relPath} ... `);
      await downloadRaw(rawUrl, destPath);
      console.log('OK');
    }
  }

  console.log('\nSkill successfully installed at:', TARGET_DIR);
}

main().catch(console.error);
