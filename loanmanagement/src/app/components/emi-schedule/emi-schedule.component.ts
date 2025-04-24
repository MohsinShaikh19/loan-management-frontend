// components/emi-schedule/emi-schedule.component.ts
import { Component, OnInit, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import { EMIService } from '../../services/emi.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { EMISchedule } from '../../models/loan.model';

@Component({
  selector: 'app-emi-schedule',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './emi-schedule.component.html',
  styleUrls: ['./emi-schedule.component.scss']
})
export class EmiScheduleComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private emiService = inject(EMIService);
  private router = inject(Router);

  @Input() schedules: EMISchedule[] = []; // Properly declare the input
  displayedSchedules: EMISchedule[] = [];
  displayedColumns = ['paymentDate', 'emiAmount', 'principalAmount', 'interestAmount', 'status'];
    loanId: number | null = null;

  // Pagination
  pageSize = 5;
  currentPage = 0;
  totalItems = 0;

  ngOnInit(): void {
    this.loanId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.loanId) {
      this.loadEMISchedule(this.loanId);
    }
  }

  loadEMISchedule(loanId: number): void {
    this.emiService.getEMISchedule(loanId).subscribe({
      next: (schedules) => {
        this.schedules = schedules;
        this.totalItems = schedules.length;
        this.updateDisplayedSchedules();
      },
      error: (err) => {
        console.error('Failed to load EMI schedule:', err);
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.updateDisplayedSchedules();
  }

  private updateDisplayedSchedules(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedSchedules = this.schedules.slice(startIndex, endIndex);
  }

  goBack(): void {
    this.router.navigate(['/loans', this.loanId]);
  }
}