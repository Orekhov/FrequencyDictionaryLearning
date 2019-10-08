import { Component, OnInit } from '@angular/core';
import { NgramService, NGramEntry } from '../services/ngram.service';

@Component({
  selector: 'app-word-list',
  templateUrl: './word-list.component.html',
  styleUrls: ['./word-list.component.css']
})
export class WordListComponent implements OnInit {

  displayedColumns: string[] = ['ngram', 'addToKnown', 'count'];
  ngrams: NGramEntry[] = [];
  displayKnown = 'false';

  constructor(private ngramService: NgramService) { }

  ngOnInit() {
    this.updateNgramList();
  }

  onFiltersChanged() {
    this.updateNgramList();
  }

  updateNgramList() {
    this.ngramService.getNgrams('unigrams', this.displayKnown, String(25)).subscribe(d => {
      this.ngrams = d;
    });
  }

}
