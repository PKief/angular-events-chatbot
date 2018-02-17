import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-location-rating',
  templateUrl: './location-rating.component.html',
  styleUrls: ['./location-rating.component.scss']
})
export class LocationRatingComponent implements OnInit {

  @Input() rating: number;

  constructor() { }

  ngOnInit() {
  }

  /**
   * Get the amount of stars for the rating bar of a location.
   * @param rating Rating as number
   */
  getRatingStars(rating: number) {
    const stars = [];
    const starsArray = rating ? rating.toString().split('.') : [0, 0];

    const amountFullStars = Number(starsArray[0]);
    let amountHalfStars = 0;
    let amountEmptyStars = 0;

    if (Number(starsArray[1]) >= 3 && Number(starsArray[1]) < 7) {
      amountHalfStars++;
    }

    amountEmptyStars = 5 - amountFullStars - amountHalfStars;

    stars.push(...Array(amountFullStars).fill(1));
    stars.push(...Array(amountHalfStars).fill(0));
    stars.push(...Array(amountEmptyStars).fill(-1));
    return stars;
  }

}
