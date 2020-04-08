import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleManageFormComponent } from './module-manage-form.component';

describe('ModuleManageFormComponent', () => {
  let component: ModuleManageFormComponent;
  let fixture: ComponentFixture<ModuleManageFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModuleManageFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleManageFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
