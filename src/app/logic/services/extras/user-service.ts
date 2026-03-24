import { Injectable } from "@angular/core";
import { CreateUserRequest, UpdateUserRequest } from "../../interfaces/extras/users-interface";
import { FormGroup } from "@angular/forms";

@Injectable({
    providedIn: 'root',
})
export class UserService{

    convertToCreateUser(formData: any): CreateUserRequest {
        return { 
            name: formData.nameFormControl,
            lastName: formData.lastNameFormControl,
            email: formData.emailFormControl,
            username: formData.usernameFormControl,
            password: formData.passwordFormControl,
        }
    }
    convertToUpdateUser(formData: any): UpdateUserRequest {
        return { 
            name: formData.nameFormControl,
            lastName: formData.lastNameFormControl,
            email: formData.emailFormControl,
            username: formData.usernameFormControl,
        }
    }

      handleFormErrors(errors: any, formGroup: FormGroup) {
        for (let index = 0; index < errors.length; index++) {
            const element = errors[index];
            if(element.field == "username"){
                formGroup.get('usernameFormControl')?.setErrors({'validation': element.message});
            }
            if(element.field == "email"){
                formGroup.get('emailFormControl')?.setErrors({'validation': element.message});
            }
            if(element.field == "password"){
                formGroup.get('passwordFormControl')?.setErrors({'validation': element.message});
            }
            if(element.field == "verifyPassword"){
                formGroup.get('verifyPasswordFormControl')?.setErrors({'validation': element.message});
            }
        }
        formGroup.markAllAsTouched();
    }

}