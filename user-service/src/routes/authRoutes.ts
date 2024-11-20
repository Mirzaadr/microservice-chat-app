import { ServerRoute } from "@hapi/hapi";
import Joi from "joi";

const authRoutes: ServerRoute[] = [
  {
    method: "POST",
    path: "/signup",
    handler: () => {},
    options: {
      validate: {
        options: {
          abortEarly: false,
        },
        payload: Joi.object({
          username: Joi.string().required(),
          password: Joi.string().required(),
        }),
    }
    }
  },
  {
    method: "POST",
    path: "/signin",
    handler: () => {},
    options: {
      validate: {
        options: {
          abortEarly: false,
        },
        payload: Joi.object({
          username: Joi.string().required(),
          password: Joi.string().required(),
        }),
    }
    }
  },
  {
    method: "POST",
    path: "/signout",
    handler: () => {},
    options: {
      validate: {
        options: {
          abortEarly: false,
        },
        payload: Joi.object({
          username: Joi.string().required(),
          password: Joi.string().required(),
        }),
    }
    }
  },
];

export default authRoutes;