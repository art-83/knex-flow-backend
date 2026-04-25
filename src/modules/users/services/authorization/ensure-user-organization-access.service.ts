import { inject, injectable } from 'tsyringe';
import IUserOrganizationRepositoryProvider from '../../infra/orm/repositories/providers/user-organization-repository.provider';
import AppError from '../../../../shared/infra/http/errors/app-error';

@injectable()
class EnsureUserOrganizationAccessService {
  constructor(
    @inject('UserOrganizationRepositoryProvider')
    private userOrganizationRepository: IUserOrganizationRepositoryProvider,
  ) {}

  public async execute(user_id: string, organization_id: string): Promise<void> {
    const userOrganization = (
      await this.userOrganizationRepository.find({
        user_id,
        organization_id,
      })
    ).at(0);

    if (!userOrganization) {
      throw new AppError(
        403,
        'User does not have access to this organization.',
        'Usuario nao possui acesso a esta organizacao.',
      );
    }
  }
}

export default EnsureUserOrganizationAccessService;
