import { Component, OnInit, Input } from '@angular/core';
import { Location } from '../../../models';

@Component({
  selector: 'app-location-detail',
  templateUrl: './location-detail.component.html',
  styleUrls: ['./location-detail.component.scss']
})
export class LocationDetailComponent implements OnInit {

  @Input() location: Location;

  constructor() { }

  ngOnInit() {
  }

}
