import { z as schema } from "zod";
import { usernameSchema } from "./auth";

export const friendRequestSchema = schema.object({ username: usernameSchema });
export const friendIdSchema = schema.object({ friendId: schema.uuid() });
