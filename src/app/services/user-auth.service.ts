import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, user, User } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { Observable, from, switchMap, of } from 'rxjs';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  createdAt: Date;
  lastLoginAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  private auth = inject(Auth);
  private fireStore = inject(Firestore);

  user$ = user(this.auth);

  constructor() { }
  signUp(email: string, password: string, displayName: string): Observable<void> {
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap(({ user }) => this.createUserProfile(user, displayName))
    );
  }

  // Sign in with email and password
  signIn(email: string, password: string): Observable<void> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap(({ user }) => this.updateLastLogin(user.uid))
    );
  }

  // Sign out
  signOut(): Observable<void> {
    return from(signOut(this.auth));
  }

  // Create user profile in Firestore
  private createUserProfile(user: User, displayName: string): Observable<void> {
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      displayName,
      createdAt: new Date(),
      lastLoginAt: new Date()
    };

    const userDocRef = doc(this.fireStore, `users/${user.uid}`);
    return from(setDoc(userDocRef, userProfile));
  }

  // Update last login time
  private updateLastLogin(uid: string): Observable<void> {
    const userDocRef = doc(this.fireStore, `users/${uid}`);
    return from(setDoc(userDocRef, { lastLoginAt: new Date() }, { merge: true }));
  }

  // Get user profile
  getUserProfile(uid: string): Observable<UserProfile | null> {
    const userDocRef = doc(this.fireStore, `users/${uid}`);
    return from(getDoc(userDocRef)).pipe(
      switchMap(docSnap => {
        if (docSnap.exists()) {
          return of(docSnap.data() as UserProfile);
        }
        return of(null);
      })
    );
  }

  // Get current user
  getCurrentUser(): Observable<User | null> {
    return this.user$;
  }
}
