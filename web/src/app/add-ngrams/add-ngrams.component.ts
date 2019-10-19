import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgramService } from '../services/ngram.service';
import { RawTextInput } from '../types/types';



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
      sourceName: '',
      rawText: ''
    });
  }

  ngOnInit() {
  }

  onSubmit(data: RawTextInput) {
    this.updateRawTextFieldValidationError();
    if (this.isValid(data)) {
      this.ngramService.addRaw(data).subscribe(d => {
        console.log(d);
      });
    }
  }

  onRawTextFieldFocusOut() {
    this.updateRawTextFieldValidationError();
  }

  private updateRawTextFieldValidationError() {
    this.rawTextInputFormValidationError = this.validateTextInput(this.rawTextInputForm.value);
  }

  private isValid(data: RawTextInput): boolean {
    return this.validateTextInput(data.rawText) === '' &&
      this.validateSourceInfoInput(data.sourceName) === '';
  }

  private validateSourceInfoInput(sourceName: string) {
    return sourceName && sourceName.length && sourceName.length > 0 ? '' : 'Source name is required';
  }

  private validateTextInput(rawText: string): string {
    if (!rawText || !rawText.length || rawText.length < this.RAW_TEXT_MIN_LENGTH) {
      return `Min length is ${this.RAW_TEXT_MIN_LENGTH} characters`;
    } else if (rawText.length > this.RAW_TEXT_MAX_LENGTH) {
      return `Max length is ${this.RAW_TEXT_MAX_LENGTH} characters`;
    } else {
      return '';
    }
  }

}
