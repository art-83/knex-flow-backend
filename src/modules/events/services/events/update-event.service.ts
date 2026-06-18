import { inject, injectable } from 'tsyringe';
import { CreateOrUpdateEventDTO } from '../../dtos/event/create-or-update-event.dto';
import { IEventRepositoryProvider } from '../../infra/orm/repositories/providers/event-repository.provider';
import { IAddressRepositoryProvider } from '../../infra/orm/repositories/providers/address-repository.provider';
import { AppError } from '../../../../shared/infra/http/errors/app-error';
import { IUserOrganizationRepositoryProvider } from '../../../users/infra/orm/repositories/providers/user-organization-repository.provider';
import { IPermissionRepositoryProvider } from '../../../users/infra/orm/repositories/providers/permission-repository.provider';
import { IUserPermissionRepositoryProvider } from '../../../users/infra/orm/repositories/providers/user-permission-repository.provider';
import { PermissionDescriptionEnum } from '../../../users/infra/orm/enums/permission-description.enum';
import { EventStatus } from '../../infra/orm/enums/event-status.enum';
import { EventModality } from '../../infra/orm/enums/event-modality.enum';
import { Event } from '../../infra/orm/entities/event.entity';
import { IFileRepositoryProvider } from '../../../files/infra/orm/repositories/providers/file-repository.provider';
import { FileQueryOptions } from '../../../files/dtos/file/file-query-options';
import { IStorageProvider } from '../../../files/infra/storage/providers/storage.provider';
import { mapStoredFile } from '../../../files/utils/map-stored-file';

@injectable()
class UpdateEventService {
  constructor(
    @inject('EventRepositoryProvider')
    private eventRepository: IEventRepositoryProvider,
    @inject('AddressRepositoryProvider')
    private addressRepository: IAddressRepositoryProvider,
    @inject('UserOrganizationRepositoryProvider')
    private userOrganizationRepository: IUserOrganizationRepositoryProvider,
    @inject('PermissionRepositoryProvider')
    private permissionRepository: IPermissionRepositoryProvider,
    @inject('UserPermissionRepositoryProvider')
    private userPermissionRepository: IUserPermissionRepositoryProvider,
    @inject('FileRepositoryProvider')
    private fileRepository: IFileRepositoryProvider,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute(user_id: string, event_id: string, data: Partial<CreateOrUpdateEventDTO>) {
    const eventExists = (await this.eventRepository.find({ id: event_id })).at(0);

    if (!eventExists) {
      throw new AppError(404, 'Event not found.', 'Evento nao encontrado.');
    }

    const userOrganization = (
      await this.userOrganizationRepository.find({ user_id, organization_id: eventExists.organization.id })
    ).at(0);

    if (!userOrganization) {
      throw new AppError(
        403,
        'You do not have access to this organization.',
        'Voce nao tem acesso a esta organizacao.',
      );
    }

    const requiredPermission = (
      await this.permissionRepository.find({ description: PermissionDescriptionEnum.EVENTS_MANAGE })
    ).at(0);

    if (!requiredPermission) {
      throw new AppError(404, 'Permission not found.', 'Permissao nao encontrada.');
    }

    const permissionGrant = (
      await this.userPermissionRepository.find({
        user_id,
        organization_id: eventExists.organization.id,
        permission_id: requiredPermission.id,
      })
    ).at(0);

    if (!permissionGrant) {
      throw new AppError(
        403,
        'You do not have permission to perform this action.',
        'Voce nao tem permissao para realizar esta acao.',
      );
    }

    if (data.url_path) {
      const possibleExistingEvent = (
        await this.eventRepository.find({ url_path: data.url_path, status: EventStatus.ACTIVE })
      ).at(0);

      if (possibleExistingEvent && possibleExistingEvent.id !== event_id) {
        throw new AppError(400, 'Event with this URL path already exists.', 'Evento com este caminho URL ja existe.');
      }
    }

    const isSwitchingToOnline =
      data.modality === EventModality.ONLINE &&
      eventExists.modality === EventModality.OFFLINE &&
      Boolean(eventExists.address?.id);

    if (isSwitchingToOnline && eventExists.address?.id) {
      await this.addressRepository.delete(eventExists.address.id);
    }

    const updatePayload = await this.buildUpdatePayload(eventExists, data, isSwitchingToOnline);

    if (data.file_id !== undefined) {
      if (data.file_id === null) {
        updatePayload.file = null;
      } else {
        const file = (await this.fileRepository.find({ id: data.file_id, user_id } as FileQueryOptions)).at(0);

        if (!file) {
          throw new AppError(404, 'File not found.', 'Arquivo nao encontrado.');
        }

        updatePayload.file = file;
      }
    }

    const event = await this.eventRepository.update(event_id, updatePayload);

    return {
      message: 'Event updated successfully.',
      data: {
        id: event.id,
        name: event.name,
        description: event.description,
        url_path: event.url_path,
        status: event.status,
        modality: event.modality,
        start_date: event.start_date,
        end_date: event.end_date,
        banner: mapStoredFile(this.storageProvider, event.file),
      },
    };
  }

  private async buildUpdatePayload(
    eventExists: NonNullable<Awaited<ReturnType<IEventRepositoryProvider['find']>>[number]>,
    data: Partial<CreateOrUpdateEventDTO>,
    isSwitchingToOnline: boolean,
  ) {
    const { address, file_id, organization_id, ...rest } = data;
    const updatePayload: Partial<Event> = { ...rest };

    if (isSwitchingToOnline) {
      return updatePayload;
    }

    if (!address) {
      return updatePayload;
    }

    if (eventExists.address?.id) {
      await this.addressRepository.update(eventExists.address.id, address);
      return updatePayload;
    }

    await this.addressRepository.create({ ...address, event: eventExists });
    return updatePayload;
  }
}
export { UpdateEventService };
