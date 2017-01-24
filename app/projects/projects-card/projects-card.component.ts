import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { I18nFileInfo, Language, Project } from '../../+models';
import { LanguageService } from "../../+services";

@Component({
  moduleId: module.id,
  selector: 'lh-projects-card',
  templateUrl: 'projects-card.component.html',
  styleUrls: [ 'projects-card.component.css' ]
})
export class ProjectsCardComponent implements OnInit {
  @Input()
  project: Project;

  constructor(private router: Router) { }

  ngOnInit() { }

  onOpen(project: Project): void {
    this.router.navigate(['/translations', project.id]);
  }

  maximumNumberOfTranslation(project: Project): number {
    let counts = project.i18nFiles.map((file: I18nFileInfo) => file.count);
    return Math.max(...counts);
  }

  languageOf(languageCode: string): Language {
    return LanguageService.find(languageCode);
  }
}