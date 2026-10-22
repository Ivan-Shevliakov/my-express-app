const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data.json');

function readDb() {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function writeDb(data) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = {
    getAll: () => readDb(),

    getSubmissions: () => readDb().submissions || [],

    addSubmission: (submission) => {
        const db = readDb();
        if (!db.submissions) db.submissions = [];
        db.submissions.push({
            ...submission,
            createdAt: new Date().toLocaleString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        });
        writeDb(db);
    }
};