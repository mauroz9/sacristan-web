import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SequenceListPage } from './sequence-list-page';

describe('SequenceListPage', () => {
  let component: SequenceListPage;
  let fixture: ComponentFixture<SequenceListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SequenceListPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SequenceListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
