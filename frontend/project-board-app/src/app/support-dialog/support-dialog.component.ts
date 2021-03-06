import { Component, OnInit, HostListener } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { environment} from 'src/environments/environment';
import { CONTACT_SUPPORT_TOOLTIP } from '../tooltips';

@Component({
  selector: 'app-support-dialog',
  templateUrl: './support-dialog.component.html',
  styleUrls: ['./support-dialog.component.scss']
})

export class SupportDialogComponent implements OnInit {
  supportEmail: string;
  mobile: boolean;
  contactSupportTooltip = CONTACT_SUPPORT_TOOLTIP;

  constructor(public dialogRef: MatDialogRef<SupportDialogComponent>) {}

   ngOnInit() {
    this.supportEmail = environment.supportEmail;
    this.mobile = document.body.clientWidth < 992;
     }

  @HostListener('window:resize')
      onResize(): void {
         this.mobile = document.body.clientWidth < 992;
      }
}
