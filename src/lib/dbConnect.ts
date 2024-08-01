import mongoose from 'mongoose'

type ConnectionObject = {
    isConnect?: number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
    if (connection.isConnect) {
        console.log('Already connected to database')
        return
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '', {})
        connection.isConnect = db.connections[0].readyState
        console.log("DB connected successfully")


    } catch (error) {
        console.log("DB connection failed")

        process.exit(1)
    }
}

export default dbConnect;
