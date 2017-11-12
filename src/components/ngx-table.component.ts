import {
    AfterContentInit, Component, ContentChildren, EventEmitter, Input, Output, QueryList,
    TemplateRef
} from '@angular/core';
import {NgXTableSettings} from '../types/ngx-table-settings.type';
import {NgXTableHeader} from '../types/ngx-table-settings-header.type';
import {NgXTableCellComponent} from './ngx-table-cell.component';
import {NgXTableSortEvent} from '../types/ngx-table-sort-event.type';

export const NGX_TABLE_DEFAULT_SETTINGS: NgXTableSettings = {
    headers: [],
    messages: {
        empty: 'No records found',
        loading: 'Loading records'
    },
    allowMultipleSort: true,
    allowNeutralSort: true
};

@Component({
    selector: 'ngx-table',
    templateUrl: './ngx-table.component.html',
    styleUrls: ['./ngx-table.component.scss']
})
export class NgXTableComponent implements AfterContentInit {
    /**
     * @description Property injected with the records to render the table
     */
    @Input() public records: Object[] = [];

    /**
     * @description Sets table settings
     * @param settings
     * @type {NgXTableSettings}
     */
    @Input()
    public set settings(settings: NgXTableSettings) {
        this._settings = Object.assign({}, NGX_TABLE_DEFAULT_SETTINGS, settings);
    }

    /**
     * @description Property injected to define if table is being loaded e.g. async data
     */
    @Input() public isLoading: boolean;

    /**
     * @description Triggered when a single header is sorted
     * @type {EventEmitter<NgXTableSortEvent>}
     */
    @Output() public onSort: EventEmitter<NgXTableSortEvent> = new EventEmitter<NgXTableSortEvent>();

    /**
     * @description Triggered when a row is clicked
     * @type {EventEmitter<Object>}
     */
    @Output() public onClickRow: EventEmitter<Object> = new EventEmitter<Object>();

    /**
     * @description Triggered when a single cell is clicked
     * @type {EventEmitter<Object>}
     */
    @Output() public onClickCell: EventEmitter<Object> = new EventEmitter<Object>();

    /**
     * @description Identify the templates inside the table
     */
    @ContentChildren(NgXTableCellComponent) public templateCells: QueryList<NgXTableCellComponent>;

    /**
     * @description Shortcut to handle template cells as an array
     */
    public cells: NgXTableCellComponent[];

    private _settings: NgXTableSettings = NGX_TABLE_DEFAULT_SETTINGS;

    ngAfterContentInit() {
        this._setCells();
        this._sortCells();
        this._checkWidths();
    }

    /**
     * @description Check if a single header as the sortable option enabled
     * @param header
     * @returns {boolean}
     */
    public isSortable(header: NgXTableHeader): boolean {
        return header.sortable.enabled;
    }

    /**
     * @description Check if a single header is being sorted
     * @param header
     * @returns {boolean}
     */
    public isSorting(header: NgXTableHeader): boolean {
        return header.sortable.direction !== NgXTableSortableDirectionEnum.neutral;
    }

    /**
     * @description Retrieve header settings
     * @returns {NgXTableHeader[]}
     */
    public getHeaders(): NgXTableHeader[] {
        return this._settings.headers;
    }

    /**
     * @description Retrieve css classes for arrow directions
     * @param header
     * @returns {{ngx-table__header-cell--sortable-arrow: boolean, ngx-table__header-cell--sortable-arrow-down: boolean, ngx-table__header-cell--sortable-arrow-up: boolean}}
     */
    public getArrowSortClasses(header: NgXTableHeader): Object {
        return {
            'ngx-table__header-cell--sortable-arrow': !this.isSorting(header) || !this._checkSortDirection(header, NgXTableSortableDirectionEnum.neutral),
            'ngx-table__header-cell--sortable-arrow-down': this._checkSortDirection(header, NgXTableSortableDirectionEnum.desc),
            'ngx-table__header-cell--sortable-arrow-up': !this.isSorting(header) || this._checkSortDirection(header, NgXTableSortableDirectionEnum.asc)
        };
    }

