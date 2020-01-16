import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class HeaderService {
  userFullName = new BehaviorSubject('');
  profilePhoto = new BehaviorSubject('');
  heading = new BehaviorSubject('');

  setUserFullName (userFullName: string) {
    this.userFullName.next(userFullName);
  }

  setProfilePhoto (profilePhoto: string) {
    this.profilePhoto.next(profilePhoto);
  }

  setHeading (heading: string) {
    this.heading.next(heading);
  }
}
