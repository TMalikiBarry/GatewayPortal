import { Component, OnInit } from '@angular/core';
import {UserModel} from "../../model/user.model";
import {FormBuilder, ValidationErrors, Validators} from "@angular/forms";
import {startWith, tap} from "rxjs";
import {UserService} from "../../service/UserService/user.service";
import {LoginModel} from "../../model/login.model";
import {MatSnackBar} from "@angular/material/snack-bar";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-mon-profil',
  templateUrl: './mon-profil.component.html',
  styleUrls: ['./mon-profil.component.scss']
})
export class MonProfilComponent implements OnInit {
  currentUser!: UserModel;
  userId!: number;
  phonePattern = /^(7[0-9])\s(\d{3})\s(\d{2})\s(\d{2})$/;
  codeAndPhonepattern = /^(?:([+0])221\s)?(7[0-9])\s(\d{3})\s(\d{2})\s(\d{2})$/;
  checkControl = this.fb.control(false);
  isFormatted: boolean = false;
  monProfilForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(5)]],
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    number: ['', [Validators.required, Validators.pattern(this.phonePattern)]],
  });

  constructor(private fb: FormBuilder,
              private _snackBar: MatSnackBar,
              private userService: UserService,
              ) {
  }

  ngOnInit(): void {
    this.monProfilForm.disable();
    this.userId = (JSON.parse(localStorage.getItem('currentUser')!) as LoginModel).id;
    this.userService.getUser(this.userId).pipe(
      tap(console.dir),
      map(res => res.data as UserModel),
      tap(user => {
        this.currentUser = user;
        this.setFormValue(user);
      })
    ).subscribe();

    this.monProfilForm.controls['number'].valueChanges.subscribe((value) => {
        console.log('Je change', value);
        const formattedNumber = value!.replace(/\s+/g, '')
          .replace(/^(\d{2})(\d{3})(\d{2})(\d{2})$/, '$1 $2 $3 $4');
        if (value !== formattedNumber) {
          this.monProfilForm.controls['number'].patchValue(formattedNumber, {emitEvent: false});
        }
        /*if ( !this.isFormatted && value && !this.phonePattern.test(value)) {
          // Ajoute des espaces au numéro de téléphone
          const formattedNumber = value.replace(/^(7[0-9])\s*(\d{3})\s*(\d{2})\s*(\d{2})$/,
            '$1 $2 $3 $4');
          this.isFormatted = true;
          // Met à jour la valeur avec le numéro de téléphone formaté
          this.monProfilForm.controls['number'].setValue(formattedNumber);
        } else {
          this.isFormatted = false;
        }*/
      }
    )
  }

  updateUser() {
    if (this.checkEquality()) {
      return;
    }
    if (this.monProfilForm.valid) {
      let isUsernameModified = this.getUpdatedUser().username !== this.currentUser.username;
      if (isUsernameModified) {
        this._snackBar.open('Retenez bien votre identifiant car votre connexion va expirer ' +
          'et vous serez redirigé ver la page de connexion. Vous vous reconnecterez en l\'utilisant',
          undefined, {
            duration: 5000,
            verticalPosition: "top",
            horizontalPosition: "center",
            panelClass: ["custom-style-delete"]
          })
      }
      this.userService.putUser(this.getUpdatedUser(), this.userId).pipe(
        tap(() => {
          this.checkControl.setValue(false);

          if (!isUsernameModified)
            this._snackBar.open('Profil mis à jour avec succès',
              undefined, {
                duration: 3000,
                verticalPosition: "top",
                horizontalPosition: "center",
                panelClass: ["custom-style-add"]
              })
        }),
        tap(console.dir),
        map(res => res.data as UserModel)
      )
        .subscribe(user => {
          this.setFormValue(user);
          if (isUsernameModified) {
            localStorage.clear();
            location.reload();
          }
        })
    }
  }

  setFormValue(user: UserModel) {
    this.monProfilForm.controls['name'].setValue(user.name);
    this.monProfilForm.controls['username'].setValue(user.username);
    this.monProfilForm.controls['email'].setValue(user.email);
    let numeroTelephone: string = user.number!;
    if (!this.phonePattern.test(numeroTelephone)) {
      console.log(numeroTelephone.replace(/^(7[0-9])(\d{3})(\d{2})(\d{2})$/, '$1 $2 $3 $4'))
      numeroTelephone = numeroTelephone.replace(/\s+/g, ' ')
        .replace(/^(7[0-9])\s*(\d{3})\s*(\d{2})\s*(\d{2})$/, '$1 $2 $3 $4');
    }
    this.monProfilForm.controls['number'].setValue(numeroTelephone);
  }

  checkEquality(): boolean {
    if (this.areObjectsEqual(this.currentUser, this.getUpdatedUser())) {
      this._snackBar.open('Aucune modification n\'a été faite...',
        undefined, {
          duration: 3000,
          verticalPosition: "top",
          horizontalPosition: "center",
          panelClass: ["custom-style-delete"]
        })
      return true;
    }
    console.log('Pas équivalent');
    return false;
  }

  getUpdatedUser(): UserModel {
    return <UserModel>{
      id: this.currentUser.id,
      rememberMe: this.currentUser.rememberMe,
      idParent: this.currentUser.idParent,
      roles: this.currentUser.roles,
      ...this.monProfilForm.value,
      password: this.currentUser.password,
    }
  }

  areObjectsEqual(obj1: any, obj2: any): boolean {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (const key of keys1) {
      if (obj1[key] !== obj2[key]) {
        return false;
      }
    }
    return true;
  }

  getErrorMessage(errors: ValidationErrors) {
    if (errors['required']) {
      return 'Champ Obligatoire'
    } else if (errors['email']) {
      return 'Veuillez renseignez un format d\'email correct'
    } else if (errors['pattern']) {
      return 'Le champ est mal renseigné'
    } else if (errors['minlength']) {
      return 'Champ doit contenir au minimum ' + errors['minlength']['requiredLength'] + ' caracteres'
    } else {
      return "Erreur au niveau de ce champ"
    }
  }

  needUpdate() {
    this.checkControl.valueChanges.pipe(
      startWith(this.checkControl.value),
      tap(value => {
        if (value) {
          this.monProfilForm.enable();
        } else {
          this.monProfilForm.disable();
        }
      })
    ).subscribe();
  }
}
