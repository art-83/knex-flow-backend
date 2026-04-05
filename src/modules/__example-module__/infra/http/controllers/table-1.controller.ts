import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateTable3Service from '../../../services/table-3/create-table-3.service';
import FindTable3Service from '../../../services/table-3/find-table-3.service';
import UpdateTable3Service from '../../../services/table-3/update-table-3.service';
import DeleteTable3Service from '../../../services/table-3/delete-table-3.service';

class Table1Controller {
  public async create(request: Request, response: Response) {
    const createTable3Service = container.resolve(CreateTable3Service);
    const table3 = await createTable3Service.execute(request.body);
    return response.json(table3);
  }

  public async find(request: Request, response: Response) {
    const findTable3Service = container.resolve(FindTable3Service);
    const table3 = await findTable3Service.execute(request.query);
    return response.json(table3);
  }

  public async update(request: Request, response: Response) {
    const id = String(request.params.id);
    const updateTable3Service = container.resolve(UpdateTable3Service);
    const table3 = await updateTable3Service.execute(id, request.body);
    return response.json(table3);
  }

  public async delete(request: Request, response: Response) {
    const id = String(request.params.id);
    const deleteTable3Service = container.resolve(DeleteTable3Service);
    const rowsDeleted = await deleteTable3Service.execute(id);
    return response.json(rowsDeleted);
  }
}

export default Table1Controller;
