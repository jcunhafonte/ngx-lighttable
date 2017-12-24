import {
    AfterContentInit,
    Component,
    ContentChildren,
    EventEmitter,
    Input,
    Output,
    QueryList,
    TemplateRef
} from '@angular/core';
import {NgXLightTableSettings} from '../types/ngx-lighttable-settings.type';
import {NgXLightTableHeader} from '../types/ngx-lighttable-settings-header.type';
import {NgXLightTableCellComponent} from './ngx-lighttable-cell.component';
import {NgXLightTableSortEvent} from '../types/ngx-lighttable-sort-event.type';

export const NGX_TABLE_DEFAULT_SETTINGS: NgXLightTableSettings = {
    headers: [],
    messages: {
        empty: 'No records found',
        loading: 'Loading records'
    },
    allowMultipleSort: true,
    allowNeutralSort: true
};

@Component({
    selector: 'ngx-lighttable',
    templateUrl: './ngx-lighttable.component.html',
    styleUrls: ['./ngx-lighttable.component.scss']
})
export class NgXLightTableComponent implements AfterContentInit {
    /**
     * @description Property injected with the records to render the table
     */
    @Input() public records: Object[] = [];

    /**
     * @description Sets table settings
     */
    @Input()
    public set settings(settings: NgXLightTableSettings) {
        this._settings = Object.assign({}, NGX_TABLE_DEFAULT_SETTINGS, settings);
    }

    /**
     * @description Property injected to define if table is being loaded e.g. async data
     */
    @Input() public isLoading: boolean;

    /**
     * @description Triggered when a single header is sorted
     */
    @Output() public onSort: EventEmitter<NgXLightTableSortEvent> = new EventEmitter<NgXLightTableSortEvent>();

    /**
     * @description Triggered when a row is clicked
     */
    @Output() public onClickRow: EventEmitter<Object> = new EventEmitter<Object>();

    /**
     * @description Triggered when a single cell is clicked
     */
    @Output() public onClickCell: EventEmitter<Object> = new EventEmitter<Object>();

    /**
     * @description Identify the templates inside the table
     */
    @ContentChildren(NgXLightTableCellComponent) public templateCells: QueryList<NgXLightTableCellComponent>;

    /**
     * @description Shortcut to handle template cells as an array
     */
    public cells: NgXLightTableCellComponent[];

    private _settings: NgXLightTableSettings = NGX_TABLE_DEFAULT_SETTINGS;

    ngAfterContentInit() {
        this._setCells();
        this._sortCells();
        this._checkWidths();
    }

    /**
     * @description Check if a single header as the sortable option enabled
     */
    public isSortable(header: NgXLightTableHeader): boolean {
        return header.sortable.enabled;
    }

    /**
     * @description Check if a single header is being sorted
     */
    public isSorting(header: NgXLightTableHeader): boolean {
        return header.sortable.direction !== NgXLightTableSortableDirectionEnum.neutral;
    }

    /**
     * @description Retrieve header settings
     */
    public getHeaders(): NgXLightTableHeader[] {
        return this._settings.headers;
    }

    /**
     * @description Retrieve css classes for arrow directions
     */
    public getArrowSortClasses(header: NgXLightTableHeader): Object {
        return {
            'ngx-lighttable__header-cell--sortable-arrow': !this.isSorting(header) || !this._checkSortDirection(header, NgXLightTableSortableDirectionEnum.neutral),
            'ngx-lighttable__header-cell--sortable-arrow-down': this._checkSortDirection(header, NgXLightTableSortableDirectionEnum.desc),
            'ngx-lighttable__header-cell--sortable-arrow-up': !this.isSorting(header) || this._checkSortDirection(header, NgXLightTableSortableDirectionEnum.asc)
        };
    }

