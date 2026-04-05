import 'reflect-metadata';

import { container } from 'tsyringe';
import ITable3RepositoryProvider from '../../modules/__example-module__/infra/orm/repositories/providers/table-3-repository.provider';
import Table3Repository from '../../modules/__example-module__/infra/orm/repositories/implementations/table-3-repository.implementation';

container.registerSingleton<ITable3RepositoryProvider>('Table3RepositoryProvider', Table3Repository);
