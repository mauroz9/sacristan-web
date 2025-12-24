import { Component, input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../logic/services/user-service';
import { User } from '../../../../logic/interfaces/user-interface';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-user-form-component',
  imports: [ReactiveFormsModule],
  templateUrl: './user-form-component.html',
  styleUrl: './user-form-component.css',
})
export class UserFormComponent implements OnInit {

  kind = input<string>();
  isEditMode: boolean = false;
  userId: number | null = null;
  loading: boolean = false;

  constructor(private router: Router, private userService:UserService, private route: ActivatedRoute) {}

  baseUser : User = {
    id: 0,
    name: '',
    last_name: '',
    email: '',
    password: '',
    role_id: 0,
  }

  userFormGroup: FormGroup = new FormGroup({
    // Define form controls here as needed
    nameFormControl: new FormControl('',[Validators.required, Validators.minLength(1)]),
    lastNameFormControl: new FormControl('',[Validators.required, Validators.minLength(1)]),
    emailFormControl: new FormControl('',[Validators.required, Validators.minLength(1), Validators.email]),
    passwordFormControl: new FormControl('',[Validators.required, Validators.minLength(8)]),
    // disabilityFormControl: new FormControl('',[Validators.required]),
    // photoFormControl: new FormControl('',[Validators.required]),
  });

  ngOnInit(): void {
    this.loading = true;
  }

  async ngAfterViewInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
  
    if(id){
      const userId = Number(id);
      this.baseUser = await firstValueFrom(this.userService.getUserById(userId));

      this.isEditMode = true;
      this.userId = Number(id);
      this.userFormGroup.get('passwordFormControl')?.setValidators([]);

      this.userFormGroup.patchValue({
        nameFormControl: this.baseUser.name,
        lastNameFormControl: this.baseUser.last_name,
        emailFormControl: this.baseUser.email,
        passwordFormControl: '',
      });
    }
    this.loading = false;
  }

}