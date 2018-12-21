import { formatDate } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthenticationService } from '../_services/authentication.service';
import { Application, Employee, EmployeeService } from '../_services/employee.service';
import { Project, ProjectService } from '../_services/project.service';
import {MatDialog} from '@angular/material';
import { ProjectComponent } from '../project/project.component';

@Component({
  selector: 'app-employee-management',
  templateUrl: './employee-management.component.html',
  styleUrls: ['./employee-management.component.scss']
})
export class EmployeeManagementComponent implements OnInit, OnChanges {
  @Input() selectedEmployee: Employee;
  @Input() adminControls = true;
  @Input() revokeable = false;
  @Input() bookmarks: Project[] = [];
  @Input() applications: Application[] = [];
  @Input() projects: Project[] = [];

  numberOfDaysSelect = [];

  destroy$ = new Subject<void>();

  constructor(private projectService: ProjectService,
              private employeeService: EmployeeService,
              private authService: AuthenticationService,
              public dialog: MatDialog,
              private router: Router) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedEmployee.currentValue && !changes.selectedEmployee.isFirstChange()) {
      if (!this.adminControls) {
        this.getBookmarks();
      }
      this.getApplications();
    }
  }

  ngOnInit() {
    for (let i = 1; i < 29; i++) {
      this.numberOfDaysSelect.push(i);
    }
    if (!this.adminControls) {
      this.getBookmarks();
    }
    if (this.selectedEmployee) {
      this.getApplications();
    }
  }

  activate(duration) {
    const accessEnd = new Date();
    accessEnd.setDate(accessEnd.getDate() + Number(duration.value));
    accessEnd.setHours(23, 59, 59, 999);
    const dateString = formatDate(new Date(), 'yyyy-MM-ddTHH:mm:ss.SSS', 'de');
    this.employeeService.setEmployeeAccessInfo(this.selectedEmployee.id, dateString)
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.selectedEmployee.accessInfo = user.accessInfo;
        this.selectedEmployee.duration = duration.value;
      });
  }

  deactivate() {
    this.employeeService.deleteEmployeeAccessInfo(this.selectedEmployee.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.selectedEmployee.accessInfo = user.accessInfo;
        this.selectedEmployee.duration = 0;
      });
  }

  getBookmarks() {
    this.employeeService.getBookmarks(this.selectedEmployee.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(bookmarks => this.bookmarks = bookmarks);
  }

  removeBookmark(projectId) {
    this.employeeService.removeBookmark(this.authService.username, projectId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.getBookmarks());
  }

  getApplications() {
    this.employeeService.getApplications(this.selectedEmployee.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(appls => this.applications = appls);
  }

  revokeApplication(appId) {
    this.employeeService.revokeApplication(this.authService.username, appId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.getApplications());
  }

  deleteProject(projectId) {
    this.projectService.deleteProject(projectId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.projects = this.projects.filter(p => p.id !== projectId));
  }

  editProject(projectId) {
    this.openDialog(projectId);
  }

  openDialog(projectId): void {

    const dialogRef = this.dialog.open(ProjectComponent, { panelClass: 'custom-dialog-container', data: {
      dataKey: projectId
    } });

    dialogRef.afterClosed().subscribe(result => {
     this.ngOnInit();
    });

  }

  isAdmin() {
    return this.authService.isAdmin;
  }
}
