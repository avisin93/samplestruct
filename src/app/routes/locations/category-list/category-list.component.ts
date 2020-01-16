import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {
  breadcrumbData: any = {
    title: 'sidebar.categoryList',
    subTitle: 'location.labels.categorySubtitle',
    data: [{
      text: 'common.labels.home',
      link: '/'
    },
    {
      text: 'sidebar.categoryList',
      link: ''
    }
    ]
  }
  constructor() { }

  ngOnInit() {
  }

}
