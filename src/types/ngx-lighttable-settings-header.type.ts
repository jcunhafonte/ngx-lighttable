import {NgStyle} from '@angular/common';
import {NgXLightTableSortableDirectionEnum} from '../components/ngx-lighttable.component';

export type NgXLightTableHeader = {
    title: string
    field: string
    sortable: {
        enabled: boolean,
        direction?: NgXLightTableSortableDirectionEnum
    },
    width?: number,
    headerClass?: string,
    headerStyle?: NgStyle
};
