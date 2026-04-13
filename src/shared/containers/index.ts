import 'reflect-metadata';

import { container } from 'tsyringe';
import ITable3RepositoryProvider from '../../modules/__example-module__/infra/orm/repositories/providers/table-3-repository.provider';
import Table3Repository from '../../modules/__example-module__/infra/orm/repositories/implementations/table-3-repository.implementation';

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

container.registerSingleton<ITable3RepositoryProvider>('Table3RepositoryProvider', Table3Repository);

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
