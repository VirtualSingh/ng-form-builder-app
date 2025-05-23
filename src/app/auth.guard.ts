import { CanActivateFn } from '@angular/router';

import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserAuthService } from './services/user-auth.service';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const authService = inject( UserAuthService);
  const router = inject(Router);

  return authService.getCurrentUser().pipe(
    take(1),
    map(user => {
      if(user){
        return true
      }else{
        router.navigate(['/auth']);
        return false;
      }
    })
  )
};
