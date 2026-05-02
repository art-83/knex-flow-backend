import 'reflect-metadata';

import { container } from 'tsyringe';
import ITable3RepositoryProvider from '../../modules/__example-module__/infra/orm/repositories/providers/table-3-repository.provider';
import Table3Repository from '../../modules/__example-module__/infra/orm/repositories/implementations/table-3-repository.implementation';

import IUserRepositoryProvider from '../../modules/users/infra/orm/repositories/providers/user-repository.provider';
import UserRepository from '../../modules/users/infra/orm/repositories/implementations/user-repository.implementation';

import IOrganizationRepositoryProvider from '../../modules/users/infra/orm/repositories/providers/organization-repository.provider';
import OrganizationRepository from '../../modules/users/infra/orm/repositories/implementations/organization-repository.implementation';

import IUserOrganizationRepositoryProvider from '../../modules/users/infra/orm/repositories/providers/user-organization-repository.provider';
import UserOrganizationRepository from '../../modules/users/infra/orm/repositories/implementations/user-organization-repository.implementation';

import IOrganizationRoleRepositoryProvider from '../../modules/users/infra/orm/repositories/providers/organization-role-repository.provider';
import OrganizationRoleRepository from '../../modules/users/infra/orm/repositories/implementations/organization-role-repository.implementation';

import IOrganizationRolePermissionRepositoryProvider from '../../modules/users/infra/orm/repositories/providers/organization-role-permission-repository.provider';
import OrganizationRolePermissionRepository from '../../modules/users/infra/orm/repositories/implementations/organization-role-permission-repository.implementation';

import IPermissionRepositoryProvider from '../../modules/users/infra/orm/repositories/providers/permission-repository.provider';
import PermissionRepository from '../../modules/users/infra/orm/repositories/implementations/permission-repository.implementation';

import IUserPermissionRepositoryProvider from '../../modules/users/infra/orm/repositories/providers/user-permission-repository.provider';
import UserPermissionRepository from '../../modules/users/infra/orm/repositories/implementations/user-permission-repository.implementation';

import IEventRepositoryProvider from '../../modules/events/infra/orm/repositories/providers/event-repository.provider';
import EventRepository from '../../modules/events/infra/orm/repositories/implementations/event-repository.implementation';
import IActivityRepositoryProvider from '../../modules/events/infra/orm/repositories/providers/activity-repository.provider';
import ActivityRepository from '../../modules/events/infra/orm/repositories/implementations/activity-repository.implementation';
import IBatchRepositoryProvider from '../../modules/events/infra/orm/repositories/providers/batch-repository.provider';
import BatchRepository from '../../modules/events/infra/orm/repositories/implementations/batch-repository.implementation';
import IEventActivityRepositoryProvider from '../../modules/events/infra/orm/repositories/providers/event-activity-repository.provider';
import EventActivityRepository from '../../modules/events/infra/orm/repositories/implementations/event-activity-repository.implementation';
import IEventConfigurationRepositoryProvider from '../../modules/events/infra/orm/repositories/providers/event-configuration-repository.provider';
import EventConfigurationRepository from '../../modules/events/infra/orm/repositories/implementations/event-configuration-repository.implementation';
import IOrderRepositoryProvider from '../../modules/events/infra/orm/repositories/providers/order-repository.provider';
import OrderRepository from '../../modules/events/infra/orm/repositories/implementations/order-repository.implementation';
import ITicketRepositoryProvider from '../../modules/events/infra/orm/repositories/providers/ticket-repository.provider';
import TicketRepository from '../../modules/events/infra/orm/repositories/implementations/ticket-repository.implementation';
import IEventActivityOrderRepositoryProvider from '../../modules/events/infra/orm/repositories/providers/event-activity-order-repository.provider';
import EventActivityOrderRepository from '../../modules/events/infra/orm/repositories/implementations/event-activity-order-repository.implementation';
import { PaymentRepository } from '../../modules/payments/infra/orm/repositories/implementations/payment-repository.implementation';
import Payment from '../../modules/payments/infra/orm/entities/payment.entity';
import IRepositoryProvider from '../infra/orm/repositories/providers/repository.provider';
import { CardInformationRepository } from '../../modules/payments/infra/orm/repositories/implementations/card-information-repository.implementation';
import CardInformation from '../../modules/payments/infra/orm/entities/card-information.entity';
import { IPaymentGatewayProvider } from '../../modules/payments/infra/gateways/providers/payment-gateway.provider';
import { AbacatepayPixGatewayImplementation } from '../../modules/payments/infra/gateways/implementations/abacatepay-pix-gateway.implementation';

