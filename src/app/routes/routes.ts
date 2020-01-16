import { AuthGuard } from '@app/common';

export const routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: 'admin',
    loadChildren: '../layout/layout.module#LayoutModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'activation',
    loadChildren: './activation/activation.module#ActivationModule'
  },
  {
    path: 'login',
    loadChildren: './pages/login/login.module#LoginModule',
  },
  {
    path: 'view-po/:id',
    loadChildren: './view-po/view-po.module#ViewPoModule'
  },
  {
    path: 'view-payment-order/:id',
    loadChildren: './view-invoice/view-invoice.module#ViewInvoiceModule'
  },
  {
    path: 'recover',
    loadChildren: './pages/recover/recover.module#RecoverModule'
  },
  {
    path: 'reset-password/:token',
    loadChildren: './pages/reset-password/reset-password.module#ResetPasswordModule'
  },
  {
    path: 'browser-not-supported',
    loadChildren: './pages/browser-compatibilty/browser-compatibilty.module#BrowserCompatibiltyModule'
  },
  { path: '**', redirectTo: 'admin' }

];
