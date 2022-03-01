const backgroundStory = [
  {
    id: 1,
    contentFile:
      'https://scontent.fsgn13-2.fna.fbcdn.net/v/t39.16376-6/58262940_285817512345690_8722691640277336064_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=4mUay9b2l7AAX_wWXQP&_nc_ht=scontent.fsgn13-2.fna&oh=00_AT_ClN_6RxAn47_58KyFqpRJCzPtFZ0eFRzR6OpBeB376A&oe=621E5BCB',
    textColor: 'white'
  },
  {
    id: 2,
    contentFile:
      'https://scontent.fsgn13-2.fna.fbcdn.net/v/t39.16376-6/51444449_241165266799621_5201263940155211776_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=xRKNM3D0_SUAX9PgoJr&_nc_ht=scontent.fsgn13-2.fna&oh=00_AT_mU0nSQpPf3GFHzlIQIkSfhzV4_BzMScSx3izEF789QA&oe=621E3B19',
    textColor: 'black'
  },
  {
    id: 3,
    contentFile:
      'https://scontent.fsgn13-2.fna.fbcdn.net/v/t39.16376-6/51773321_459530704584489_7020247985183260672_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=PFuk7-5o3rcAX-V4Ts9&tn=ca8LXF0NWlMZLzjN&_nc_ht=scontent.fsgn13-2.fna&oh=00_AT9RQ4F3236CqtsUQGlRUFXEtih4Fo5V0mpluIiQCVarWg&oe=621ECA47',
    textColor: 'white'
  },
  {
    id: 4,
    contentFile:
      'https://scontent.fsgn13-2.fna.fbcdn.net/v/t39.16376-6/51659228_2173297926332597_6675787257242189824_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=pMxZ8_22gyQAX_BLOoy&_nc_ht=scontent.fsgn13-2.fna&oh=00_AT89F8LDcX9g9E4KDhSBmLxiybdj6JWaWNaa0A1QxfuTBg&oe=621DD08F',
    textColor: 'black'
  },
  {
    id: 5,
    contentFile:
      'https://scontent.fsgn13-2.fna.fbcdn.net/v/t39.16376-6/51747058_367314920518077_4129068334446542848_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=2aJwpVlc4AMAX-xE65J&tn=ca8LXF0NWlMZLzjN&_nc_ht=scontent.fsgn13-2.fna&oh=00_AT_1kwurziabjyBPeNPcBdHfMRPLqn95CZJyBjknKnX-lA&oe=621E4B77',
    textColor: 'white'
  },
  {
    id: 6,
    contentFile:
      'https://scontent.fsgn13-2.fna.fbcdn.net/v/t39.16376-6/51716938_316152722351371_3882775088419831808_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=X9-9VGFErE0AX9C8tv2&_nc_ht=scontent.fsgn13-2.fna&oh=00_AT9V2WUS6CfVDVKc-oath3ehCwWqXyP4poQsbR7pm6yDng&oe=621EDD21',
    textColor: 'white'
  },
  {
    id: 7,
    contentFile:
      'https://scontent.fsgn13-2.fna.fbcdn.net/v/t39.16376-6/55349832_403803457088017_170167072418955264_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=tchacAqgyp4AX8oGmKD&tn=ca8LXF0NWlMZLzjN&_nc_ht=scontent.fsgn13-2.fna&oh=00_AT8JUtiKPLKrdeYgs3ZWbLpZev4LXwjaT-8XEHNFefJnkQ&oe=621ED0AE',
    textColor: 'white'
  },
  {
    id: 8,
    contentFile:
      'https://scontent.fsgn13-2.fna.fbcdn.net/v/t39.16376-6/40416603_276166656331121_1207155431042973696_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=H1u7jZThbKAAX9nnj7b&_nc_ht=scontent.fsgn13-2.fna&oh=00_AT9q5P89kJabI9KXLPChVKMGR-d4w2AdJo15V7cwIEP7Tg&oe=621EFC0C',
    textColor: 'white'
  },
  {
    id: 9,
    contentFile:
      'https://scontent.fsgn13-2.fna.fbcdn.net/v/t39.16376-6/40415976_2163632400574709_6263437381412585472_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=KoI05rhP5B4AX-aiyS-&_nc_ht=scontent.fsgn13-2.fna&oh=00_AT8mmNhqVyoYVa3JT3LWM-p6KEVWKzvqu1lZIEGZVdheYQ&oe=621F7438',
    textColor: 'white'
  },
  {
    id: 10,
    contentFile:
      'https://scontent.fsgn13-2.fna.fbcdn.net/v/t39.16376-6/40511501_525804521192472_6757500320013615104_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=BJQQn6jAxhUAX_b4R9p&_nc_ht=scontent.fsgn13-2.fna&oh=00_AT_uowADOzr1pNPgnTCRffWNwfZUO8F2ivzpnvPx_p_gzQ&oe=621D8EC8',
    textColor: 'white'
  },
  {
    id: 11,
    contentFile:
      'https://scontent.fsgn13-2.fna.fbcdn.net/v/t39.16376-6/51670567_1009318279261961_1478806477517881344_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=xNTdlX3N14cAX8ER0Sj&_nc_ht=scontent.fsgn13-2.fna&oh=00_AT_Hcd3O5LN7lug1Syks4jBK86bP5NYRmtGAkLLDBHtMXA&oe=621DF8AB',
    textColor: 'white'
  },
  {
    id: 12,
    contentFile:
      'https://scontent.fsgn13-2.fna.fbcdn.net/v/t39.16376-6/40315930_452537141905851_1362647841457045504_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=5n3AOaf0kIUAX94QHB8&tn=ca8LXF0NWlMZLzjN&_nc_ht=scontent.fsgn13-2.fna&oh=00_AT-Ep4LE-Q38Ope3cW2g-dXv1wA6L5ilecHZSuiZaS0Ifw&oe=621EEE28',
    textColor: 'white'
  },
  {
    id: 13,
    contentFile:
      'https://scontent.fsgn13-2.fna.fbcdn.net/v/t39.16376-6/51807389_1793841934061296_4256928570250625024_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=hYqSSKN7OfUAX9sFH60&_nc_ht=scontent.fsgn13-2.fna&oh=00_AT9pzcD42AZvEdwvtCsLBctGesUmAgtN07wzwoWjhj6wsA&oe=621DADC6',
    textColor: 'white'
  },
  {
    id: 14,
    contentFile:
      'https://scontent.fsgn13-2.fna.fbcdn.net/v/t39.16376-6/51692760_2349018382009504_1354244768007192576_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=DZaBWF6loygAX8wkuqz&_nc_ht=scontent.fsgn13-2.fna&oh=00_AT_gvbDFRkoz5xysS8sSFEpQj_1yOO-1W650m7NgR8LjWg&oe=621EF55E',
    textColor: 'white'
  },
  {
    id: 15,
    contentFile:
      'https://scontent.fsgn13-2.fna.fbcdn.net/v/t39.16376-6/51618036_236995930542329_4218790918519521280_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=z1qwavP1jX4AX9vJrFs&_nc_ht=scontent.fsgn13-2.fna&oh=00_AT90rRethHkDiijjnXkh6QrLlqohovLgsoA9QcxAqY83rQ&oe=621F714A',
    textColor: 'white'
  },
  {
    id: 16,
    contentFile:
      'https://scontent.fsgn13-2.fna.fbcdn.net/v/t39.16376-6/51656974_554617655055750_2554822740104183808_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=iPVai_mveZUAX8AtscT&_nc_ht=scontent.fsgn13-2.fna&oh=00_AT-ZztNvSkfdAWqeeoJWnqqmZbRrAbpif1IOsawj39oILA&oe=621F44AB',
    textColor: 'white'
  },
  {
    id: 17,
    contentFile:
      'https://scontent.fsgn13-2.fna.fbcdn.net/v/t39.16376-6/51494681_410811533003647_7652995117124419584_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=CdzeP67_fRMAX99Qudt&_nc_ht=scontent.fsgn13-2.fna&oh=00_AT9Pd7n3NgdrSJen0fDGsp9k3tFo7S5Xb6Nioy5DoEIE5g&oe=621E81AB',
    textColor: 'white'
  },
  {
    id: 18,
    contentFile:
      'https://scontent.fsgn13-2.fna.fbcdn.net/v/t39.16376-6/51683696_2013736358740334_1456924521087893504_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=ip0Lx72ieFgAX92mZsq&_nc_ht=scontent.fsgn13-2.fna&oh=00_AT-KQjEV6Rv9Yk3VU4_q0tMImu1gGfWMJ2v2cKAnEKHKuw&oe=621E3813',
    textColor: 'white'
  },
  {
    id: 19,
    contentFile:
      'https://scontent.fsgn13-2.fna.fbcdn.net/v/t39.16376-6/40386062_1858568210896784_7860796569891635200_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=GHyRlBlu-5gAX8LysF6&_nc_ht=scontent.fsgn13-2.fna&oh=00_AT8ZckjX34rNOYqZhCpKvy90Yy_9gZcb5a-V2nF7lPI7CQ&oe=621E564B',
    textColor: 'white'
  },
  {
    id: 20,
    contentFile:
      'https://scontent.fsgn13-2.fna.fbcdn.net/v/t39.16376-6/40391974_474025459674109_1960411309426081792_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=Fw6mrFwy9X0AX8bOIME&_nc_ht=scontent.fsgn13-2.fna&oh=00_AT-0aqY1lXxb9RQVSYex0F9AJANKb0RJuWvbRlY2vBfxTg&oe=621F5920',
    textColor: 'white'
  },
  {
    id: 21,
    contentFile:
      'https://scontent.fsgn13-2.fna.fbcdn.net/v/t39.16376-6/40394107_464787127359918_796534073391579136_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=h03lMYTw4YYAX_UOOJd&_nc_oc=AQmlonSk9mPTronF9ibqfL7S443QUv_RrvKB9Jjb3AlTTWLOZek2QEDBsnoNgZ1dCu8&_nc_ht=scontent.fsgn13-2.fna&oh=00_AT-tgFCAjUU8CYuirP-jV2J9l0_X39Dhxv1MAPuU4Dir_g&oe=621EF4A8',
    textColor: 'white'
  },
  {
    id: 22,
    contentFile:
      'https://scontent.fsgn13-2.fna.fbcdn.net/v/t39.16376-6/40320440_236820466927357_4781919456681000960_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=3tKwKzerOFEAX8UoAoB&tn=ca8LXF0NWlMZLzjN&_nc_ht=scontent.fsgn13-2.fna&oh=00_AT9B5fZFuNetgllr7tO_IlTsx9ZNm99m0ez4HXcs7HSRGg&oe=621EA742',
    textColor: 'white'
  },
  {
    id: 23,
    contentFile:
      'https://scontent.fsgn13-2.fna.fbcdn.net/v/t39.16376-6/40354384_314741455742167_3647566156551684096_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=vzaV6wwzGeEAX9wyffv&_nc_ht=scontent.fsgn13-2.fna&oh=00_AT8jZosNhwbLaSNzaZ0V3d5KcTpnQITLLtG19UDHug3Ovw&oe=621DAA10',
    textColor: 'white'
  },
  {
    id: 24,
    contentFile:
      'https://scontent.fsgn13-2.fna.fbcdn.net/v/t39.16376-6/40291797_456543168188475_6816960843691851776_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=3Hff_XSNDBMAX9qP3pR&_nc_ht=scontent.fsgn13-2.fna&oh=00_AT-bPd_Z3GDd0c-tPG2Vj7C1QDZ8sikM4-qZFFXR-vai3Q&oe=621DF900',
    textColor: 'white'
  },
  {
    id: 25,
    contentFile:
      'https://scontent.fsgn13-2.fna.fbcdn.net/v/t39.16376-6/51663254_338912090167251_7973662516519632896_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=TxsCnJ1_-w8AX-hGeD7&_nc_ht=scontent.fsgn13-2.fna&oh=00_AT-6YS3UnE_qadMM48zZgL61-N_vyaqNHrCy1mjPdllJ7A&oe=621E1DE2',
    textColor: 'white'
  },
  {
    id: 26,
    contentFile:
      'https://scontent.fsgn13-2.fna.fbcdn.net/v/t39.16376-6/51640860_768161026877935_554302917239111680_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=9gRr__0l_cYAX__jEXT&_nc_ht=scontent.fsgn13-2.fna&oh=00_AT--pNt_2jUckh4iIwyC7kDBe7Szuzfm93HidcKlvZHT8Q&oe=621DD635',
    textColor: 'white'
  },
  {
    id: 27,
    contentFile:
      'https://scontent.fsgn13-2.fna.fbcdn.net/v/t39.16376-6/51583248_856609968012427_2158652542949523456_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=jb-zymJMSxUAX99W9bm&_nc_ht=scontent.fsgn13-2.fna&oh=00_AT9E_5K1kJtPCyY41fUeji8nijBTx8S6cI5gpGmuUcMAWg&oe=621E6474',
    textColor: 'white'
  },
  {
    id: 28,
    contentFile:
      'https://scontent.fsgn13-2.fna.fbcdn.net/v/t39.16376-6/51483155_1187607278075341_6337956575826673664_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=A9LCy5FvaLwAX-v3IuM&_nc_ht=scontent.fsgn13-2.fna&oh=00_AT_s2bNrlKyz78Ogvdc10leNRuXM2XYO1TK1ldy-UebuSA&oe=621F3816',
    textColor: 'white'
  },
  {
    id: 29,
    contentFile:
      'https://scontent.fsgn13-2.fna.fbcdn.net/v/t39.16376-6/51752084_299352544100598_4339278271729369088_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=0Cng8sBJQpYAX912hxb&_nc_ht=scontent.fsgn13-2.fna&oh=00_AT9Wb0jGW2zsXTjPv22ridQb4L8qkvjBCr3lH6ieBJbLBg&oe=621F5C30',
    textColor: 'white'
  },
  {
    id: 30,
    contentFile:
      'https://scontent.fsgn13-2.fna.fbcdn.net/v/t39.16376-6/51747585_280807132616756_296094164917944320_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=odUa2Y0Ok5AAX8qdboZ&_nc_ht=scontent.fsgn13-2.fna&oh=00_AT_3Sh4poWkNAM8wjzUtQYzKATBLllNmncsj7o7y6zx40g&oe=621E85E7',
    textColor: 'white'
  }
];

export default backgroundStory;
