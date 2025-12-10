import Bree from 'bree'
import path from 'path'
import { fileURLToPath } from 'url'
import later from '@breejs/later'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const bree = new Bree({
    root: path.join(__dirname, 'jobs'),
    defaultExtension: 'js',
    jobs: [
        {
            name: 'insert-mock-cars',
            cron: later.parse.cron('* * * * *'),
        },
    ],
});

await bree.start();
console.log('[Bree] Job scheduler started');

export default bree;