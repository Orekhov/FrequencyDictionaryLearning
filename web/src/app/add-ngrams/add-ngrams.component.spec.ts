import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AddNgramsComponent } from './add-ngrams.component';
import { AppMaterialModule } from '../init/app-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgramService } from '../services/ngram.service';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DebugElement } from '@angular/core';

describe('Add Ngrams Component', () => {
    let fixture: ComponentFixture<AddNgramsComponent>;
    let mockNgramService: NgramService;
    let leftHintMessage: DebugElement;

    beforeEach(() => {
        mockNgramService = jasmine.createSpyObj(['addRaw']);
        TestBed.configureTestingModule({
            declarations: [AddNgramsComponent],
            imports: [
                FormsModule,
                ReactiveFormsModule,
                BrowserAnimationsModule,
                AppMaterialModule
            ],
            providers: [
                { provide: NgramService, useValue: mockNgramService }
            ]
        });
        fixture = TestBed.createComponent(AddNgramsComponent);
        fixture.detectChanges();
        leftHintMessage = fixture.debugElement.queryAll(By.css('mat-hint'))[0];
    });

    it('should not show validation error yet', () => {
        expect(leftHintMessage.nativeElement.innerText).toBe('');
    });

    describe('when button is clicked', () => {
        beforeEach(() => {
            const btn = fixture.debugElement.query(By.css('button'));
            btn.nativeElement.click();
            fixture.detectChanges();

        });

        it('should show validation error', () => {
            expect(leftHintMessage.nativeElement.innerText).toBe('Min length is 500 characters');
        })
    });
});