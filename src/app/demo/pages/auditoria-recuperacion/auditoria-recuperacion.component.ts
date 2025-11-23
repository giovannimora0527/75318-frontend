import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { AuditoriaRecuperacionService } from 'src/app/services/auditoria-recuperacion.service';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-auditoria-recuperacion',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,
    MatTableModule, MatPaginatorModule, MatSortModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './auditoria-recuperacion.component.html',
  styleUrls: ['./auditoria-recuperacion.component.scss']
})
export class AuditoriaRecuperacionComponent implements OnInit {
  usernameControl = new FormControl('');
  descripcionControl = new FormControl('');
  startControl = new FormControl('');
  endControl = new FormControl('');
  page = 0;
  size = 20;
  resultados: any[] = [];
  totalElements = 0;
  fechaError: string = '';
  loading = false;
  pageSizes = [10, 20, 50];
  displayedColumns: string[] = ['username', 'fecha', 'descripcion'];
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private auditoriaRecuperacionService: AuditoriaRecuperacionService) {}

  ngOnInit(): void {
    this.usernameControl.valueChanges.pipe(debounceTime(350)).subscribe(() => { this.page = 0; this.buscar(); });
    this.descripcionControl.valueChanges.pipe(debounceTime(350)).subscribe(() => { this.page = 0; this.buscar(); });
    this.startControl.valueChanges.pipe(debounceTime(350)).subscribe(() => { this.page = 0; this.buscar(); });
    this.endControl.valueChanges.pipe(debounceTime(350)).subscribe(() => { this.page = 0; this.buscar(); });
    this.buscar();
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  buscar() {
    if (this.startControl.value && this.endControl.value && this.endControl.value < this.startControl.value) {
      this.fechaError = 'La fecha final no puede ser menor que la inicial.';
      return;
    } else {
      this.fechaError = '';
    }
    this.loading = true;
    this.auditoriaRecuperacionService.search({
      username: this.usernameControl.value,
      descripcion: this.descripcionControl.value,
      start: this.startControl.value,
      end: this.endControl.value,
      page: this.page,
      size: this.size
    }).subscribe({
      next: (res) => {
        this.resultados = res.content || [];
        this.totalElements = res.totalElements || 0;
        this.dataSource.data = this.resultados;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  setPageSize(size: number) {
    this.size = size;
    this.page = 0;
    this.buscar();
  }

  onPageChange(event: PageEvent) {
    this.page = event.pageIndex;
    this.size = event.pageSize;
    this.buscar();
  }
}
