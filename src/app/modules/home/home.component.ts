import { Component, NgZone, OnInit, inject } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarComponent } from '../calendar/calendar.component';
import { EmployeesComponent } from '../crud/employees/employees.component';
import { EmployeeService } from '../../_services/employees/employee.service';
import { TeamService } from '../../_services/teams/team.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatDivider,
    CalendarComponent,
    EmployeesComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  employeeCount: number | null = null;
  teamCount: number | null = null;

  constructor(private employeeService: EmployeeService,
    private teamService: TeamService
    ) {}

  ngOnInit(): void {
    this.getCountOfEmployees();
    this.getCountOfTeams();
  }

  getCountOfEmployees() {
    this.employeeService.countEmployees().subscribe(count => {
      this.employeeCount = count;
    });
  }
  getCountOfTeams() {
    this.teamService.countTeams().subscribe(count => {
      this.teamCount = count;
    });
  }
}