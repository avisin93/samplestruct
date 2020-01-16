import { Component, OnInit, OnDestroy, Optional } from '@angular/core';
import { ROUTER_LINKS, ROUTER_LINKS_FULL_PATH } from '@app/config';
import { Router, ActivatedRoute } from '@angular/router';
import { Common } from '@app/common/common';
import { BIDDING_ROUTER_LINKS_FULL_PATH, BIDDING_ROUTER_LINKS } from '../Constants';
import { ManageBidData } from '../manage-bid/manage-bid.data';
declare var $: any;

@Component({
  selector: 'app-manage-master-configuration',
  templateUrl: './manage-master-configuration.component.html',
  styleUrls: ['./manage-master-configuration.component.scss']
})
export class ManageMasterConfigurationComponent implements OnInit, OnDestroy {
  BIDDING_ROUTER_LINKS = BIDDING_ROUTER_LINKS;
  // breadcrumbs data
  breadcrumbData: any = {};
  isBiddingListParentPath: Boolean = false;
  bidListBreadcrumbData: any = {
    title: 'biddings.labels.biddingList',
    subTitle: 'biddings.labels.biddingListSub',
    data: [{
      text: 'common.labels.home',
      link: '/'
    },
    {
      text: 'biddings.labels.biddingListTitle',
      link: ROUTER_LINKS_FULL_PATH['bids']
    },
    {
      text: 'biddings.labels.masterConfig',
      link: ''
    }
    ]
  };
  projectId: any;
  mangeBidBreadcrumbData: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    @Optional() public manageBidData: ManageBidData,
  ) { }

  ngOnInit() {
    this.route.parent.parent.params.subscribe(params => {
      this.projectId = params.id;
    });

    this.mangeBidBreadcrumbData = {
      title: 'biddings.labels.manageDealTitle',
      subTitle: 'biddings.labels.manageDealSubtitle',
      data: [{
        text: 'common.labels.home',
        link: '/'
      },
      {
        text: 'biddings.labels.biddingListTitle',
        link: ROUTER_LINKS.bidding
      },
      {
        text: 'biddings.labels.manageDealTitle',
        link: Common.sprintf(BIDDING_ROUTER_LINKS_FULL_PATH.manageBid, [this.projectId])

      },
      {
        text: 'biddings.labels.masterConfig',
        link: ''
      }
      ]
    };
    $('#manage-bid').hide();
    this.route.params.subscribe(params => {
      this.isBiddingListParentPath = this.route.snapshot.parent.data['isBiddingList'];
      this.breadcrumbData = this.isBiddingListParentPath ? this.bidListBreadcrumbData : this.mangeBidBreadcrumbData;
    });
  }
  ngOnDestroy() {
    $('#manage-bid').show();
  }
  // navigate tabs
  navigateTo() {
    if (this.isBiddingListParentPath) {
      this.router.navigate([ROUTER_LINKS_FULL_PATH.bids]);
    } else {
      this.manageBidData.navigateToEitherBasicInfoOrPassesTab();
    }
  }
}
