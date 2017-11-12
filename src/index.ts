import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgXTableComponent} from './components/ngx-table.component';
import {NgXTableCellComponent} from './components/ngx-table-cell.component';

export * from './components/ngx-table.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        NgXTableComponent,
        NgXTableCellComponent,
    ],
    exports: [
        NgXTableComponent,
        NgXTableCellComponent
    ]
})
export class NgXTableModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: NgXTableModule,
            providers: []
        };
    }
}
