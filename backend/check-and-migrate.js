import sqlite3 from 'sqlite3';
import { MongoClient } from 'mongodb';

async function checkAndMigrate() {
    // SQLite connection - try database.sqlite
    const sqliteDb = new sqlite3.Database('C:/Users/Asus/CascadeProjects/backend/database/database.sqlite');
    
    try {
        // Check what tables exist
        const tables = await new Promise((resolve, reject) => {
            sqliteDb.all("SELECT name FROM sqlite_master WHERE type='table'", (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
        
        console.log('Tables in SQLite:', tables.map(t => t.name));
        
        // Get data from articles table
        const articles = await new Promise((resolve, reject) => {
            sqliteDb.all('SELECT * FROM articles', (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
        
        console.log(`Found ${articles.length} articles`);
        console.log('Sample article:', articles[0]);
        
        // MongoDB connection (if MongoDB is running)
        try {
            const mongoClient = new MongoClient('mongodb://localhost:27017');
            await mongoClient.connect();
            const mongoDb = mongoClient.db('beyondchats');
            const articlesCollection = mongoDb.collection('articles');
            
            // Insert into MongoDB
            if (articles.length > 0) {
                await articlesCollection.insertMany(articles);
                console.log('Successfully migrated articles to MongoDB');
                
                // Verify migration
                const count = await articlesCollection.countDocuments();
                console.log(`Total articles in MongoDB: ${count}`);
            }
            
            await mongoClient.close();
        } catch (mongoError) {
            console.log('MongoDB not running or connection failed:', mongoError.message);
            console.log('Install MongoDB Community Server first');
        }
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        sqliteDb.close();
    }
}

checkAndMigrate();
