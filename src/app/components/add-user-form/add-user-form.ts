import { OnInit, AfterViewInit, Component, ElementRef, ViewChild, inject, Input, ChangeDetectorRef } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { nickNameUniqueValidator } from '../../validators/nickname-validator';
import { Store } from '@ngrx/store';
import { loadUsers } from '../../store/users/users.actions';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User, UserFormValue, CitySearchResult, CityInSearchResponse, NewUser } from '../../models/interfaces';
import { BehaviorSubject, debounceTime, distinctUntilChanged, filter, fromEvent, map, switchMap, tap } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-add-user-form',
  standalone: true,
  imports: [CommonModule,
            ReactiveFormsModule,
            MatFormFieldModule,
            MatInputModule,
            MatButtonModule,
            MatAutocompleteModule,
            MatDialogModule,
            MatProgressSpinnerModule,
            MatIconModule,
            AsyncPipe],
  templateUrl: './add-user-form.html',
  styleUrls: ['./add-user-form.scss']
})

export class AddUserForm implements AfterViewInit, OnInit {
  @Input() user?: User;
  @Input() isEdit: boolean = false;
  @ViewChild('cityInput') cityInput!: ElementRef;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger!: MatAutocompleteTrigger;
  addUserForm!: FormGroup;
  defaultCities: string[] = ['Львів', 'Київ', 'Суми'];
  cityOptions: string[] = [...this.defaultCities];
  file: File | null = null;
  previewUrl: string | null = null;
  isCitySeaerching: boolean = false;
  showTip: boolean = false;
  minSearchLength: number = 3;
  tipText$ = new BehaviorSubject<string>(`Enter at least ${this.minSearchLength} characters`);

  allowedImgFormats = ['jpg', 'png', 'gif', 'webp'];
  showImgError = false;


  private dataService = inject(DataService);
  private store = inject(Store);
  private dialogRef = inject(MatDialogRef<AddUserForm>, { optional: true });
  private cdr = inject(ChangeDetectorRef);

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.file = input.files[0];
      const extension = this.file.name.split('.').pop()?.toLowerCase();

      if (extension && !this.allowedImgFormats.includes(extension)) {
        this.showImgError = true;
        return
      }

      const reader = new FileReader();
          reader.onloadstart = () => {
      };

      reader.onload = () => {
        this.previewUrl = reader.result as string;
        this.addUserForm.get('avatar')?.setValue( this.previewUrl);
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(this.file);
    }
  }

  deleteImg() {
    this.addUserForm.get('avatar')?.setValue(null);
    this.previewUrl = null;
    this.showImgError = false;
  }


  mapToUser(raw: Partial<UserFormValue>): NewUser {
    return {
      firstName: raw.firstName ?? '',
      nickName: raw.nickName ?? '',
      lastName: raw.lastName ?? '',
      avatar: raw.avatar ?? null,
      phoneNumber: raw.phoneNumber ?? '',
      email: raw.email ?? '',
      city: raw.city ?? '',
      address: raw.address ?? ''
    };
  }


  onSubmit(): void {
    this.addUserForm.get('nickName')?.updateValueAndValidity();
    if (this.addUserForm.invalid) return;

    const userData = this.mapToUser(this.addUserForm.value);
    this.dataService.addUser(userData, this.user?.id).subscribe(() => {
      this.store.dispatch(loadUsers());
      if (!this.isEdit) {
        this.addUserForm.reset();
      }
    });
  }


  onCancel() {
    this.dialogRef?.close();
  }

  initForm(): void {
    this.addUserForm = new FormGroup({
      firstName: new FormControl(this.user?.firstName || '', Validators.required),
      lastName: new FormControl(this.user?.lastName || ''),
      nickName: new FormControl(this.user?.nickName || '', {
        validators: [Validators.required],
        asyncValidators: [nickNameUniqueValidator(this.dataService, this.user?.id)]
      }),
      avatar: new FormControl<File | null>(this.user?.avatar || null),
      phoneNumber: new FormControl(this.user?.phoneNumber || '', Validators.pattern(/^\d+$/)),
      email: new FormControl(this.user?.email || '', Validators.email),
      city: new FormControl(this.user?.city || ''),
      address: new FormControl(this.user?.address || ''),
    });
  }


  ngOnInit() {
    this.initForm();
  }


  ngAfterViewInit(): void {
    fromEvent<KeyboardEvent>(this.cityInput.nativeElement, 'keyup')
      .pipe(
        tap(() => {
          this.cityOptions = [];
          this.showTip = true;
          this.isCitySeaerching = true;
        }),
        debounceTime(300),
        map((event: Event) => (event.target as HTMLInputElement).value),
        filter(value => value.length >= this.minSearchLength),
        distinctUntilChanged(),
        switchMap((searchStr: string) => this.dataService.getCity(searchStr))
      )
      .subscribe((res: CitySearchResult) => {
        if (res.success === 'false') {
          this.tipText$.next(res.error.text);
        } else if (res.success === 'true' && res.data.length) {
          this.showTip = false;
          this.cityOptions = res.data.map((city: CityInSearchResponse) => city.description);
          this.autocompleteTrigger.openPanel();
          this.isCitySeaerching = false;
        }
      });
  }
}
