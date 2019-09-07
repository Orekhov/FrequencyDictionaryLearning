import { Component, OnInit } from '@angular/core';

export interface NGramEntry {
  ngram: string;
  known: boolean;
  count: number;
}

const NGramEntries: NGramEntry[] = [
  { ngram: "the", known: true, count: 42424 },
  { ngram: "a", known: true, count: 42100 },
  { ngram: "code", known: true, count: 41301 },
  { ngram: "hack", known: false, count: 35304 },
  { ngram: "test", known: false, count: 32100 },
  { ngram: "test1", known: false, count: 22100 },
  { ngram: "test2", known: false, count: 20100 },
  { ngram: "test3", known: false, count: 19900 },
  { ngram: "test4", known: false, count: 19900 },
  { ngram: "test5", known: false, count: 19900 },
  { ngram: "test6", known: false, count: 19900 },
  { ngram: "test7", known: false, count: 19900 },
  { ngram: "test8", known: false, count: 19900 }
];

@Component({
  selector: 'app-word-list',
  templateUrl: './word-list.component.html',
  styleUrls: ['./word-list.component.css']
})
export class WordListComponent implements OnInit {

  displayedColumns: string[] = ['ngram', 'addToKnown', 'count'];
  dataSource = NGramEntries;

  constructor() { }

  ngOnInit() {
  }

}
