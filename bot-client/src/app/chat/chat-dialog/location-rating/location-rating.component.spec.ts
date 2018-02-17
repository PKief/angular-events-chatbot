import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationRatingComponent } from './location-rating.component';

describe('LocationRatingComponent', () => {
  let component: LocationRatingComponent;
  let fixture: ComponentFixture<LocationRatingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationRatingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
