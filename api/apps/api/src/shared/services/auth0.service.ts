import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ManagementClient } from 'auth0';
import { auth } from 'express-oauth2-jwt-bearer';
import { Request, Response } from 'express';
import { createRequest, createResponse } from 'node-mocks-http';

@Injectable()
export class Auth0Service extends ManagementClient {
  constructor(private readonly config: ConfigService) {
    super({
      domain: config.get<string>('AUTH0_DOMAIN', ''),
      clientId: config.get<string>('AUTH0_CLIENT_ID', ''),
      clientSecret: config.get<string>('AUTH0_CLIENT_SECRET', ''),
      audience: config.get<string>('AUTH0_AUDIENCE', ''),
    });
  }

  async getAuth0Id({
    req,
    res,
    token,
  }: {
    req?: Request;
    res?: Response;
    token?: string;
  }) {
    if (!res) {
      res = createResponse() as Response;
    }
    if (!req) {
      const bearerRegex = /^[Bb]earer\s/;
      req = createRequest({
        headers: {
          ...(token && {
            authorization: bearerRegex.test(token) ? token : `Bearer ${token}`,
          }),
        },
      }) as Request;
    }
    await new Promise<void>((resolve, reject) => {
      auth({
        audience: this.config.get('AUTH0_AUDIENCE'),
        issuerBaseURL: `https://${this.config.get('AUTH0_DOMAIN')}`,
      })(req, res, (err: any) => {
        if (err) {
          reject(new Error(err instanceof Error ? err.message : String(err)));
        } else {
          resolve();
        }
      });
    });

    return req.auth?.payload?.sub;
  }
}
