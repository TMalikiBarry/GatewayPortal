import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, ValidationErrors, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatStepper} from "@angular/material/stepper";
import {ServiceTransService} from "../../service/ServicesTrans/service-trans.service";
import {ParamListInterface} from "../../model/param-list.interface";
import {AVAILABLE_SERVICES} from "../../../assets/List-Service-Dispo/Available_Services";
import {ResponsePaymentInterface} from "../../model/response-payment.interface";

@Component({
  selector: 'app-dialog-transaction',
  templateUrl: './dialog-transaction.component.html',
  styleUrls: ['./dialog-transaction.component.scss']
})
export class DialogTransactionComponent implements OnInit {

  resPayment!: ResponsePaymentInterface;
  resMessage!: string;
  succesTransaction = false;
  amount: number = 10;
  myService!: string;

  infoForm = this.fb.group({
    senderName: ['Freeman Kay', Validators.required],
    senderMobileNo: ['0202205113', Validators.required],
    beneficiaryName: ['Stephen Kojo', Validators.required],
    beneficiaryMobileNo: ['0233445566', Validators.required],
    senderId: [''],
    secretCode: [''],
  });
  @ViewChild('stepper') stepper!: MatStepper;
  expediteurGereFrais: boolean = false;
  frais: number = 1750;

  constructor(private fb: FormBuilder,
              private _snackBar: MatSnackBar,
              private tService: ServiceTransService) {
  }

  ngOnInit(): void {
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

  gestionFrais() {

  }

  onChooseService(service: string) {
    if (!AVAILABLE_SERVICES.includes(service)) {
      this.myService = '';
      this.snackMessage(`Le service ${service} n'est pas encore disponible`, 3000, 'delete');
      return;
    }
    this.myService = service;
  }

  /*getChosenService(): string {
    return this.serviceMap.get(Object.keys(this.serviceMap)[0])!;
  }*/

  infoStep() {
    if (!this.myService) {
      this.snackMessage(`Veuillez choisir un service`, 3000, 'delete');
      return;
    }
    if (!this.amount) {
      this.snackMessage(`Veuillez renseigner un montant, ex: 15000`, 3000, 'delete');
      return;
    }
    this.stepper.next();
  }

  toRecapStep() {
    if (this.infoForm.invalid) {
      this.snackMessage(`Il y a des champs invalides`, 3000, 'delete');
      return;
    }
    this.stepper.next();
  }

  executeTransaction() {
    /*    senderName: string;
        senderMobileNo: string;
        amount: number;
        senderId?: string;
        beneficiaryMobileNo: string;
        // ccy: string;
        beneficiaryName: string;*/
    if (this.infoForm.invalid || !this.amount) {
      this.snackMessage('Veuillez remplir les champs nécessaires', 3000, 'delete');
      return;
    }
    this.snackMessage('Transaction en cours de traitement', 3500, 'none');
    const {senderName, senderMobileNo, beneficiaryName, beneficiaryMobileNo} = this.infoForm.value;
    let paramList: ParamListInterface = {
      senderName: senderName ?? '',
      senderMobileNo: senderMobileNo ?? '',
      beneficiaryName: beneficiaryName ?? '',
      beneficiaryMobileNo: beneficiaryMobileNo ?? '',
      amount: this.amount,
      secretCode: 'AWER1234',
      senderId: 'QWE345Y4',
    }
    this.tService.xPressCashTransaction(paramList).subscribe(
      res => {
        // this.resPayment= res;
        this.resMessage = res.response_message;
        console.table(res);
        this.snackMessage(`La transaction été réalisée, le code: ${res.response_code}, le message: ${res.response_message}, le contenu: ${res.response_content}`,
          4000, 'add');
        this.succesTransaction = res.response_code === 0;
        this.stepper.next();
      }
    );

  }

  snackMessage(msg: string, duration: number, style: 'add' | 'delete' | 'none') {
    let classStyle = style === 'none' ? 'no-style': 'custom-style-' + style;
    this._snackBar.open(msg,undefined,{
        duration,
        verticalPosition: "top",
        horizontalPosition: "center",
        panelClass: [classStyle]
      });
  }
}
