const sqlite3 = require('sqlite3').verbose();
const { MongoClient } = require('mongodb');

async function migrateData() {
    // SQLite connection
    const sqliteDb = new sqlite3.Database('./database/database.sqlite');
    
    // MongoDB connection
    const mongoClient = new MongoClient('mongodb://localhost:27017');
    
    try {
        await mongoClient.connect();
        const mongoDb = mongoClient.db('beyondchats');
        const articlesCollection = mongoDb.collection('articles');
        
        // Get data from SQLite
        const articles = await new Promise((resolve, reject) => {
            sqliteDb.all('SELECT * FROM articles', (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
        
        console.log(`Found ${articles.length} articles to migrate`);
        
        // Insert into MongoDB
        if (articles.length > 0) {
            await articlesCollection.insertMany(articles);
            console.log('Successfully migrated articles to MongoDB');
        }
        
        // Verify migration
        const count = await articlesCollection.countDocuments();
        console.log(`Total articles in MongoDB: ${count}`);
        
    } catch (error) {
        console.error('Migration error:', error);
    } finally {
        sqliteDb.close();
        await mongoClient.close();
    }
}

migrateData();
