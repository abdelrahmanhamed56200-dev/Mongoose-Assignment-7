import {z} from "zod";
import {config} from "dotenv";
config();

const schema = z.object({
    PORT: z.string().default('3000'),
    MONGODB_URL: z.string().trim(),
    JWT_SECRET: z.string().trim(),

});
const parsed = schema.parse(process.env);
export const env = {
    port: Number(parsed.PORT),
    db:{
        url: parsed.MONGODB_URL,
    },
    jwt: {
        secret: parsed.JWT_SECRET,
    },
    };