    /**
     * @description Retrieve css classes for header
     */
    public getHeaderSortClasses(header: NgXLightTableHeader): any {
        return {
            'ngx-lighttable__header-cell--sortable': this.isSortable(header),
            'ngx-lighttable__header-cell--sorting': this.isSorting(header),
            [header.headerClass ? header.headerClass : '']: true
        };
    }

    /**
     * @description Triggered when single table header is clicked
     * @description Set all the different header to false and check the right order to table header
     */
    public handleSort(event: Event, header: NgXLightTableHeader): void {
        event.preventDefault();

        this._settings.headers.map((item: NgXLightTableHeader) => item.field !== header.field
            ? item.sortable.direction = NgXLightTableSortableDirectionEnum.neutral
            : item.sortable.direction = this._getNextSortDirection(item));

        this.onSort.emit({
            field: header.field,
            direction: NgXLightTableSortableDirectionEnum[header.sortable.direction]
        });
    }

    /**
     * @description Triggered when table row is clicked
     */
    public handleRow(event: Event, row: Object): void {
        event.preventDefault();
        this.onClickRow.emit(row);
    }

    /**
     * @description Triggered when single table cell is clicked
     */
    public handleCell(event: Event, field: string, row: number, cell: number): void {
        event.preventDefault();
        this.onClickCell.emit({value: this.records[row][field], field, row, cell});
    }

    /**
     * @description Returns the TemplateRef for the table cell or the default TemplateRef if none is passed
     */
    public getCellTemplate(cell: NgXLightTableCellComponent): TemplateRef<any> {
        return cell.templateRef || cell.defaultTemplateRef;
    }

    /**
     * @description Returns data-automation attribute by params received
     */
    public getAttrDataAutomation(area: string, value: string): string {
        return `table-${area}-${value}`;
    }

    /**
     * @description Get empty text for no records
     */
    public getEmptyText(): string {
        return this.isLoading ? this._settings.messages.loading : this._settings.messages.empty;
    }

    /**
     * @description Get colspan length to style no records row
     */
    public getColspan(): number {
        return this._settings.headers.length;
    }

    /**
     * @description Return if table has records
     */
    public hasRecords(): boolean {
        return this.records.length === 0;
    }

    /**
     * @description Check if a single header has an width option and if so get it
     * @returns {string}
     */
    public getWidth(header: NgXLightTableHeader): string | null {
        return header.width ? `${header.width}%` : null;
    }

    private _checkSortDirection(header: NgXLightTableHeader, direction: NgXLightTableSortableDirectionEnum): boolean {
        return header.sortable.direction === direction;
    }

    private _getNextSortDirection(header: NgXLightTableHeader): NgXLightTableSortableDirectionEnum {
        switch (header.sortable.direction) {
            case NgXLightTableSortableDirectionEnum.asc:
                return NgXLightTableSortableDirectionEnum.desc;
            case NgXLightTableSortableDirectionEnum.desc:
                return this._settings.allowNeutralSort ? NgXLightTableSortableDirectionEnum.neutral : NgXLightTableSortableDirectionEnum.asc;
            case NgXLightTableSortableDirectionEnum.neutral:
                return NgXLightTableSortableDirectionEnum.asc;
        }
    }

    private _checkWidths(): void {
        let widths = 0;
        this._settings.headers.map((header: NgXLightTableHeader) => header.width ? widths = widths + header.width : null);
        if (widths !== 0 && widths !== 100) {
            console.warn(`Table component: your width percentage is ${widths}% of 100%`);
        }
    }

    private _setCells(): any {
        this.cells = this.templateCells.toArray();
    }

    private _sortCells(): void {
        let parseHeader: Object = {};
        let parseCells: any[] = [];
        this._settings.headers.map((header: NgXLightTableHeader, key: number) => parseHeader[header.field] = key);
        this.cells.map((cell: NgXLightTableCellComponent) => parseCells[parseHeader[cell.field]] = cell);
        this.cells = parseCells;
    }
}

export enum NgXLightTableSortableDirectionEnum {
    asc,
    desc,
    neutral
}
