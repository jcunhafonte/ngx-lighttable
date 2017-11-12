import {Component, Input, ContentChild, TemplateRef, ViewChild} from '@angular/core';
import {NgStyle, NgClass} from '@angular/common';

@Component({
    selector: 'ngx-table-cell',
    templateUrl: './ngx-table-cell.component.html'
})
export class NgXTableCellComponent {
    /**
     * @description Identifies the property to be displayed on the current cell
     */
    @Input()
    public field: string;

    /**
     * @description NgStyles to bind to the cell
     */
    @Input()
    public cellStyle: NgStyle;

    /**
     * @description NgClass to bind to the cell
     */
    @Input()
    public cellClass: NgClass;

    /**
     * @description Child template TemplateRef
     */
    @ContentChild(TemplateRef)
    public templateRef: TemplateRef<any>;

    /**
     * @description Default TemplateRef to use in case no template is passed in
     */
    @ViewChild('defaultTemplate')
    public defaultTemplateRef: TemplateRef<any>;
}
