import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Employee, EmployeeImage } from './employee';
import { TokenStorageService } from '../../../_services/loginService/token-storage.service';
import { EmployeeService } from '../../../_services/employees/employee.service';
import { CoreService } from '../../../_services/core/core.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { EmpAddEditComponent } from './emp-add-edit/emp-add-edit.component';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule,
    HttpClientModule,
    MatCardModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss'
})
export class EmployeesComponent implements OnInit {
  selectedFileUrl: any = null;
  displayedColumns: string[] = [
    'id',
    'firstname',
    'lastname',
    'email',
    'gender',
    'team',
    'employeeImages',
    'action',
  ];

 
  roles: string[] = [];
  isLoggedIn = false;
  employeeCount: number | null = null;
  dataSource!: MatTableDataSource<Employee>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private tokenStorageService: TokenStorageService,
    private route: ActivatedRoute,
    private router: Router,
    private _dialog: MatDialog,
    private _empService: EmployeeService,
    private _coreService: CoreService,
    private _sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();
    this.route.paramMap.subscribe((param) => {
      const teamId = Number(param.get('teamId'));
      console.log("teamId:", teamId);
      this.getEmployeesByTeam(teamId);
    });
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
    }

    this.getCountOfEmployees(); // Call count method on component initialization
  }

  getEmployeesByTeam(teamId: number) {
    this._empService.getByTeam(teamId.toString()).subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  openAddEditEmpForm() {
    const dialogRef = this._dialog.open(EmpAddEditComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getEmployeeList();
        }
      },
    });
  }

  getEmployeeList() {
    this._empService.getAllEmployees().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: console.error,
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteEmployee(id: number) {
    this._empService.deleteEmployee(id).subscribe({
      next: (res) => {
        this._coreService.openSnackBar('Employee deleted!', 'done');
        location.reload();
        this.getEmployeeList();
      },
      error: console.error,
    });
  }

  openEditForm(data: any) {
    const dialogRef = this._dialog.open(EmpAddEditComponent, {
      data: { employee: data, selectedFileName: data.image ? data.image : null },
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getEmployeeList();
        }
      },
    });
  }
  getImageUrl(image: EmployeeImage): SafeUrl | null {
    if (image && image.picByte) {
      const imageUrl = 'data:' + image.type + ';base64,' + image.picByte;
      return this._sanitizer.bypassSecurityTrustUrl(imageUrl);
    }
    return null;
  }
  getCountOfEmployees() {
    this._empService.countEmployees().subscribe(count => {
      this.employeeCount = count;
      console.log('Total employees:', count);
      // You can use the count as needed, e.g., display it on the UI or perform any other logic.
    });
  }
}
