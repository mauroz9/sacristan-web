import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SequenceDetailComponent } from './sequence-detail-component';

describe('SequenceDetailComponent', () => {
  let component: SequenceDetailComponent;
  let fixture: ComponentFixture<SequenceDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SequenceDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SequenceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
