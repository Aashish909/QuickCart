import { serve } from "inngest/next";
import {
  inngest,
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdation,
} from "@/config/inngest";

// Create an API that serves Inngest functions for user sync operations
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [syncUserCreation, syncUserDeletion, syncUserUpdation],
});

export default serve({
  client: inngest,
  functions: [syncUserCreation, syncUserDeletion, syncUserUpdation],
});
