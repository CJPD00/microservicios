/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  //NATS_SERVERS: string[];
  STRIPE_SECRET: string;
  SIGNING_SECRET: string;
  STRIPE_SUCCESS_URL: string;
  STRIPE_CANCEL_URL: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    //NATS_SERVERS: joi.array().items(joi.string()).required(),
    STRIPE_SECRET: joi.string().required(),
    SIGNING_SECRET: joi.string().required(),
    STRIPE_SUCCESS_URL: joi.string().required(),
    STRIPE_CANCEL_URL: joi.string().required(),
  })
  .unknown(true);

// const natsServers = process.env.NATS_SERVERS;

// if (!natsServers) {
//   throw new Error('NATS_SERVERS must be defined');
// }

const { error, value } = envsSchema.validate({
  ...process.env,
  //NATS_SERVERS: natsServers.split(','),
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

//console.log(envVars);

export const envs = {
  port: envVars.PORT,
  //natsServers: envVars.NATS_SERVERS,
  stripeSecret: envVars.STRIPE_SECRET,
  signingSecret: envVars.SIGNING_SECRET,
  stripeSuccessUrl: envVars.STRIPE_SUCCESS_URL,
  stripeCancelUrl: envVars.STRIPE_CANCEL_URL,
};
