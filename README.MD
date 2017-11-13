# ngx-lighttable

`ngx-lighttable` is an Angular component built with _TypeScript_, _CSS3_, _HTML5_ and _Angular >= 4_. It is an Angular component for presenting complex data in a light package with no external dependencies. The table just consume your data and doesn't make any assumptions about your datastructure or how you handle it (filtering, sorting or pagination).

## Features
- Handle large data sets (Virtual DOM)
- Expressive header with sorting
- Unordered cells
- Easy configuration and manipulation
- HTML templating for cells
- Light codebase / No external dependencies
- Easy selectors for testing purposes
- AoT compilation support

## TODO
- Responsive support
    * Showing/hiding unecessary content
- Sorting multiple columns
- Single events for cell

## Installation

All you need to do is to run the following command:

```bash
$ npm install ngx-lighttable --save
```

## Usage

Import ngx-lighttable directives into your component:

```typescript
import {NgModule} from '@angular/core';

...

import {NgXLightTable} from 'ngx-lighttable';
```

Register it by adding to the list of directives of your module:

```typescript
@NgModule({
  imports: [
    ...
    NgXLightTable
  ],
  ...
})
export class AppModule {
}
```

Configure the table and add it into the template by registering <i>settings</i> property.
    
```typescript
settings: NgXLightTableSettings = { // exported type
    headers: 
    [
        {
            title: '#',
            field: 'tag',
            sortable: {
                enabled: false,
                direction: NgXLightTableSortableDirectionEnum.neutral
            }
        },
        {
            title: 'Name',
            field: 'name',
            sortable: {
                enabled: true,
                direction: NgXLightTableSortableDirectionEnum.asc
            }
        },
        {
            title: 'Position',
            field: 'position',
            sortable: {
                enabled: true,
                direction: NgXLightTableSortableDirectionEnum.neutral
            }
        },
        {
            title: 'Since',
            field: 'since',
            sortable: {
                enabled: false,
                direction: NgXLightTableSortableDirectionEnum.neutral
            }
        },
        {
            title: 'Salary',
            field: 'salary',
            sortable: {
                enabled: false,
                direction: NgXLightTableSortableDirectionEnum.neutral
            }
        },
        {
            title: 'Actions',
            field: 'actions',
            sortable: {
                enabled: true,
                direction: NgXLightTableSortableDirectionEnum.neutral
            }
        }
    ],
    messages: {
      empty: 'No records found', // Optional
      loading: 'Loading records...' // Optional
    },
    allowMultipleSort: false, // Optional
    allowNeutralSort: true // Optional
};
```

Add ngx-lighttable component inside to the template:

```typescript
// ...

@Component({
    template: `<ngx-lighttable [settings]="settings"></ngx-lighttable>`
})
// ...
```

Now you need records in your table. Create an array property with a list of objects in the component.

```typescript
records: any[] = [
    {
      tag: 1,
      name: 'Paul',
      position: 'iOS Developer',
      since: 2011,
      salary: '405k',
      actions: 'Delete'
    },
    {
      tag: 2,
      name: 'John',
      position: 'DevOps',
      since: 2006,
      salary: '205k',
      actions: 'Delete'
    },
    {
      tag: 3,
      name: 'Mike',
      position: 'Android Developer',
      since: 2014,
      salary: '305k',
      actions: 'Delete'
    },
    {
      tag: 4,
      name: 'Andrew',
      position: 'Android Developer',
      since: 2011,
      salary: '105k',
      actions: 'Delete'
    },
    {
      tag: 5,
      name: 'Doe',
      position: 'Backend Developer',
      since: 2009,
      salary: '505k',
      actions: 'Delete'
    },
    {
      tag: 6,
      name: 'Alice',
      position: 'UX/UI Designer',
      since: 2012,
      salary: '370k',
      actions: 'Delete'
    },
    {
      tag: 7,
      name: 'Dickens',
      position: 'Communication',
      since: 2008,
      salary: '205k',
      actions: 'Delete'
    },
    {
      tag: 8,
      name: 'Dani',
      position: 'Full-stack Developer',
      since: 2013,
      salary: '605k',
      actions: 'Delete'
    },
  ];
```

Add it to your table component as <i>records</i> and configure every cell.
Note that some of them are <b>templates</b>. You can have have how many templates as you wish.

```typescript
...
@Component({
    template: `
    <ngx-lighttable [settings]="settings" [records]="records">
        <ngx-lighttable-cell [field]="'tag'"></ngx-lighttable-cell>
        <ngx-lighttable-cell [field]="'name'"></ngx-lighttable-cell>  
        <ngx-lighttable-cell [field]="'position'"></ngx-lighttable-cell>        
        <ngx-lighttable-cell [field]="'since'"></ngx-lighttable-cell>       
        <ngx-lighttable-cell [field]="'salary'">
            <ng-template let-salary>
                <strong>{{salary}}</strong>
            </ng-template>
        </ngx-lighttable-cell>
        <ngx-lighttable-cell [field]="'actions'">
            <ng-template let-actions>
                <button>{{actions}}</button>
            </ng-template>
        </ngx-lighttable-cell>
    </ngx-lighttable> 
  `
})
...
```

Now you have some data in the table.

The events available with this component are:
- onSort
- onClickRow
- onClickCell

Add them as outputs to listen the events.

```typescript
@Component({
    template: `
    <ngx-lighttable 
        [settings]="settings" 
        [records]="records"
        (onSort)="onSortTable($event)"
        (onClickRow)="...($event)"
        (onClickCell)="...($event)">
            ...
    </ngx-lighttable>
    `
})
```

## License

MIT © [jcunhafonte](mailto:jose.fonte@pt.bosch.com)
