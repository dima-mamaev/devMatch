import { GqlOptionsFactory } from '@nestjs/graphql';
import { Injectable } from '@nestjs/common';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigService } from '@nestjs/config';
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default';
import { Context } from 'graphql-ws';
import { Request } from 'express';
import GraphQLJSON from 'graphql-type-json';
import { EnvironmentEnum } from '../enums/environment.enum';
import { UserService } from '../../user/user.service';
import { Auth0Service } from './auth0.service';
import { WsContextWithUser } from '../../../../../types/types';

@Injectable()
export class GqlConfigService implements GqlOptionsFactory {
  constructor(
    private readonly config: ConfigService,
    private readonly auth0Service: Auth0Service,
    private readonly userService: UserService,
  ) {}

  createGqlOptions(): ApolloDriverConfig {
    return {
      autoSchemaFile: 'schema.gql',
      playground: false,
      introspection: true,
      installSubscriptionHandlers: true,
      sortSchema: true,
      csrfPrevention: false, // Required for file uploads
      buildSchemaOptions: {
        scalarsMap: [{ type: () => Object, scalar: GraphQLJSON }],
      },
      fieldResolverEnhancers: ['guards', 'interceptors', 'filters'],
      plugins: [
        this.config.get('ENVIRONMENT') !== EnvironmentEnum.Prod
          ? ApolloServerPluginLandingPageLocalDefault({
              embed: { endpointIsEditable: true },
            })
          : ApolloServerPluginLandingPageProductionDefault(),
      ],
      subscriptions: {
        'graphql-ws': {
          onConnect: async (ctx: WsContextWithUser) => {
            const { connectionParams, extra } = ctx;
            try {
              const token =
                connectionParams?.Authorization ||
                connectionParams?.authorization;
              const auth0Id = await this.auth0Service.getAuth0Id({ token });
              const user = await this.userService.findOneBy({ auth0Id });
              extra.user = user ?? undefined;
            } catch {
              extra.user = undefined;
            }
          },
        },
      },
      context: ({
        req,
        connection,
      }: {
        req: Request;
        connection: { context?: Context };
      }) => {
        if (connection?.context) {
          return { req: connection.context };
        }
        return { req };
      },
    };
  }
}
