import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Department } from '../models/department.model';

@Injectable({ providedIn: 'root' })
export class StoreService {
  private departmentsSubject = new BehaviorSubject<Department[] | null>(null);

  departments$ = this.departmentsSubject.asObservable();

  setDepartments(departments: Department[]) {
    this.departmentsSubject.next(departments);
  }

  getDepartmentsSnapshot(): Department[] | null {
    return this.departmentsSubject.value;
  }

  hasDepartments(): boolean {
    return !!this.departmentsSubject.value?.length;
  }
}
