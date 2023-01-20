import mysql from "mysql2/promise"
import { config } from "dotenv"
config()

const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB
});

export const query = async (query: string, values?: any) => {
    const [rows, fields] = await (await connection).execute(query, values);
    return rows as Array<any>;
}