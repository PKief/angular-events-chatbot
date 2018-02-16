import { transition, trigger, style, animate, state } from '@angular/animations';

export const fadeIn = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('0.3s', style({ opacity: 1 })),
  ]),
]);

export const easeIn = trigger('easeIn', [
  state('active', style({ transform: 'translateX(0)' })),
  transition(':enter', [
      style({ transform: 'translateX(-100%)', opacity: 0 }),
      animate('0.5s ease-in'),
  ]),
]);
