import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgramService } from '../services/ngram.service';

interface RawTextInput {
  rawText: string;
}

@Component({
  selector: 'app-add-ngrams',
  templateUrl: './add-ngrams.component.html',
  styleUrls: ['./add-ngrams.component.css']
})
export class AddNgramsComponent implements OnInit {

  rawTextInputForm: FormGroup;
  rawTextInputFormValidationError = '';
  RAW_TEXT_MIN_LENGTH = 500;
  RAW_TEXT_MAX_LENGTH = 200000;
  rawTextInputPlaceholder = 'Enter your text here';

  constructor(private formBuilder: FormBuilder, private ngramService: NgramService) {
    this.rawTextInputForm = this.formBuilder.group({
      rawText: ''
    });
  }

  ngOnInit() {
  }

  onSubmit(data: RawTextInput) {
    this.updateValidationError();
    if (this.isValid(data)) {
      this.ngramService.addRaw(data.rawText).subscribe(d => {
        console.log(d);
      });
    }
  }

  onFocusOut() {
    this.updateValidationError();
  }

  private updateValidationError() {
    this.rawTextInputFormValidationError = this.validate(this.rawTextInputForm.value);
  }

  private isValid(data: RawTextInput): boolean {
    return this.validate(data) === '';
  }

  private validate(data: RawTextInput): string {
    if (!data.rawText || !data.rawText.length || data.rawText.length < this.RAW_TEXT_MIN_LENGTH) {
      return `Min length is ${this.RAW_TEXT_MIN_LENGTH} characters`;
    } else if (data.rawText.length > this.RAW_TEXT_MAX_LENGTH) {
      return `Max length is ${this.RAW_TEXT_MAX_LENGTH} characters`;
    } else {
      return '';
    }
  }

}