import IHashProvider from '../../modules/users/infra/hash/providers/hash.provider';
import BcryptHashProvider from '../../modules/users/infra/hash/implementations/bcrypt-hash.implementation';
import IJwtProvider from '../../modules/users/infra/jwt/providers/jwt.provider';
import JsonWebTokenJwtProvider from '../../modules/users/infra/jwt/implementations/jsonwebtoken-jwt.implementation';
import { IProducerProvider } from '../infra/queue/infra/providers/producer.provider';
import { BullMQProducer } from '../infra/queue/infra/implementation/producer.implementation';

container.registerSingleton<ITable3RepositoryProvider>('Table3RepositoryProvider', Table3Repository);

container.registerSingleton<IUserRepositoryProvider>('UserRepositoryProvider', UserRepository);
container.registerSingleton<IOrganizationRepositoryProvider>('OrganizationRepositoryProvider', OrganizationRepository);
container.registerSingleton<IUserOrganizationRepositoryProvider>(
  'UserOrganizationRepositoryProvider',
  UserOrganizationRepository,
);
container.registerSingleton<IOrganizationRoleRepositoryProvider>(
  'OrganizationRoleRepositoryProvider',
  OrganizationRoleRepository,
);
container.registerSingleton<IOrganizationRolePermissionRepositoryProvider>(
  'OrganizationRolePermissionRepositoryProvider',
  OrganizationRolePermissionRepository,
);
container.registerSingleton<IPermissionRepositoryProvider>('PermissionRepositoryProvider', PermissionRepository);
container.registerSingleton<IUserPermissionRepositoryProvider>(
  'UserPermissionRepositoryProvider',
  UserPermissionRepository,
);

container.registerSingleton<IEventRepositoryProvider>('EventRepositoryProvider', EventRepository);
container.registerSingleton<IActivityRepositoryProvider>('ActivityRepositoryProvider', ActivityRepository);
container.registerSingleton<IBatchRepositoryProvider>('BatchRepositoryProvider', BatchRepository);
container.registerSingleton<IEventActivityRepositoryProvider>(
  'EventActivityRepositoryProvider',
  EventActivityRepository,
);
container.registerSingleton<IEventConfigurationRepositoryProvider>(
  'EventConfigurationRepositoryProvider',
  EventConfigurationRepository,
);
container.registerSingleton<IOrderRepositoryProvider>('OrderRepositoryProvider', OrderRepository);
container.registerSingleton<ITicketRepositoryProvider>('TicketRepositoryProvider', TicketRepository);
container.registerSingleton<IEventActivityOrderRepositoryProvider>(
  'EventActivityOrderRepositoryProvider',
  EventActivityOrderRepository,
);

container.registerSingleton<IRepositoryProvider<Payment>>('PaymentRepositoryProvider', PaymentRepository);
container.registerSingleton<IRepositoryProvider<CardInformation>>(
  'CardInformationRepositoryProvider',
  CardInformationRepository,
);
container.registerSingleton<IHashProvider>('HashProvider', BcryptHashProvider);
container.registerSingleton<IJwtProvider>('JwtProvider', JsonWebTokenJwtProvider);
container.registerSingleton<IPaymentGatewayProvider>('PixGatewayProvider', AbacatepayPixGatewayImplementation);
container.registerSingleton<IProducerProvider>('ProducerProvider', BullMQProducer);
