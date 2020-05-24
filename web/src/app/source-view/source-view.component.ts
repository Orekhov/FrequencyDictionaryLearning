import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgramService } from '../services/ngram.service';
import { SourceStats } from '../types/types';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-source-view',
  templateUrl: './source-view.component.html',
  styleUrls: ['./source-view.component.css']
})
export class SourceViewComponent implements OnInit, OnDestroy {

  sourceStats: SourceStats;
  sourceNumber: string;

  public subscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private ngramService: NgramService) { }

  ngOnInit(): void {
    const paramMap = this.route.snapshot.paramMap;
    this.sourceNumber = paramMap.get('sourceNumber');
    this.subscription = this.ngramService.getSourceStats(this.sourceNumber).subscribe(r => {
      this.sourceStats = r;
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
