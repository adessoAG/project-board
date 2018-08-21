import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Project, ProjectService } from '../services/project.service';

@Component({
  selector: 'app-user-ui',
  templateUrl: './user-ui.component.html',
  styleUrls: ['./user-ui.component.css']
})
export class UserUiComponent implements OnInit {
  projects: Project[] = [];
  selectedProject: Project;

  constructor(private projectsService: ProjectService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.data.subscribe((data: { projects: Project[] }) => {
      this.projects = data.projects;
      this.route.params.subscribe(params => {
        if (params.id) {
          this.setSelectedProject(params.id);
        }
      });
    });
  }

  private setSelectedProject(projectId: string) {
    for (let p of this.projects) {
      if (p.id == projectId) {
        this.selectedProject = p;
        return;
      }
    }
    this.selectedProject = null;
  }

  projectClicked(project) {
    this.selectedProject = project;
    this.router.navigate([`/projects/${project.id}`]);
  }
}