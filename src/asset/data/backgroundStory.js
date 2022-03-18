const backgroundStory = [
  {
    id: 1,
    contentFile:
      'https://scontent.fsgn13-1.fna.fbcdn.net/v/t39.16376-6/58262940_285817512345690_8722691640277336064_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=AWUjOHVcFDYAX8GKy-B&tn=tjbgIDKHVy1tLPy5&_nc_ht=scontent.fsgn13-1.fna&oh=00_AT-TtVwf5I0_iTx8aDIKKmeD3YVa7DgNV3MeR_NfGnkq0A&oe=6238110B',
    textColor: 'white'
  },
  {
    id: 2,
    contentFile:
      'https://scontent.fsgn13-1.fna.fbcdn.net/v/t39.16376-6/51444449_241165266799621_5201263940155211776_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=iejo-zRDcJkAX-VnS3k&_nc_ht=scontent.fsgn13-1.fna&oh=00_AT8Qh-zNMrdcbHavm6Iz4vWibvIWZO225Ybe8S_J6STZBw&oe=6237F059',
    textColor: 'black'
  },
  {
    id: 3,
    contentFile:
      'https://scontent.fsgn13-1.fna.fbcdn.net/v/t39.16376-6/51773321_459530704584489_7020247985183260672_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=WfvdnW6R9j8AX9TvjPe&tn=tjbgIDKHVy1tLPy5&_nc_ht=scontent.fsgn13-1.fna&oh=00_AT_smp9xaHZugyIju-DWoKJFF8HDyVKJKtrHPkZoEeFXvQ&oe=62387F87',
    textColor: 'white'
  },
  {
    id: 4,
    contentFile:
      'https://scontent.fsgn13-1.fna.fbcdn.net/v/t39.16376-6/51659228_2173297926332597_6675787257242189824_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=7vIILWyWmKcAX8oOj_B&tn=tjbgIDKHVy1tLPy5&_nc_ht=scontent.fsgn13-1.fna&oh=00_AT_qNlRsY_sssKTDnv6T7MiS6i54cmi9lFg8x1qF6bUJfQ&oe=6239800F',
    textColor: 'black'
  },
  {
    id: 5,
    contentFile:
      'https://scontent.fsgn13-1.fna.fbcdn.net/v/t39.16376-6/51747058_367314920518077_4129068334446542848_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=CqeswbIWGFIAX-o_ZBB&tn=tjbgIDKHVy1tLPy5&_nc_ht=scontent.fsgn13-1.fna&oh=00_AT-6IHXJxMHywfbOy4DZaYCLkKkWaP15EqIgzuYGuDE-dA&oe=623800B7',
    textColor: 'white'
  },
  {
    id: 6,
    contentFile:
      'https://scontent.fsgn13-1.fna.fbcdn.net/v/t39.16376-6/51716938_316152722351371_3882775088419831808_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=3qlngj5_hkUAX_Ffi2P&_nc_ht=scontent.fsgn13-1.fna&oh=00_AT9f12IrS_BwhJ70QXonjdgmgVz36r9dFDkRsEhHY00eeg&oe=62389261',
    textColor: 'white'
  },
  {
    id: 7,
    contentFile:
      'https://scontent.fsgn13-1.fna.fbcdn.net/v/t39.16376-6/55349832_403803457088017_170167072418955264_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=kVcUv-qNSQsAX9Xu2tL&tn=tjbgIDKHVy1tLPy5&_nc_ht=scontent.fsgn13-1.fna&oh=00_AT9H9PttAKzdlaXifragINOQKeL1klnCOJKh8PEKlVnxlQ&oe=623885EE',
    textColor: 'white'
  },
  {
    id: 8,
    contentFile:
      'https://scontent.fsgn13-1.fna.fbcdn.net/v/t39.16376-6/40416603_276166656331121_1207155431042973696_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=kTOpnyKwdPYAX8gp4bw&tn=tjbgIDKHVy1tLPy5&_nc_ht=scontent.fsgn13-1.fna&oh=00_AT_FtBHcm5xfB17pCUSkMlqZJBxctXgD9bhhXhkw1wFreg&oe=6238B14C',
    textColor: 'white'
  },
  {
    id: 9,
    contentFile:
      'https://scontent.fsgn13-1.fna.fbcdn.net/v/t39.16376-6/40415976_2163632400574709_6263437381412585472_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=NjDwDuTmT8IAX86p4Aw&tn=tjbgIDKHVy1tLPy5&_nc_ht=scontent.fsgn13-1.fna&oh=00_AT-13kRDo5E5jhV5ofgMhTUaHqcCQgoVERroPXwcVzmgqA&oe=62392978',
    textColor: 'white'
  },
  {
    id: 10,
    contentFile:
      'https://scontent.fsgn13-1.fna.fbcdn.net/v/t39.16376-6/40511501_525804521192472_6757500320013615104_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=j-z4YVsFZbgAX9C4QN7&_nc_ht=scontent.fsgn13-1.fna&oh=00_AT9X3zpuWvW-k-AUHTGwdxhgVZSta5OxfAW5iYu2vaFOmw&oe=62393E48',
    textColor: 'white'
  },
  {
    id: 11,
    contentFile:
      'https://scontent.fsgn13-1.fna.fbcdn.net/v/t39.16376-6/51670567_1009318279261961_1478806477517881344_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=lMg_Ms67PtMAX8s_fkJ&_nc_ht=scontent.fsgn13-1.fna&oh=00_AT82pETZx2NS2TpM4jb5kooSe1t9I-PN-1_sg0oTrfp03g&oe=6239A82B',
    textColor: 'white'
  },
  {
    id: 12,
    contentFile:
      'https://scontent.fsgn13-1.fna.fbcdn.net/v/t39.16376-6/40315930_452537141905851_1362647841457045504_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=a-mybPJMebEAX_dTGAT&_nc_ht=scontent.fsgn13-1.fna&oh=00_AT-T-O9WEd3v3puxeTUvIoTrT1PvzNGxEw8vthyYmFWSww&oe=6238A368',
    textColor: 'white'
  },
  {
    id: 13,
    contentFile:
      'https://scontent.fsgn13-1.fna.fbcdn.net/v/t39.16376-6/51807389_1793841934061296_4256928570250625024_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=BzHq22YUG4UAX8bvBOP&_nc_ht=scontent.fsgn13-1.fna&oh=00_AT9oIK9_hZMFLLfTXAbazuNeIS-PQIC9ltPeIAQuQvqPtA&oe=62395D46',
    textColor: 'white'
  },
  {
    id: 14,
    contentFile:
      'https://scontent.fsgn13-1.fna.fbcdn.net/v/t39.16376-6/51692760_2349018382009504_1354244768007192576_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=BsWh0HTYjKsAX_9NQ8n&_nc_ht=scontent.fsgn13-1.fna&oh=00_AT_ijCr9gQoMX4WN8vE_duG6uLGh8-5QnmwCCevjxwt1Tw&oe=6238AA9E',
    textColor: 'white'
  },
  {
    id: 15,
    contentFile:
      'https://scontent.fsgn13-1.fna.fbcdn.net/v/t39.16376-6/51618036_236995930542329_4218790918519521280_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=XRW3z4big5gAX8BI1ed&_nc_ht=scontent.fsgn13-1.fna&oh=00_AT_P2kIoreeq2MF4FaUk2h7j4bxUIfkprie4EAqr60v6yQ&oe=6239268A',
    textColor: 'white'
  },
  {
    id: 16,
    contentFile:
      'https://scontent.fsgn13-1.fna.fbcdn.net/v/t39.16376-6/51656974_554617655055750_2554822740104183808_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=Fj6ypkQDxE4AX8_HeM3&_nc_ht=scontent.fsgn13-1.fna&oh=00_AT-sdJiHSlv8vWunZAL0ecsCFX4YPPuox8zw4YcGYizReg&oe=6238F9EB',
    textColor: 'white'
  },
  {
    id: 17,
    contentFile:
      'https://scontent.fsgn13-1.fna.fbcdn.net/v/t39.16376-6/51494681_410811533003647_7652995117124419584_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=temLc3b-zUUAX_hMZyi&_nc_ht=scontent.fsgn13-1.fna&oh=00_AT-yjV8nQNm4yCjqotyV8zp6Tkhj0nx8Mth3SjSACa4kwA&oe=623836EB',
    textColor: 'white'
  },
  {
    id: 18,
    contentFile:
      'https://scontent.fsgn13-1.fna.fbcdn.net/v/t39.16376-6/51683696_2013736358740334_1456924521087893504_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=sY6b_KuoBEsAX_U_NeG&tn=tjbgIDKHVy1tLPy5&_nc_ht=scontent.fsgn13-1.fna&oh=00_AT-6kY1OhP0maUD_tKkxCVU3svpCge5Y770wbFmigA25dA&oe=6237ED53',
    textColor: 'white'
  },
  {
    id: 19,
    contentFile:
      'https://scontent.fsgn13-1.fna.fbcdn.net/v/t39.16376-6/40386062_1858568210896784_7860796569891635200_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=e_g5b3U-DOgAX_I2E-o&_nc_ht=scontent.fsgn13-1.fna&oh=00_AT9sjL3eRDSVQOFnzLZF9vYxerVS6jBHX_acPlZ9_IyCgA&oe=62380B8B',
    textColor: 'white'
  },
  {
    id: 20,
    contentFile:
      'https://scontent.fsgn13-1.fna.fbcdn.net/v/t39.16376-6/40391974_474025459674109_1960411309426081792_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=TY5YvMnUo-0AX_4jseR&_nc_ht=scontent.fsgn13-1.fna&oh=00_AT_RK2CkeVnKI22i4nJBFu9Fa5MfbunZovQyfTKnsLhauw&oe=62390E60',
    textColor: 'white'
  },
  {
    id: 21,
    contentFile:
      'https://scontent.fsgn13-1.fna.fbcdn.net/v/t39.16376-6/40394107_464787127359918_796534073391579136_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=dWUszd7Uw00AX8IeR1Y&_nc_oc=AQnAzpmZlKQyMxmQ2ExRS7S4HqIgF0tEgKyAwgkvd-X4q6KRitFD9662UJls9Ksu3jY&tn=tjbgIDKHVy1tLPy5&_nc_ht=scontent.fsgn13-1.fna&oh=00_AT-BssbIYWlMwdFjr13txxi4x6T6dvGubSXQ3z-NjEM9Vg&oe=6238A9E8',
    textColor: 'white'
  },
  {
    id: 22,
    contentFile:
      'https://scontent.fsgn13-1.fna.fbcdn.net/v/t39.16376-6/40320440_236820466927357_4781919456681000960_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=PgWvywE4ZV0AX9G32nG&_nc_ht=scontent.fsgn13-1.fna&oh=00_AT-Ui-VTE12vM93kcLg7THLoSC4F4JjfXcNwz3zD5T2-Ng&oe=62385C82',
    textColor: 'white'
  },
  {
    id: 23,
    contentFile:
      'https://scontent.fsgn13-1.fna.fbcdn.net/v/t39.16376-6/40354384_314741455742167_3647566156551684096_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=8mQPPTX6AGsAX-4cidb&tn=tjbgIDKHVy1tLPy5&_nc_ht=scontent.fsgn13-1.fna&oh=00_AT8VBXb-d3R71SChgjCupkWCYmZB8CpUIhC-0cRGD2Nd5A&oe=62395990',
    textColor: 'white'
  },
  {
    id: 24,
    contentFile:
      'https://scontent.fsgn13-1.fna.fbcdn.net/v/t39.16376-6/40291797_456543168188475_6816960843691851776_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=7ZSSxhahAxQAX-r-Kqf&_nc_ht=scontent.fsgn13-1.fna&oh=00_AT-CeW6j08DnP8uv8RzHoBoMarz1WRXjYjO4kFLDaYixZw&oe=6239A880',
    textColor: 'white'
  },
  {
    id: 25,
    contentFile:
      'https://scontent.fsgn13-1.fna.fbcdn.net/v/t39.16376-6/51663254_338912090167251_7973662516519632896_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=M5sTahkfQ3cAX9nVCCj&tn=tjbgIDKHVy1tLPy5&_nc_ht=scontent.fsgn13-1.fna&oh=00_AT-377pCGnUbR1P0MWnrRCeV6wGm4440APfPkggoB3KYhw&oe=6239CD62',
    textColor: 'white'
  },
  {
    id: 26,
    contentFile:
      'https://scontent.fsgn13-1.fna.fbcdn.net/v/t39.16376-6/51640860_768161026877935_554302917239111680_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=Ag6XxaU_vCQAX-K-j9V&tn=tjbgIDKHVy1tLPy5&_nc_ht=scontent.fsgn13-1.fna&oh=00_AT_t4JPoS_7FwT-LTEeiB9fnPaRNaYRouhHyXc9_Di9PHw&oe=623985B5',
    textColor: 'white'
  },
  {
    id: 27,
    contentFile:
      'https://scontent.fsgn13-1.fna.fbcdn.net/v/t39.16376-6/51583248_856609968012427_2158652542949523456_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=dxl8hWV56cEAX8vdNoi&_nc_ht=scontent.fsgn13-1.fna&oh=00_AT_74JkCqjC9LoesWsUu_DCOOXy2AEClh3SkvZ7Q0zy9hQ&oe=623819B4',
    textColor: 'white'
  },
  {
    id: 28,
    contentFile:
      'https://scontent.fsgn13-1.fna.fbcdn.net/v/t39.16376-6/51483155_1187607278075341_6337956575826673664_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=pxh3TR24xZ4AX84F-_n&_nc_ht=scontent.fsgn13-1.fna&oh=00_AT-CMvU1aUjUSuMB8S99RxIT39GY_lr-OxHXHqTI6dnquQ&oe=6238ED56',
    textColor: 'white'
  },
  {
    id: 29,
    contentFile:
      'https://scontent.fsgn13-1.fna.fbcdn.net/v/t39.16376-6/51752084_299352544100598_4339278271729369088_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=ctTte2KFBQYAX9wlGne&_nc_ht=scontent.fsgn13-1.fna&oh=00_AT_MsCHcgCsRrDXlz6UfkRBT_l58zMqasWowtbqYPNTdTA&oe=62391170',
    textColor: 'white'
  },
  {
    id: 30,
    contentFile:
      'https://scontent.fsgn13-1.fna.fbcdn.net/v/t39.16376-6/51747585_280807132616756_296094164917944320_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=a86453&_nc_ohc=vPrF53hXoMAAX-i57WN&_nc_ht=scontent.fsgn13-1.fna&oh=00_AT92jqcSYeF8hly9ajGlfKTOqB_h-YgFRSgKHvHDbF2KWA&oe=62383B27',
    textColor: 'white'
  }
];

export default backgroundStory;