    /**
     * @description Retrieve css classes for header
     * @param header
     * @returns {{ngx-table__header-cell--sortable: boolean, ngx-table__header-cell--sorting: boolean}}
     */
    public getHeaderSortClasses(header: NgXTableHeader): any {
        return {
            'ngx-table__header-cell--sortable': this.isSortable(header),
            'ngx-table__header-cell--sorting': this.isSorting(header),
            [header.headerClass ? header.headerClass : '']: true
        };
    }

    /**
     * @description Triggered when single table header is clicked
     * @description Set all the different header to false and check the right order to table header
     * @param event
     * @param header
     */
    public handleSort(event: Event, header: NgXTableHeader): void {
        event.preventDefault();

        this._settings.headers.map((item: NgXTableHeader) => item.field !== header.field
            ? item.sortable.direction = NgXTableSortableDirectionEnum.neutral
            : item.sortable.direction = this._getNextSortDirection(item));

        this.onSort.emit({
            field: header.field,
            direction: NgXTableSortableDirectionEnum[header.sortable.direction]
        });
    }

    /**
     * @description Triggered when table row is clicked
     * @param event
     * @param row
     */
    public handleRow(event: Event, row: Object): void {
        event.preventDefault();
        this.onClickRow.emit(row);
    }

    /**
     * @description Triggered when single table cell is clicked
     * @param event
     * @param field
     * @param row
     * @param cell
     */
    public handleCell(event: Event, field: string, row: number, cell: number): void {
        event.preventDefault();
        this.onClickCell.emit({value: this.records[row][field], field, row, cell});
    }

    /**
     * @description Returns the TemplateRef for the table cell or the default TemplateRef if none is passed
     * @param cell
     * @returns {TemplateRef<any>}
     */
    public getCellTemplate(cell: NgXTableCellComponent): TemplateRef<any> {
        return cell.templateRef || cell.defaultTemplateRef;
    }

    /**
     * @description Returns data-automation attribute by params received
     * @param area
     * @param value
     * @returns {string}
     */
    public getAttrDataAutomation(area: string, value: string): string {
        return `table-${area}-${value}`;
    }

    /**
     * @description Get empty text for no records
     * @returns {string}
     */
    public getEmptyText(): string {
        return this.isLoading ? this._settings.messages.loading : this._settings.messages.empty;
    }

    /**
     * @description Get colspan length to style no records row
     * @returns {number}
     */
    public getColspan(): number {
        return this._settings.headers.length;
    }

    /**
     * @description Return if table has records
     * @returns {boolean}
     */
    public hasRecords(): boolean {
        return this.records.length === 0;
    }

    /**
     * @description Check if a single header has an width option and if so get it
     * @param header
     * @returns {string}
     */
    public getWidth(header: NgXTableHeader): string | null {
        return header.width ? `${header.width}%` : null;
    }

    private _checkSortDirection(header: NgXTableHeader, direction: NgXTableSortableDirectionEnum): boolean {
        return header.sortable.direction === direction;
    }

    private _getNextSortDirection(header: NgXTableHeader): NgXTableSortableDirectionEnum {
        switch (header.sortable.direction) {
            case NgXTableSortableDirectionEnum.asc:
                return NgXTableSortableDirectionEnum.desc;
            case NgXTableSortableDirectionEnum.desc:
                return this._settings.allowNeutralSort ? NgXTableSortableDirectionEnum.neutral : NgXTableSortableDirectionEnum.asc;
            case NgXTableSortableDirectionEnum.neutral:
                return NgXTableSortableDirectionEnum.asc;
        }
    }

    private _checkWidths(): void {
        let widths = 0;
        this._settings.headers.map((header: NgXTableHeader) => header.width ? widths = widths + header.width : null);
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
        this._settings.headers.map((header: NgXTableHeader, key: number) => parseHeader[header.field] = key);
        this.cells.map((cell: NgXTableCellComponent) => parseCells[parseHeader[cell.field]] = cell);
        this.cells = parseCells;
    }
}

export enum NgXTableSortableDirectionEnum {
    asc,
    desc,
    neutral
}
