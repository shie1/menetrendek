import mysql from "mysql2/promise"
import { config } from "dotenv"
config()


export const query = async (query: string, values?: any) => {
    const connection = mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DB
    });
    const [rows, fields] = await (await connection).execute(query, values);
    (await connection).end();
    return rows as Array<any>;
}