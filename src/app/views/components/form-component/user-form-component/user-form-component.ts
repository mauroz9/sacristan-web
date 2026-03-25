import { ChangeDetectorRef, Component, input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../logic/services/extras/user-service';
import { firstValueFrom } from 'rxjs';
import { LoadingComponent } from "../../shared/loading-component/loading-component";
import { ExtraService } from '../../../../logic/services/extras-service';

@Component({
  selector: 'app-user-form-component',
  imports: [ReactiveFormsModule, LoadingComponent],
  templateUrl: './user-form-component.html',
  styleUrl: './user-form-component.css',
})
export class UserFormComponent implements OnInit {

  kind = input<string>();
  userId: number | null = null;
  loading: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute, private cdr: ChangeDetectorRef, private extraService: ExtraService) {}

  userFormGroup: FormGroup = new FormGroup({
    nameFormControl: new FormControl('',[Validators.required, Validators.minLength(1)]),
    lastNameFormControl: new FormControl('',[Validators.required, Validators.minLength(1)]),
    emailFormControl: new FormControl('',[Validators.required, Validators.minLength(1), Validators.email]),
    usernameFormControl: new FormControl('',[Validators.required, Validators.minLength(1)]),
    passwordFormControl: new FormControl('',[Validators.required, Validators.minLength(8)]),
  });

  ngOnInit(): void {
    this.loading = true;
  }

  async ngAfterViewInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if(id){
      this.userId = Number(id);
      let baseUser = await firstValueFrom(this.extraService.getUserById(this.userId));
      
      this.userFormGroup.get('passwordFormControl')?.setValidators([]);
      this.userFormGroup.get('passwordFormControl')?.updateValueAndValidity();

      this.userFormGroup.patchValue({
        nameFormControl: baseUser.name,
        lastNameFormControl: baseUser.lastName,
        emailFormControl: baseUser.email,
        usernameFormControl: baseUser.username,
      });
    }
    this.loading = false;
    this.cdr.detectChanges(); // Force a re-check
  }
  
}