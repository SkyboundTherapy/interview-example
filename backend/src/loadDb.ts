import {logger} from "@terreno/api";
import {program} from "commander";

import {closeMongo, connectToMongo} from "./dbUtils";
import {User, UserDocument} from "./user";

const DEFAULT_PASSWORD = "password";

async function createUser(name: string, email: string, admin: boolean): Promise<UserDocument> {
  const user = await User.register({name, email, admin} as UserDocument, DEFAULT_PASSWORD);
  logger.info(`Created ${admin ? "admin" : "user"}: ${email} (${user._id})`);
  return user;
}

const main = async (): Promise<void> => {
  await User.collection.drop().catch(() => undefined);
  logger.info("Dropped users collection");

  await createUser("Admin User", "admin@example.com", true);
  await createUser("Regular User", "user@example.com", false);
};

function run(): void {
  program
    .description("Loads the database with seed data. Warning: this drops all existing data.")
    .parse(process.argv);

  connectToMongo()
    .then(() => main().then(() => closeMongo()))
    .catch((error) => console.error(error));
}

if (require.main === module) {
  run();
}
