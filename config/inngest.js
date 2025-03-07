import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/User";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });

// Inngest function to save user data to database
export const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-from-clerk",
  },
  {
    event: "clerk/user.created",
  },
  async ({ event }) => {
    try {
      const { id, first_name, last_name, email_addresses, image_url } =
        event.data;

      // Ensure email is available
      const email = email_addresses?.[0]?.email_address;
      if (!email) {
        console.error("Email address is missing in the event data");
        return;
      }

      const userData = {
        _id: id,
        email: email,
        name: `${first_name} ${last_name}`,
        imageUrl: image_url || "",
      };

      await connectDB();

      // Check if user already exists to prevent duplicates
      const existingUser = await User.findById(id);
      if (!existingUser) {
        await User.create(userData);
      }
    } catch (error) {
      console.error("Error syncing user creation:", error);
    }
  }
);

// Inngest function to update user data to database
export const syncUserUpdation = inngest.createFunction(
  {
    id: "update-user-from-clerk",
  },
  {
    event: "clerk/user.update",
  },
  async ({ event }) => {
    try {
      const { id, first_name, last_name, email_addresses, image_url } =
        event.data;
      const email = email_addresses?.[0]?.email_address;
      if (!email) {
        console.error("Email address is missing in the event data");
        return;
      }

      const userData = {
        email: email,
        name: `${first_name} ${last_name}`,
        imageUrl: image_url || "",
      };

      await connectDB();
      await User.findByIdAndUpdate(id, userData, { new: true });
    } catch (error) {
      console.error("Error updating user:", error);
    }
  }
);

// Inngest function to delete user data from database
export const syncUserDeletion = inngest.createFunction(
  {
    id: "delete-user-with-clerk",
  },
  {
    event: "clerk/user.deleted",
  },
  async ({ event }) => {
    try {
      const { id } = event.data;

      await connectDB();
      await User.findByIdAndDelete(id);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }
);
