import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgramService } from '../services/ngram.service';
import { RawTextInput } from '../types/types';
import { Store, select } from '@ngrx/store';
import { debounceTime, takeWhile, filter } from 'rxjs/operators';
import { AppState } from '../state/app.state';
import { getRawTextInputState } from '../state/add.raw.reducer';
import { UpdateAddRawForm } from '../state/add.raw.actions';


@Component({
  selector: 'app-add-ngrams',
  templateUrl: './add-ngrams.component.html',
  styleUrls: ['./add-ngrams.component.css']
})
export class AddNgramsComponent implements OnInit, OnDestroy {
  componentActive = true;
  rawTextInputForm: FormGroup;
  rawTextInputFormValidationError = '';
  RAW_TEXT_MIN_LENGTH = 500;
  RAW_TEXT_MAX_LENGTH = 200000;
  rawTextInputPlaceholder = 'Enter your text here';

  constructor(
    private store: Store<AppState>,
    private formBuilder: FormBuilder,
    private ngramService: NgramService) {
    this.rawTextInputForm = this.formBuilder.group({
      sourceName: '',
      rawText: ''
    });
  }

  ngOnInit() {
    this.store.pipe(select(getRawTextInputState), takeWhile(() => this.componentActive), filter(v => this.inputIsChanged(v)))
    .subscribe(rawTextInput => {
        this.rawTextInputForm.setValue({
          sourceName: rawTextInput.sourceName,
          rawText: rawTextInput.rawText
        });
    });
    this.rawTextInputForm.valueChanges.pipe(debounceTime(300))
      .subscribe(formData => {
        const formDataTyped = <RawTextInput>formData;
          this.store.dispatch(new UpdateAddRawForm(formDataTyped));
      });
  }

  ngOnDestroy(): void {
    this.componentActive = false;
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

  private inputIsChanged(input: RawTextInput) {
    const form = this.getFormValue();
    return form.sourceName !== input.sourceName ||
      form.rawText !== input.rawText;
  }

  private getFormValue(): RawTextInput {
    return this.rawTextInputForm.value;
  }

  private updateRawTextFieldValidationError() {
    this.rawTextInputFormValidationError = this.validateTextInput(this.getFormValue().rawText);
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
