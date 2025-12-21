import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../logic/services/user-service';
import { User } from '../../../logic/interfaces/user-interface';
import { firstValueFrom } from 'rxjs';
import { UserFormModalComponent } from "../../components/form-modals/user-form-modal-component/user-form-modal-component";

@Component({
  selector: 'app-user-test',
  imports: [UserFormModalComponent],
  templateUrl: './user-test.html',
  styleUrl: './user-test.css',
})
export class UserTest implements OnInit {

  constructor(private userService: UserService) {}

  crearUser: boolean = false;
  userList: User[] = [];

  async ngOnInit(): Promise<void> {
    this.userList = await firstValueFrom(this.userService.getUsers());
  }
  
  abrirModal() {
    this.crearUser = true
  }


}
