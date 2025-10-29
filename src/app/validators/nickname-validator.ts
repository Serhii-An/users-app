import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { map } from 'rxjs/operators';
import { DataService } from '../services/data.service';

export function nickNameUniqueValidator(service: DataService, editableId: string | undefined): AsyncValidatorFn {
  return (control: AbstractControl) => {
    return service.checkNickName(control.value).pipe(
      map(response => {
        if (editableId && (editableId === response[0]?.id)) {
          return null;
        }
        const isTaken = Array.isArray(response) && response.length > 0;
        return (isTaken ? { nickNameTaken: true } : null) 
      })
    );
  };
}
