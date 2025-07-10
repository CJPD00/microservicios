/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  //NATS_SERVERS: string[];
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    //NATS_SERVERS: joi.array().items(joi.string()).required(),
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
};
