import {ModelRouterOptions, modelRouter, Permissions, setupServer} from "@terreno/api";
import express, {Application} from "express";

import {connectToMongo} from "./dbUtils";
import {User} from "./user";

// @terreno/api supports lifecycle hooks (preCreate, preUpdate, preDelete,
// postCreate, postUpdate, postDelete) and a responseHandler on each
// modelRouter, plus per-method permissions. Use whatever you need.
function addRoutes(router: express.Router, options?: Partial<ModelRouterOptions<any>>): void {
  router.get("/health", (_req, res) => {
    res.json({status: "ok"});
  });

  // Permissions are wide open here for the example — don't take this as a
  // production pattern.
  router.use(
    "/users",
    modelRouter(User, {
      ...options,
      permissions: {
        list: [Permissions.IsAny],
        create: [Permissions.IsAny],
        read: [Permissions.IsAny],
        update: [Permissions.IsAny],
        delete: [Permissions.IsAny],
      },
      queryFields: ["name", "email"],
    })
  );
}

function addMiddleware(
  _router: express.Router,
  _options?: Partial<ModelRouterOptions<any>>
): void {}

async function getBaseServer(skipListen = false): Promise<Application> {
  await connectToMongo();
  return setupServer({
    // @ts-expect-error
    userModel: User,
    addRoutes,
    loggingOptions: {level: "debug"},
    addMiddleware,
    skipListen,
  });
}

export {getBaseServer};

if (require.main === module) {
  getBaseServer();
}
