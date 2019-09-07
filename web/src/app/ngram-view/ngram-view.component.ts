import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ngram-view',
  templateUrl: './ngram-view.component.html',
  styleUrls: ['./ngram-view.component.css']
})
export class NgramViewComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngram: string;

  ngOnInit() {
    this.ngram = this.route.snapshot.paramMap.get('ngram');
  }

}
