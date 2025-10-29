import { Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/interfaces';
import { Store } from '@ngrx/store';
import { loadUsers } from '../../store/users/users.actions';
import { selectAllUsers } from '../../store/users/users.selectors';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { AddUserForm } from '../add-user-form/add-user-form';
import { Observable } from 'rxjs';
import { selectIsAdmin, selectIsEditor, selectLoggedUser } from '../../store/login/login.selector';
import { AppState } from '../../store/app.state';
import { DataService } from '../../services/data.service';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog';
import html2pdf from 'html2pdf.js';
import * as XLSX from 'xlsx';



@Component({
  selector: 'app-users-table',
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatIconModule,
    MatInputModule,
    MatSortModule,
    MatSelectModule,
    MatDialogModule,
    MatPaginator,
    MatPaginatorModule,
    MatButtonModule
  ],
  templateUrl: './users-table.html',
  styleUrl: './users-table.scss'
})

export class UsersTable implements OnInit {
  isAdmin$: Observable<boolean> = inject(Store<AppState>).select(selectIsAdmin);
  isEditor$: Observable<boolean> = inject(Store<AppState>).select(selectIsEditor);
  private store = inject(Store);
  private dialog = inject(MatDialog);
  private dataService = inject(DataService)
  originalData: User[] = [];
  multiSort: { active: string; direction: 'asc' | 'desc' }[] = [];


  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource = new MatTableDataSource<User>();

  exportToPDF() {
    const element = document.getElementById('print-section');
    if (element) {
      const clone = element.cloneNode(true) as HTMLElement;
      clone.querySelectorAll('.no-print').forEach(el => el.remove());
      html2pdf().from(clone).save();
    }
  }


  exportToExcel(): void {
    const filteredData = this.dataSource.data.map(({ firstName, lastName, nickName, phoneNumber, email, city, address }) => ({
      firstName,
      lastName, nickName, phoneNumber,
      email, city, address
    }));

    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'table-export.xlsx');
  }


  columns = [
    { columnDef: 'firstName', header: 'First Name' },
    { columnDef: 'lastName', header: 'Last Name' },
    { columnDef: 'nickName', header: 'Nick Name' },
    { columnDef: 'avatar', header: 'Avatar' },
    { columnDef: 'phoneNumber', header: 'Phone Number' },
    { columnDef: 'email', header: 'Email' },
    { columnDef: 'city', header: 'City' },
    { columnDef: 'address', header: 'Address' }
  ];

  
  searchableColumns: { columnDef: string; header: string }[] = [];
  displayedColumns: string[] = [];
  
  selectedFields: string[] = [];
  searchValue = '';


  applyFilter() {
    const filterValue = this.searchValue.trim().toLowerCase();

    this.dataSource.filterPredicate = (data:User, filter: string) => {
      const fieldsToSearch = this.selectedFields.length > 0
        ? this.selectedFields
        : this.searchableColumns.map(c => c.columnDef);

      return fieldsToSearch.some(field => {
        const value = (data[field as keyof typeof data] ?? '').toString().toLowerCase();
        return value.includes(filter);
      });
    };

    this.dataSource.filter = filterValue;
  }


  openModal(user: User): void {
    const dialogRef = this.dialog.open(AddUserForm, {
      panelClass: 'form-modal'
    });
    dialogRef.componentInstance.user = user;
    dialogRef.componentInstance.isEdit = true;
  }


  onDelete(user: User):void {
     const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: `Are you sure you want to delete the user ${user.firstName}`}
    }).afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.deleteUser(user);
      }
    });
  }


  deleteUser(user: User):void {
    this.dataService.deleteUser(user.id).subscribe(() => {
      this.store.dispatch(loadUsers());
    });
  }

  print(): void {
    window.print();
  }

  onSort(column: string, event: MouseEvent) {
    const existing = this.multiSort.find(s => s.active === column);

    if (event.ctrlKey) {
      if (existing) {
        existing.direction = existing.direction === 'asc' ? 'desc' : 'asc';
      } else {
        this.multiSort.push({ active: column, direction: 'asc' });
      }
    } else {
      this.multiSort = [{ active: column, direction: existing?.direction === 'asc' ? 'desc' : 'asc' }];
    }

    this.applyMultiSort();
  }

  applyMultiSort() {
    this.dataSource.data = [...this.originalData].sort((a, b) => {
      for (const sort of this.multiSort) {
        const key = sort.active as keyof User;
        const valueA = a[key];
        const valueB = b[key];

        const comparison = String(valueA).localeCompare(String(valueB));
        if (comparison !== 0) {
          return sort.direction === 'asc' ? comparison : -comparison;
        }
      }
      return 0;
    });
  }

  ngOnInit(): void {
    this.store.dispatch(loadUsers());
    this.store.select(selectAllUsers).subscribe(users => {
      this.dataSource.data = users;
       this.originalData = users;
    });

    if (this.isAdmin$) {
      this.columns.push({ columnDef: 'icons', header: '' })
    }

    this.searchableColumns = this.columns.filter(c => c.columnDef !== 'icons');
    this.displayedColumns = this.columns.map(c => c.columnDef);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
