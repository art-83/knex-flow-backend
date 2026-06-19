import { inject, injectable } from 'tsyringe';
import { AppError } from '../../../../shared/infra/http/errors/app-error';
import { IOrganizationRepositoryProvider } from '../../infra/orm/repositories/providers/organization-repository.provider';
import { IUserOrganizationRepositoryProvider } from '../../infra/orm/repositories/providers/user-organization-repository.provider';

@injectable()
class FindOrganizationService {
  constructor(
    @inject('OrganizationRepositoryProvider')
    private organizationRepository: IOrganizationRepositoryProvider,
    @inject('UserOrganizationRepositoryProvider')
    private userOrganizationRepository: IUserOrganizationRepositoryProvider,
  ) {}

  public async execute(user_id: string, organization_id: string) {
    const userOrganization = (await this.userOrganizationRepository.find({ user_id, organization_id })).at(0);

    if (!userOrganization) {
      throw new AppError(
        403,
        'You do not have access to this organization.',
        'Voce nao tem acesso a esta organizacao.',
      );
    }

    const organization = (await this.organizationRepository.find({ id: organization_id })).at(0);

    if (!organization) {
      throw new AppError(404, 'Organization not found.', 'Organizacao nao encontrada.');
    }

    return {
      message: 'Organization retrieved successfully.',
      data: {
        id: organization.id,
        name: organization.name,
        configuration: organization.configuration,
      },
    };
  }
}
export { FindOrganizationService };
