import { Component, OnInit, signal } from '@angular/core';
import { ReproductionDetailDTO } from '../../../logic/interfaces/reproducciones-interface';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { AlumnosService } from '../../../logic/services/alumnos-service';
import { LoadingComponent } from "../shared/loading-component/loading-component";

@Component({
  selector: 'app-reproduction-detail-view-component',
  imports: [CommonModule, LoadingComponent],
  templateUrl: './reproduction-detail-view-component.html',
  styleUrl: './reproduction-detail-view-component.css',
})
export class ReproductionDetailViewComponent implements OnInit {
  isLoading = signal(true);
  detail?: ReproductionDetailDTO;

  constructor(
    private route: ActivatedRoute,
    private alumnosService: AlumnosService,
    private location: Location
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.alumnosService.getReproductionDetail(+id).subscribe({
        next: (data) => {
          this.detail = data;
          this.isLoading.set(false);
        },
        error: () => this.goBack()
      });
    }
  }

  getInitials(name?: string) {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  goBack() { this.location.back(); }
}
