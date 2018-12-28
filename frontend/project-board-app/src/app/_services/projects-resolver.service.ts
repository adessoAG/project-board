import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Page, Project, ProjectService } from './project.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectsResolverService implements Resolve<Project[]> {

  constructor(private projectService: ProjectService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Project[]> {
    return this.projectService.getAllProjects();
  }
}
