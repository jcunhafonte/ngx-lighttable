import {NgXLightTableHeader} from './ngx-lighttable-settings-header.type';

export type NgXLightTableSettings = {
    headers: NgXLightTableHeader[],
    messages?: {
        empty?: string
        loading?: string
    },
    allowMultipleSort?: boolean,
    allowNeutralSort?: boolean
};