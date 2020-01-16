import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'password-verification',
  templateUrl: './password-verification.component.html',
  styleUrls: ['./password-verification.component.scss']
})
export class PasswordVerificationComponent implements OnInit {
  @Input() passwordInfoArr = [];
  constructor() { }

  ngOnInit() {
  }

}
