import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { LottieComponent, AnimationOptions } from 'ngx-lottie'; 

@Component({
  selector: 'app-error404',
  templateUrl: './error404.page.html',
  styleUrls: ['./error404.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterLink, LottieComponent], 
})
export class Error404Page implements OnInit {

  
  options: AnimationOptions = {
    path: 'assets/animation/error404.json', 
    loop: true,
    autoplay: true
  };

  constructor() {}

  ngOnInit() {}
}
