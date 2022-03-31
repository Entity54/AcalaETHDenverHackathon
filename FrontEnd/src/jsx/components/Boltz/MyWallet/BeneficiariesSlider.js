// import React from "react";
import React,{useState, useEffect} from 'react';

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/swiper.min.css";
import "swiper/components/scrollbar/scrollbar.min.css"

import Card1 from './../../../../images/card/card44.jpg';
import Card2 from './../../../../images/card/card33.jpg';
import Card3 from './../../../../images/card/card11.jpg';
import Card4 from './../../../../images/card/card22.jpg';

import { getMsg } from '../../../../ntt54_accounts.js';         


// import Swiper core and required modules
import SwiperCore, {  Scrollbar,Mousewheel} from 'swiper/core';

// install Swiper modules
SwiperCore.use([Scrollbar,Mousewheel]);

// let swiperBlog2 = [
// 	{image: Card2, icon: <IconBlog2 />, status: "Unregistered", address: "0xd60135d1d501fb45B7dD2B3761E4225cF80f96A6", nonce: getMsg()},
// 	{image: Card3, icon: <IconBlog2 />,},
// 	{image: Card3, icon: <IconBlog2 />,},
// 	{image: Card3, icon: <IconBlog2 />,},
// 	{image: Card3, icon: <IconBlog1 />,},
// 	{image: Card3, icon: <IconBlog2 />,},
// 	{image: Card3, icon: <IconBlog2 />,},
// 	{image: Card3, icon: <IconBlog2 />,},
// ];



// export default function SwiperSlider2() {
const SwiperSlider2= ({ getClickedCard, detailedBeneficiariesArray, willBeneficiaries, currentAccount, provider, wallet, ntt54Will, allAdminAccounts }) => {
 
  const [swiperBlog, setSwiperBlog] = useState([{image: Card1, icon: "",  address: "Loading...", nickname: "Loading...", fmsg: "Loading...", percent: "Loading...", nft: "Loading..."}]);
  
  const clickedCard = (ind) => {
	  console.log(`BenefeciariesSlider The card with index:${ind} has been clicked`);
	  getClickedCard(ind);
  }

  useEffect(() => {
		console.log(`BeneficiariesSlider Loaded detailedBeneficiariesArray: ${detailedBeneficiariesArray}`);
		console.dir(detailedBeneficiariesArray);
	    //[ {b_address, b_nickname, b_fmsg, b_percent, b_nft, b_index,} ]

    	if (detailedBeneficiariesArray)
		{
			const numBen = detailedBeneficiariesArray.length;
			if (numBen===0) return;

			let newSwiperBlog = []
			for (let i=0; i<numBen; i++)
			{
				const imod = i%4;
				let card;
				switch (imod) {
					case 0:
						card = Card1;
						break;
					case 1:
						card = Card2;
						break;
					case 2:
						card = Card3;
						break;
					case 3:
						card = Card4;
						break;
					default:
						card = Card1;
				}
				
				newSwiperBlog.push({image: card, icon: "",  address: detailedBeneficiariesArray[i].b_address, nickname: detailedBeneficiariesArray[i].b_nickname, fmsg: detailedBeneficiariesArray[i].b_fmsg, percent: detailedBeneficiariesArray[i].b_percent, nft: detailedBeneficiariesArray[i].b_nft});
			}
			setSwiperBlog(newSwiperBlog);
		}

  },[detailedBeneficiariesArray])



  return (
    <>
    <Swiper direction={'vertical'} slidesPerView={'auto'} freeMode={true} scrollbar={true} mousewheel={true} 
		
		breakpoints={{
			360: {
				direction: 'horizontal',
				slidesPerView: 'auto',
				
			},
			650: {
				direction: 'horizontal',
				slidesPerView: 2,
				scrollbar: {
					"el": '.swiper-scrollbar',
					
				},
			},
			1200: {
				direction: 'vertical',
				slidesPerView: 'auto',
				scrollbar: {
					el: '.swiper-scrollbar',
				},
			},			
		}}
		className="mySwiper card-swiper"
	>
				{swiperBlog.map((data,index)=>(	
					<SwiperSlide  key={index} onClick = { () => clickedCard(index) }>
						<div className="card-bx stacked card">
							<img src={data.image} alt="" />
							<div className="card-info">
								<p className="mb-1 text-white fs-14" >Nickname </p>
								<div className="d-flex justify-content-between">
									<h2 className="num-text text-white mb-3 font-w600">{data.nickname}</h2>
								</div>
								<div className="d-flex justify-content-between">
								    <div className="me-4 text-white">
										<p className="fs-12 mb-1 op6">Final Message</p>
										<span>{data.fmsg}</span>
									</div>
								</div>
								<div className="d-flex">
									<div className="me-4 text-white">
										<p className="fs-12 mb-1 op6">Percent of AUSD</p>
										<span>{data.percent}</span>
									</div>
								</div>
								<div>

									<div className="me-4 text-white"  >
										<p className="fs-12 mb-1 op6">NFT</p>
										<span style={{fontSize:"16px"}}>{data.nft}</span>
									</div>
								</div>
								<div>
									<div className="text-white">
										<p className="fs-12 mb-1 op6">Beneficiary Account</p>
										<span style={{fontSize:"16px" }}>{data.address}</span>
									</div>
								</div>
							</div>
						</div>
					</SwiperSlide>
				))}
		</Swiper>
    </>
  )
}
export default SwiperSlider2; 
