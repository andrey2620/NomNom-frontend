import { Injectable } from '@angular/core';
import { IMenu, IMenuCreateDTO } from '../interfaces';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root',
})
export class PlanificatorService extends BaseService<IMenu> {
  protected override source = 'menus';

  createMenu(payload: IMenuCreateDTO) {
    return this.add(payload);
  }

  getMenuById(id: number) {
    return this.findAllWithParamsAndCustomSource(`user/${id}`);
  }

  updateMenuById(id: number, payload: IMenuCreateDTO) {
    return this.edit(id, payload);
  }
}
