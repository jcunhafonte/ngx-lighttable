import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgXLightTableComponent} from './components/ngx-lighttable.component';
import {NgXLightTableCellComponent} from './components/ngx-lighttable-cell.component';

export * from './components/ngx-lighttable.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        NgXLightTableComponent,
        NgXLightTableCellComponent,
    ],
    exports: [
        NgXLightTableComponent,
        NgXLightTableCellComponent
    ]
})
export class NgXLightTableModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: NgXLightTableModule
        };
    }
}
