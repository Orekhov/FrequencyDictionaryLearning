import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddRawDialog } from './add-raw/add-raw.component';
import { ScreenSizeService } from '../services/screen-size.service';


@Component({
  selector: 'app-add-ngrams',
  templateUrl: './add-ngrams.component.html',
  styleUrls: ['./add-ngrams.component.css']
})
export class AddNgramsComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private screenSizeService: ScreenSizeService
  ) {
  }

  ngOnInit() {
  }

  openAddRawDialog(): void {
    const width = this.screenSizeService.isScreenSmall() ? '90vw' : '1000px';
    const dialogRef = this.dialog.open(AddRawDialog, {
      width,
      maxWidth: '90vw'
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }

}
