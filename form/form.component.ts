import { Component } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


function montantValidator(control: FormControl) {
  const value = control.value;


  if (value !== undefined && value !== null && !isNaN(value) && !isNaN(parseFloat(value))) {
    const numValue = parseFloat(value);
    if (numValue >= 0) {
      return null; 
    }
  }

  return { invalidMontant: true };
}


function tauxValidator(control: FormControl) {
  const value = control.value;

  if (value !== undefined && value !== null && !isNaN(value) && !isNaN(parseFloat(value))) {
    const numValue = parseFloat(value);
    if (numValue >= 0 && numValue <= 100) {
      return null; 
    }
  }

  
  return { invalidTaux: true };
}


function identifierValidator(control: FormControl) {
  const value = control.value;
  if (value && !/^[a-zA-Z0-9]+$/.test(value)) {
    return { invalidIdentifier: true };
  }
  return null;
}


function dateValidator(control: FormControl) {
  const value = control.value;
  if (value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return { invalidDate: true };
  }
  return null;
}

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent {
  declarationForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.declarationForm = this.fb.group({
      declarant: new FormGroup({
        typeIdentifiant: new FormControl('', Validators.required),
        identifiant: new FormControl('', [Validators.required, identifierValidator]),
        categorieContribuable: new FormControl('', Validators.required)
      }),

      referenceDeclaration: new FormGroup({
        acteDepot: new FormControl('', Validators.required),
        anneeDepot: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{4}$')]),
        moisDepot: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{1,2}$')])
      }),

      ajouterCertificat: this.fb.array([]),
      modifierCertificat: this.fb.array([]),
      annulerCertificat: this.fb.array([])
    });
  }

  get ajouterCertificat(): FormArray {
    return this.declarationForm.get('ajouterCertificat') as FormArray;
  }

  get modifierCertificat(): FormArray {
    return this.declarationForm.get('modifierCertificat') as FormArray;
  }

  get annulerCertificat(): FormArray {
    return this.declarationForm.get('annulerCertificat') as FormArray;
  }

  addAjouterCertificat() {
    const ajouterCertificatGroup = this.fb.group({
      IdTaxpayer: new FormGroup({
        MatriculeFiscal: new FormGroup({
          TypeIdentifiant: new FormControl('', [Validators.required, Validators.minLength(3)]),
          Identifiant: new FormControl('', [Validators.required, identifierValidator]),
          CategorieContribuable: new FormControl('', Validators.required)
        }),
        CIN: new FormGroup({
          TypeIdentifiant: new FormControl(''),
          Identifiant: new FormControl('', [identifierValidator]),
          DateNaissance: new FormControl('', dateValidator),
          CategorieContribuable: new FormControl('')
        }),
        Passeport: new FormGroup({
          TypeIdentifiant: new FormControl(''),
          Identifiant: new FormControl('', [identifierValidator]),
          DateNaissance: new FormControl('', dateValidator),
          Pays: new FormControl(''),
          CategorieContribuable: new FormControl('')
        }),
        CatreSejour: new FormGroup({
          TypeIdentifiant: new FormControl(''),
          Identifiant: new FormControl('', [identifierValidator]),
          DateNaissance: new FormControl('', dateValidator),
          Pays: new FormControl(''),
          CategorieContribuable: new FormControl('')
        }),
        AutreIdentifiantFiscal: new FormGroup({
          TypeIdentifiant: new FormControl(''),
          Identifiant: new FormControl('', [identifierValidator]),
          Pays: new FormControl(''),
          CategorieContribuable: new FormControl('')
        })
      }),
      Resident: new FormControl(''),
      NometprenomOuRaisonsociale: new FormControl(''),
      Adresse: new FormControl(''),
      Activite: new FormControl(''),
      InfosContact: new FormGroup({
        AdresseMail: new FormControl('', [Validators.email]),
        NumTel: new FormControl('', [Validators.pattern('^[0-9]{10}$')])
      }),
      DatePayement: new FormControl('', dateValidator),
      Ref_Certif_chez_Declarant: new FormControl(''),
      ListeOperations: new FormGroup({
        AnneeFacturation: new FormControl(''),
        CNPC: new FormControl(''),
        P_Charge: new FormControl(''),
        MontantHT: new FormControl('', montantValidator),
        TauxRS: new FormControl('', tauxValidator),
        TauxTVA: new FormControl('', tauxValidator),
        MontantTVA: new FormControl('', montantValidator),
        MontantTTC: new FormControl('', montantValidator),
        MontantRS: new FormControl('', montantValidator),
        TaxeAdditionnelle: new FormGroup({
          Code: new FormControl(''),
          Taux: new FormControl('', tauxValidator)
        }),
        MontantNetServi: new FormControl('', montantValidator),
        Devise: new FormGroup({
          CodeDevise: new FormControl(''),
          TauxChange: new FormControl(''),
          MontantRSDevise: new FormControl('', montantValidator),
          MontantTTCDevise: new FormControl('', montantValidator),
          MontantNetServiDevise: new FormControl('', montantValidator)
        })
      }),
      TotalPayement: new FormGroup({
        TotalMontantHT: new FormControl('', montantValidator),
        TotalMontantTVA: new FormControl('', montantValidator),
        TotalMontantTTC: new FormControl('', montantValidator),
        TotalMontantRS: new FormControl('', montantValidator),
        TotalTaxes: new FormGroup({
          TotalTaxeAdditionnelle: new FormControl('', montantValidator)
        }),
        TotalMontantNetServi: new FormControl('', montantValidator),
        TotalMontantDevise: new FormGroup({
          TotalMontantRS: new FormControl('', montantValidator),
          TotalMontantTTC: new FormControl('', montantValidator),
          TotalMontantNetServi: new FormControl('', montantValidator)
        })
      })
    });
    this.ajouterCertificat.push(ajouterCertificatGroup);
  }

  addModifierCertificat() {
    const modifierCertificatGroup = this.fb.group({
      Beneficiaire: new FormGroup({
        IdTaxpayer: new FormGroup({
          MatriculeFiscal: new FormGroup({
            TypeIdentifiant: new FormControl(''),
            Identifiant: new FormControl('', [identifierValidator]),
            CategorieContribuable: new FormControl('')
          }),
          CIN: new FormGroup({
            TypeIdentifiant: new FormControl(''),
            Identifiant: new FormControl('', [identifierValidator]),
            DateNaissance: new FormControl('', dateValidator),
            CategorieContribuable: new FormControl('')
          }),
          Passeport: new FormGroup({
            TypeIdentifiant: new FormControl(''),
            Identifiant: new FormControl('', [identifierValidator]),
            DateNaissance: new FormControl('', dateValidator),
            Pays: new FormControl(''),
            CategorieContribuable: new FormControl('')
          }),
          CatreSejour: new FormGroup({
            TypeIdentifiant: new FormControl(''),
            Identifiant: new FormControl('', [identifierValidator]),
            DateNaissance: new FormControl('', dateValidator),
            Pays: new FormControl(''),
            CategorieContribuable: new FormControl('')
          }),
          AutreIdentifiantFiscal: new FormGroup({
            TypeIdentifiant: new FormControl(''),
            Identifiant: new FormControl('', [identifierValidator]),
            Pays: new FormControl(''),
            CategorieContribuable: new FormControl('')
          })
        }),
        Resident: new FormControl(''),
        NometprenomOuRaisonsociale: new FormControl(''),
        Adresse: new FormControl(''),
        Activite: new FormControl(''),
        InfosContact: new FormGroup({
          AdresseMail: new FormControl('', [Validators.email]),
          NumTel: new FormControl('', [Validators.pattern('^[0-9]{10}$')])
        })
      }),
      DatePayement: new FormControl('', dateValidator),
      Ref_Certif_chez_Declarant: new FormControl(''),
      ListeOperations: new FormGroup({
        AnneeFacturation: new FormControl(''),
        CNPC: new FormControl(''),
        P_Charge: new FormControl(''),
        MontantHT: new FormControl('', montantValidator),
        TauxRS: new FormControl('', tauxValidator),
        TauxTVA: new FormControl('', tauxValidator),
        MontantTVA: new FormControl('', montantValidator),
        MontantTTC: new FormControl('', montantValidator),
        MontantRS: new FormControl('', montantValidator),
        TaxeAdditionnelle: new FormGroup({
          Code: new FormControl(''),
          Taux: new FormControl('', tauxValidator)
        }),
        MontantNetServi: new FormControl('', montantValidator),
        Devise: new FormGroup({
          CodeDevise: new FormControl(''),
          TauxChange: new FormControl(''),
          MontantRSDevise: new FormControl('', montantValidator),
          MontantTTCDevise: new FormControl('', montantValidator),
          MontantNetServiDevise: new FormControl('', montantValidator)
        })
      }),
      TotalPayement: new FormGroup({
        TotalMontantHT: new FormControl('', montantValidator),
        TotalMontantTVA: new FormControl('', montantValidator),
        TotalMontantTTC: new FormControl('', montantValidator),
        TotalMontantRS: new FormControl('', montantValidator),
        TotalTaxes: new FormGroup({
          TotalTaxeAdditionnelle: new FormControl('', montantValidator)
        }),
        TotalMontantNetServi: new FormControl('', montantValidator),
        TotalMontantDevise: new FormGroup({
          TotalMontantRS: new FormControl('', montantValidator),
          TotalMontantTTC: new FormControl('', montantValidator),
          TotalMontantNetServi: new FormControl('', montantValidator)
        })
      })
    });
    this.modifierCertificat.push(modifierCertificatGroup);
  }

  addAnnulerCertificat() {
    const annulerCertificatGroup = this.fb.group({
      Ref_Certif_chez_Declarant: new FormControl('', Validators.required)
    });
    this.annulerCertificat.push(annulerCertificatGroup);
  }

  verifyForm() {
    if (this.declarationForm.valid) {
      console.log(this.declarationForm.value);
    } else {
      console.log('Form is invalid');
    }
  }

  downloadPDF() {
    const data = document.getElementById('pdf-content'); 
    if (data) {
      html2canvas(data).then(canvas => {
        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        const heightLeft = imgHeight;

        const contentDataURL = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        let position = 0;

        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
        pdf.save('formulaire.pdf');
      });
    }
  }
}
