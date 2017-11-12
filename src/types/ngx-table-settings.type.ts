import {NgXTableHeader} from './ngx-table-settings-header.type';

export type NgXTableSettings = {
    headers: NgXTableHeader[],
    messages?: {
        empty?: string
        loading?: string
    },
    allowMultipleSort?: boolean,
    allowNeutralSort?: boolean
};