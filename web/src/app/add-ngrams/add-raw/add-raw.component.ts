import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AppState } from 'src/app/state/app.state';
import { Store, select } from '@ngrx/store';
import { NgramService } from 'src/app/services/ngram.service';
import { getRawTextInputState } from 'src/app/state/add.raw.reducer';
import { takeWhile, filter, debounceTime } from 'rxjs/operators';
import { RawTextInput } from 'src/app/types/types';
import { UpdateAddRawForm } from 'src/app/state/add.raw.actions';

@Component({
  selector: 'app-add-raw',
  templateUrl: './add-raw.component.html',
  styleUrls: ['./add-raw.component.css']
})
export class AddRawDialog implements OnInit, OnDestroy {
  componentActive = true;
  rawTextInputForm: FormGroup;
  rawTextInputFormValidationError = '';
  RAW_TEXT_MIN_LENGTH = 500;
  RAW_TEXT_MAX_LENGTH = 200000;
  rawTextInputPlaceholder = 'Enter your text here';
  isOkButtonEnabled = false;

  constructor(private store: Store<AppState>,
    private formBuilder: FormBuilder,
    private ngramService: NgramService,
    public dialogRef: MatDialogRef<AddRawDialog>) {
    this.rawTextInputForm = this.formBuilder.group({
      sourceName: '',
      rawText: ''
    });
  }

  ngOnInit(): void {
    this.store.pipe(select(getRawTextInputState), takeWhile(() => this.componentActive), filter(v => this.inputIsChanged(v)))
      .subscribe(rawTextInput => {
        this.rawTextInputForm.setValue({
          sourceName: rawTextInput.sourceName,
          rawText: rawTextInput.rawText
        });
        this.updateIsOkButtonEnabled();
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

  onCancel(): void {
    this.dialogRef.close();
  }

  onAdd(): void {
    const data = this.getFormValue();
    this.updateRawTextFieldValidationError();
    if (this.isValid(data)) {
      this.ngramService.addRaw(data).subscribe(d => {
        console.log(d);
      });
    }
    this.dialogRef.close();
  }

  onRawTextFieldFocusOut() {
    this.updateRawTextFieldValidationError();
    this.updateIsOkButtonEnabled();
  }

  private updateIsOkButtonEnabled() {
    this.isOkButtonEnabled = this.isValid(this.getFormValue());
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
