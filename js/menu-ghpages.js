document.addEventListener('DOMContentLoaded', async () => {
  const menuList = document.getElementById('menu-list');

  // === Загрузка меню из локального JSON ===
  async function loadMenu() {
    try {
      const res = await fetch('./data/menu.json?nocache=' + Date.now());
      if (!res.ok) throw new Error('Ошибка загрузки menu.json: ' + res.status);
      return await res.json();
    } catch (e) {
      console.error('Ошибка загрузки меню:', e);
      return {
        {
  "Авторские-коктейли": [
    {
      "name": "April spritz",
      "price": "1700",
      "photo": "https://sun9-16.userapi.com/s/v1/ig2/OFnk9DLM1X8NOgbD9HGg_I4A5EYG5Ol1QdeWTWbLJFzM_RWL57djEjOU7kblJ8aTqOMfraO7cymEyqBoco5OMKq0.jpg?quality=95&as=32x43,48x64,72x96,108x144,160x213,240x320,360x480,480x640,540x720,640x853,720x960,1080x1440,1280x1707,1440x1920,1920x2560&from=bu&cs=1920x0",
      "active": true
    },
    {
      "name": "Джайв",
      "price": "1700",
      "photo": "https://sun9-80.userapi.com/s/v1/ig2/C9E0XhgQ0uJwTpzFoLuSdJd8iNRMMK8sHPWi0mu2BQm9_7I0KFppfWTgcpFe-rS4J35XjrNjwFTrbFZYtP8lXfMH.jpg?quality=95&as=32x43,48x64,72x96,108x144,160x213,240x320,360x480,480x640,540x720,640x853,720x960,1080x1440,1280x1707,1440x1920,1920x2560&from=bu&cs=1280x0",
      "active": true
    },
    {
      "name": "Апельсиновый дурман",
      "price": "1700",
      "photo": "",
      "active": true
    },
    {
      "name": "Пина-Колада",
      "price": "1700",
      "photo": "",
      "active": true
    },
    {
      "name": "Datura",
      "price": "1700",
      "photo": "https://sun9-78.userapi.com/s/v1/ig2/5l1rVMKJfNAh56hSEGODISd533KOeSxRoXQe1tjRrAIxNYjnASFTs7oX893tS9uhLTV79V9WjPk-1WNHv4EWxl-p.jpg?quality=95&as=32x43,48x64,72x96,108x144,160x213,240x320,360x480,480x640,540x720,640x853,720x960,1080x1440,1280x1707,1440x1920,1920x2560&from=bu&cs=1280x0",
      "active": true
    }
  ],
  "Игристое вино": [
    {
      "name": "Martini Asti",
      "price": "9000",
      "photo": "",
      "active": true
    },
    {
      "name": "Mondoro Asti",
      "price": "11000",
      "photo": "https://sun9-22.userapi.com/s/v1/ig2/AVhCwVtmoPjUM_FJIMkW9qr0HQfru0ckiTWaJgeWLJGy6eitqJ11DchY-1YLoghdczbEd4GpVXGypbS_AAyD_d26.jpg?quality=95&as=32x43,48x64,72x96,108x144,160x213,240x320,360x480,480x640,540x720,640x853,720x960,1080x1440,1280x1707,1440x1920,1920x2560&from=bu&cs=1280x0",
      "active": true
    }
  ],
  "Вино": [
    {
      "name": "Вино Левинштейн",
      "price": "1400/7000",
      "photo": "https://sun9-58.userapi.com/s/v1/ig2/okR152H_wyy4t-tBW_GyHD8Yu2-Su8Khtp_ceyqM_fGPAHGjYdc75NQnvFrbwV_IneSLGsCgnkidPQVUSs0ykcsd.jpg?quality=95&as=32x43,48x64,72x96,108x144,160x213,240x320,360x480,480x640,540x720,640x853,720x960,1080x1440,1280x1707,1440x1920,1920x2560&from=bu&cs=1280x0",
      "active": true
    },
    {
      "name": "Вино Rondone Кьянти",
      "price": "1400/9000",
      "photo": "https://sun9-52.userapi.com/s/v1/ig2/di0s27UwVgpcKD4S6GBAtdKbPySLWsdl72hIAK8I8w4_3kqJUTgY_W2v3Dkdfjn0KkPBGaHLmP-tzr2KxB5x8GrG.jpg?quality=95&as=32x43,48x64,72x96,108x144,160x213,240x320,360x480,480x640,540x720,640x853,720x960,1080x1440,1280x1707,1440x1920,1920x2560&from=bu&cs=1280x0",
      "active": true
    }
  ],
  "Коктейли": [
    {
      "name": "Джин-Тоник",
      "price": "600",
      "photo": "https://sun9-17.userapi.com/s/v1/ig2/nNsknTr6CAg2xm9lmK2hBXyACovIt8fUj60Nl1_UaOp1HZidqRrM-T9or-KCR5KAgJyekbMFF3sENnlTs0mtMju7.jpg?quality=95&as=32x43,48x64,72x96,108x144,160x213,240x320,360x480,480x640,540x720,640x853,720x960,1080x1440,1280x1707,1440x1920,1920x2560&from=bu&cs=1280x0",
      "active": true
    },
    {
      "name": "Куба Либре",
      "price": "700",
      "photo": "https://sun9-36.userapi.com/s/v1/ig2/-UDg4fkXAG6KlD6W3seTdXs1EBasvB6ykViWPORpqrjrYKugg3JvnWW0VKMZm9vQRWdk_wXgWBLYvkZ7-wkfbg4D.jpg?quality=95&as=32x43,48x64,72x96,108x144,160x213,240x320,360x480,480x640,540x720,640x853,720x960,1080x1440,1280x1707,1440x1920,1920x2560&from=bu&cs=1280x0",
      "active": true
    },
    {
      "name": "Виски-Кола",
      "price": "700",
      "photo": "https://sun9-47.userapi.com/s/v1/ig2/Dj8WkiOvlMmKdh7HvRM_MuGoqrXcTUgDEqljEf4aXv-UkvXL1yKp15temQ4j0mNWOQCSEWGRd8Tgi755eF3m65mD.jpg?quality=95&as=32x43,48x64,72x96,108x144,160x213,240x320,360x480,480x640,540x720,640x853,720x960,1080x1440,1280x1707,1440x1920,1920x2560&from=bu&cs=1280x0",
      "active": true
    }
  ],
  "Виски": [
    {
      "name": "Акентошан",
      "price": "1000",
      "photo": "",
      "active": false
    },
	{
      "name": "Чивас Ригал 12 лет",
      "price": "900",
      "photo": "https://sun9-7.userapi.com/s/v1/ig2/p6kYjuc8HmQQEpc5_cRYUaFp5bMa26av_l1WX-LXZzTy_e_MCsvWI2MbNhvWz9Re8P5TV4nNHF1-HWa6SGai-ahI.jpg?quality=95&as=32x43,48x64,72x96,108x144,160x213,240x320,360x480,480x640,540x720,640x853,720x960,1080x1440,1280x1707,1440x1920,1920x2560&from=bu&cs=1280x0",
      "active": true
    },
    {
      "name": "Джемесон",
      "price": "700",
      "photo": "https://sun9-88.userapi.com/s/v1/ig2/z3mfKb-_K0z-WqAKJ1litxFaIQCg8TrW7_TheVxSiaSg3-4Y-h_ReuEvJwV7RFxDbWlIUCBKolfZgXUSoBFYrjs3.jpg?quality=95&as=32x43,48x64,72x96,108x144,160x213,240x320,360x480,480x640,540x720,640x853,720x960,1080x1440,1280x1707,1440x1920,1920x2560&from=bu&cs=1280x0",
      "active": true
    },
	{
      "name": "Джим Бим",
      "price": "650",
      "photo": "https://sun9-54.userapi.com/s/v1/ig2/GkIHUaG-fuP3pQlfVjGhJdxKrQ1GTI0xA8LlPDQmoJu81En9DRSIZHh680Qj-1u2nen7f3MBqCTUTLddzh0-5HCO.jpg?quality=95&as=32x43,48x64,72x96,108x144,160x213,240x320,360x480,480x640,540x720,640x853,720x960,1080x1440,1280x1707,1440x1920,1920x2560&from=bu&cs=1280x0",
      "active": true
    },
	{
      "name": "Макаллан",
      "price": "1500",
      "photo": "https://sun9-52.userapi.com/s/v1/ig2/riEIB7Osv9VSCaFHaKwaR0gi2BIA43eWpIDS729Q2nL0PxgSh8l0U1OulyxKnehklyHzDi8NlULjwJfTOU5rkOa5.jpg?quality=95&as=32x43,48x64,72x96,108x144,160x213,240x320,360x480,480x640,540x720,640x853,720x960,1080x1440,1280x1707,1440x1920,1920x2560&from=bu&cs=1280x0",
      "active": true
    },
    {
      "name": "Дюарс",
      "price": "600",
      "photo": "https://sun9-20.userapi.com/s/v1/ig2/W4zpodvW8lUzPLkllDAM_RNahx1OczxhS4cbnhzrwg2xeza_3N9bWD9uY07k_nrQQZ7gfhjWNFKLTusGfVkUdjvs.jpg?quality=95&as=32x43,48x64,72x96,108x144,160x213,240x320,360x480,480x640,540x720,640x853,720x960,1080x1440,1280x1707,1440x1920,1920x2560&from=bu&cs=1280x0",
      "active": true
    }
  ],
  "Джин": [
    {
      "name": "Баристер",
      "price": "450",
      "photo": "",
      "active": true
    },
	{
      "name": "Бомбей Сапфир",
      "price": "750",
      "photo": "https://sun9-6.userapi.com/s/v1/ig2/VsZCZOGbnFc5iLZMz8pWJheIdZElWEwOK6zbJfdcfTMRPcuOyzP7LS2RUYUkkkhIl1h2NUgoebBaUNc78750urWd.jpg?quality=95&as=32x43,48x64,72x96,108x144,160x213,240x320,360x480,480x640,540x720,640x853,720x960,1080x1440,1280x1707,1440x1920,1920x2560&from=bu&cs=1280x0",
      "active": true
    }
  ],
  "Водка": [
    {
      "name": "Белуга",
      "price": "600",
      "photo": "https://sun9-84.userapi.com/s/v1/ig2/-U7z39PQytPB-5UNG4ldYTYqiLN1e7Q9SXnRsSsilCJadjjqlkxmhYIRhcYnJ1cMGRUMi988qBeXFFJ8vy61lT--.jpg?quality=95&as=32x43,48x64,72x96,108x144,160x213,240x320,360x480,480x640,540x720,640x853,720x960,1080x1440,1280x1707,1440x1920,1920x2560&from=bu&cs=1280x0",
      "active": true
    },
    {
      "name": "Мамонт",
      "price": "500",
      "photo": "https://sun9-43.userapi.com/s/v1/ig2/NLjNrZHzGR3LuGdXiCTgN6ESCIiPVpwBiwRfKyOrrsv0O965ghBwuqApmX1nCUIgtZX-wdg0kBonLHyLFYKjUYCJ.jpg?quality=95&as=32x43,48x64,72x96,108x144,160x213,240x320,360x480,480x640,540x720,640x853,720x960,1080x1440,1280x1707,1440x1920,1920x2560&from=bu&cs=1280x0",
      "active": true
    },
    {
      "name": "Царская",
      "price": "400",
      "photo": "https://sun9-61.userapi.com/s/v1/ig2/qr7lhJVvqqbV6u-HKrBNLTN_DgMu4GnW8CpKHxNvhtLCfjbIzyiLh6_2Mvh4UMdT0iAmVqm0GlIHmOd9NnfIZHh4.jpg?quality=95&as=32x43,48x64,72x96,108x144,160x213,240x320,360x480,480x640,540x720,640x853,720x960,1080x1440,1280x1707,1440x1920,1920x2560&from=bu&cs=1280x0",
      "active": true
    }
  ],
  "Коньяк": [
    {
      "name": "Арарат",
      "price": "600",
      "photo": "https://sun9-80.userapi.com/s/v1/ig2/S5h-daCIZrI5RM9EtWIchAhcuYQL0uFuaqL543yOdg4Zt6kH5ytNATfT2AO0wZtIrDNGk3kmp2jFh0dJAwtVwrWH.jpg?quality=95&as=32x43,48x64,72x96,108x144,160x213,240x320,360x480,480x640,540x720,640x853,720x960,1080x1440,1280x1707,1440x1920,1920x2560&from=bu&cs=1280x0",
      "active": true
    },
    {
      "name": "Roullet",
      "price": "600",
      "photo": "https://sun9-22.userapi.com/s/v1/ig2/c_U4LvSqJrl6smZgw0bpaSGbdSkteRRo5a6cb9iA_mtYpRGf0pX0QeqA8-xjqTJa_QLq5wRw7n_csQJ1w4W8tnB1.jpg?quality=95&as=32x43,48x64,72x96,108x144,160x213,240x320,360x480,480x640,540x720,640x853,720x960,1080x1440,1280x1707,1440x1920,1920x2560&from=bu&cs=1280x0",
      "active": true
    }
  ],
  "Ликеры": [
    {
      "name": "Jägermeister",
      "price": "500",
      "photo": "https://sun9-29.userapi.com/s/v1/ig2/Z66bMGDgIsdVp3EWyYFiUvCt4eMBH0CzIthL0hy5bABnDgXSvfiGSaOg2TMNXHzgMu5ejxbDUr7LzyiWRXWrJgtH.jpg?quality=95&as=32x43,48x64,72x96,108x144,160x213,240x320,360x480,480x640,540x720,640x853,720x960,1080x1440,1280x1707,1440x1920,1920x2560&from=bu&cs=1280x0",
      "active": true
    }
  ],
  "Ром": [
    {
      "name": "Oakheart",
      "price": "600",
      "photo": "",
      "active": true
    }
  ],
  "Пиво": [
    {
      "name": "Корона экстра",
      "price": "600",
      "photo": "https://sun9-10.userapi.com/s/v1/ig2/U6rICXJooQMdAJEn8usyp5JFKIKdW3thGdBFjKv0r-P2vRACP2YrZSqrsWU4IzHusp_XFUh8AZS57dMzOXd0aoPj.jpg?quality=95&as=32x43,48x64,72x96,108x144,160x213,240x320,360x480,480x640,540x720,640x853,720x960,1080x1440,1280x1707,1440x1920,1920x2560&from=bu&cs=1280x0",
      "active": true
    }
	{
      "name": "Хофброй",
      "price": "800",
      "photo": "https://sun9-21.userapi.com/s/v1/ig2/D4LqGgMRuAc0-Brg5ywx0e6sWq9wEPmZihIpipwVuwo3hWXAZu3uLp17nofw8FQQLIs2zN9yjUCo9O06I2GXGywQ.jpg?quality=95&as=32x43,48x64,72x96,108x144,160x213,240x320,360x480,480x640,540x720,640x853,720x960,1080x1440,1280x1707,1440x1920,1920x2560&from=bu&cs=1280x0",
      "active": true
    }
  ],
  "Горячие напитки": [
    {
      "name": "Американо",
      "price": "200",
      "photo": "",
      "active": true
    },
    {
      "name": "Капучино",
      "price": "300",
      "photo": "",
      "active": true
    },
    {
      "name": "Чай в ассортименте",
      "price": "350",
      "photo": "",
      "active": true
    },
    {
      "name": "Эспрессо",
      "price": "400",
      "photo": "",
      "active": true
    }
  ],
  "Безалкогольные напитки": [
    {
      "name": "Кока-Кола (250 мл.)",
      "price": "500",
      "photo": "",
      "active": true
    },
    {
      "name": "Рэдбул (250 мл.)",
      "price": "500",
      "photo": "",
      "active": true
    },
    {
      "name": "Тоник (250 мл.)",
      "price": "500",
      "photo": "",
      "active": true
    },
    {
      "name": "Боржоми (500 мл.)",
      "price": "300",
      "photo": "",
      "active": true
    },
    {
      "name": "Вода негазированная (500 мл.)",
      "price": "300",
      "photo": "",
      "active": true
    },
    {
      "name": "Сок (200 мл.)",
      "price": "250",
      "photo": "",
      "active": true
    }
  ],
  "Холодные закуски": [
    {
      "name": "Фруктовая тарелка",
      "price": "3000",
      "photo": "",
      "active": true
    },
    {
      "name": "Сырное ассорти",
      "price": "3000",
      "photo": "",
      "active": true
    },
    {
      "name": "Мясной пир",
      "price": "3000",
      "photo": "",
      "active": true
    },
    {
      "name": "Закуска под водочку",
      "price": "3000",
      "photo": "",
      "active": true
    },
    {
      "name": "Соленья",
      "price": "3000",
      "photo": "",
      "active": true
    }
  ]
};
    }
  }

  // === Безопасное отображение текста ===
  function escapeHtml(s) {
    return (s + '').replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  // === Рендер меню ===
  function renderMenu(menuData) {
    menuList.innerHTML = '';
    Object.entries(menuData).forEach(([catName, items]) => {
      const catEl = document.createElement('div');
      catEl.className = 'category card';
      const visibleCount = items.filter(i => i.active).length;

      catEl.innerHTML = `
        <div class="cat-head">
          <div>
            <div class="cat-title">${escapeHtml(catName)}</div>
          </div>
          <div class="chev">▸</div>
        </div>
        <div class="items">
          ${items.map(i => i.active ? `
            <div class="item">
              <div class="top">
                <div class="name">${escapeHtml(i.name)}</div>
                <div class="price">${escapeHtml(i.price)}</div>
              </div>
              ${i.photo ? `
              <div class="photo-container">
                <img src="${escapeHtml(i.photo)}" alt="${escapeHtml(i.name)}">
              </div>` : ''}
            </div>` : '').join('')}
        </div>
      `;

      const head = catEl.querySelector('.cat-head');
      const itemsDiv = catEl.querySelector('.items');

      // === Раскрытие категории ===
      head.addEventListener('click', () => {
        const open = catEl.classList.toggle('open');
        const chev = head.querySelector('.chev');
        chev.style.transform = open ? 'rotate(90deg)' : 'rotate(0deg)';
        if (open) {
          itemsDiv.style.maxHeight = itemsDiv.scrollHeight + 'px';
          setTimeout(() => (itemsDiv.style.maxHeight = 'none'), 400); // потом снимаем ограничение
        } else {
          itemsDiv.style.maxHeight = itemsDiv.scrollHeight + 'px';
          requestAnimationFrame(() => {
            itemsDiv.style.maxHeight = '0';
          });
        }
      });

      // === Фото по клику на позицию ===
      const itemEls = catEl.querySelectorAll('.item');
      itemEls.forEach(item => {
        const photo = item.querySelector('.photo-container');
        if (!photo) return;

        photo.style.maxHeight = '0';
        photo.style.overflow = 'hidden';
        photo.style.transition = 'max-height 0.5s ease, opacity 0.5s ease, margin-top 0.3s ease';
        photo.style.opacity = '0';
        photo.style.marginTop = '0';

        item.addEventListener('click', (e) => {
          e.stopPropagation();
          const open = photo.classList.contains('open');
          if (open) {
            photo.classList.remove('open');
            photo.style.maxHeight = '0';
            photo.style.opacity = '0';
            photo.style.marginTop = '0';
          } else {
            photo.classList.add('open');
            photo.style.maxHeight = '400px';
            photo.style.opacity = '1';
            photo.style.marginTop = '10px';

            // автопрокрутка к открытому фото
            setTimeout(() => {
              photo.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 300);
          }
        });
      });

      menuList.appendChild(catEl);
    });
  }

  const menuData = await loadMenu();
  renderMenu(menuData);
});
