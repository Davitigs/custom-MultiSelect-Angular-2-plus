import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MultiselectComponent } from './multiselect/multiselect.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MapperPipe } from './mapper.pipe';
import { OutsideClickDirective } from './outside-click.directive';

@NgModule({
  declarations: [
    AppComponent,
    MultiselectComponent,
    MapperPipe,
    OutsideClickDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
