import {NgStyle} from '@angular/common';
import {NgXTableSortableDirectionEnum} from '../components/ngx-table.component';

export type NgXTableHeader = {
    title: string
    field: string
    sortable: {
        enabled: boolean,
        direction?: NgXTableSortableDirectionEnum
    },
    width?: number,
    headerClass?: string,
    headerStyle?: NgStyle
};
