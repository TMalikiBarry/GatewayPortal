import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, ValidationErrors, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatStepper} from "@angular/material/stepper";
import {ParamListInterface} from "../../model/param-list.interface";
import {AVAILABLE_SERVICES} from "../../../assets/List-Service-Dispo/Available_Services";
import {ResponsePaymentInterface} from "../../model/response-payment.interface";
import {TransactionService} from "../../service/TransactionService/transaction.service";
import {
  StatutTransactionEnum,
  TransactionKey,
  TransactionModel,
  TypeTransactionEnum
} from "../../model/transaction.model";
import {Observable} from "rxjs";
import {ServiceModel} from "../../model/service.model";
import {map} from "rxjs/operators";
import {SousCompteModel} from "../../model/sousCompte.model";
import {UserModel} from "../../model/user.model";
import {MatSelectChange} from "@angular/material/select";

export interface TransactionType {
  value: TransactionKey;
  viewValue: string;
}

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
  listSousComptes$!: Observable<SousCompteModel[]>;
  chosenSousCompte!:SousCompteModel;
  chosenService!: ServiceModel | undefined;
  myServiceLabel!: string;
  typeTrasaction!: TransactionKey;
  listLogos: string [] = ["XPress Cash.webp", "LogoService.svg"];
  listServices$!: Observable<ServiceModel[]>;
  typeTransactionList = Object.keys(TypeTransactionEnum).map((key) => {
    return <TransactionType>{
      value: <TransactionKey>key,
      viewValue: (TypeTransactionEnum[key as TransactionKey] as string).replace(/_/g, ' ')
        .toLowerCase()
        .replace(/(^|\s)\S/g, (l) => l.toUpperCase())
    };
  });

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
              private tService: TransactionService) {
  }

  ngOnInit(): void {
    let myId: number = (<UserModel>JSON.parse(localStorage.getItem('currentUser')!)).id;
    this.listServices$ = this.tService.getAllService().pipe(
      map(res => res.data as ServiceModel []),
    );
    if (myId){
      this.listSousComptes$ = this.tService.getMySousComptes(myId).pipe(
        map(res => res.data as SousCompteModel[]),
      )
    }
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

  onChooseService(service: ServiceModel) {
    if (!AVAILABLE_SERVICES.includes(service.serviceName)) {
      this.snackMessage(`Le service ${this.myServiceLabel} n'est pas encore disponible`, 3000, 'delete');
      this.myServiceLabel = '';
      this.chosenService = undefined;
      return;
    }
    this.chosenService = service;
    this.myServiceLabel = service.serviceName;
  }

  /*getChosenService(): string {
    return this.serviceMap.get(Object.keys(this.serviceMap)[0])!;
  }*/

  infoStep() {
    if (!this.chosenSousCompte){
      this.snackMessage(`Veuillez choisir un sous compte`, 3000, 'delete');
      return;
    }
    if (!this.myServiceLabel) {
      this.snackMessage(`Veuillez choisir un service`, 3000, 'delete');
      return;
    }
    if (!this.typeTrasaction){
      this.snackMessage(`Veuillez choisir le type de la transaction`, 3000, 'delete');
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
      secretCode: senderMobileNo ?? 'YOOO',
      senderId: 'QWE345Y4',
    }
    this.tService.xPressCashTransaction(paramList).subscribe(
      resPayment => {
        // this.resPayment= res;
        this.resMessage = resPayment.response_message;
        console.table(resPayment);
        this.tService.postTransaction(this.getTransaction()).subscribe();
        this.snackMessage(`La transaction été réalisée, le code: ${resPayment.response_code}, le message: ${resPayment.response_message}, le contenu: ${resPayment.response_content}`,
          4000, 'add');
        this.succesTransaction = this.getTransaction().statut !== StatutTransactionEnum.SUSPICIOUS;
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

  getTransaction(): TransactionModel {
    return {
      destinataire: this.infoForm.controls['beneficiaryName'].value!,
      typeTransaction: TypeTransactionEnum[this.typeTrasaction],
      scompte: this.chosenSousCompte,
      service: this.chosenService!,
      montant: this.amount,
      dateTransaction: new Date(),
      commission: 0.1,
      statut: this.getTransactionStatus()
    }
  }

  getTransactionStatus(resCode?: number): StatutTransactionEnum{
    if (this.infoForm.controls['senderMobileNo'].value?.startsWith('22177')){
      return StatutTransactionEnum.SENT;
    } else if (this.infoForm.controls['senderMobileNo'].value?.startsWith('0202')){
      return StatutTransactionEnum.INITIATED
    } else if (this.infoForm.controls['senderMobileNo'].value?.startsWith('22170')) {
      return StatutTransactionEnum.FINISHED;
    }
    return StatutTransactionEnum.SUSPICIOUS;
  }

  afficheSousCompte($event: MatSelectChange) {
    console.log($event);
    console.log('TypeTrans', this.typeTrasaction);
    console.log('SousCompte', this.chosenSousCompte);
  }
}
