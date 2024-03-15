import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-leave-request',
  standalone: true,
  imports: [],
  templateUrl: './leave-request.component.html',
  styleUrl: './leave-request.component.scss'
})
export class LeaveRequestComponent {
  leaveForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.leaveForm = this.fb.group({
      name: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      reason: ['', Validators.required]
    });
  }
  initializeTextField(value: string = '', validators: any[] = []): FormControl {
    return new FormControl(value, validators);
  }

  initializeFormGroup(fields: any): FormGroup {
    const formGroup: { [key: string]: FormControl } = {}; // Type assertion to ensure string keys

    for (const key in fields) {
      if (fields.hasOwnProperty(key)) {
        formGroup[key] = this.initializeTextField(fields[key].value, fields[key].validators);
      }
    }

    return new FormGroup(formGroup);
  }
 /* onSubmit(): void {
    if (this.leaveForm.valid) {
      this.leaveRequestService.submitLeaveRequest(this.leaveForm.value).subscribe(
        response => {
          console.log('Leave request submitted successfully', response);
          // Handle success response
        },
        error => {
          console.error('Error submitting leave request', error);
          // Handle error response
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }*/
}