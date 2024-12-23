(function ($) {
  $(function () {

    let currentLanguage = 'gr';
    
    const translations = {
        gr: {
            categories: {
                healthy: 'Υγιεινά'
            },
            products: {
                xarouposokolatompoukies: {
                  title: "Χαρουποσοκολατομπουκιές",
                  firstText: "Με χαρουπάλευρο, κακάο, μέλι, φυστικοβουτυρο, λάδι καρύδας και χυμό ανανά",
                  secondText: ""
                },
                strawberry_boundy: {
                  title: "Strawberry Bounty (5 τεμάχια)",
                  firstText: "Με ινδοκάρυδο, γάλα καρύδας light, λιωμένες φράουλες, μέλι και σοκολάτα για επικάλυψη",
                  secondText: ""
                }
            }
        },
        en: {
            categories: {
                healthy: 'Healthy'
            },
            products: {
                xarouposokolatompoukies: {
                  title: "Carob Chocolate Bites",
                  firstText: "With carob flour, cocoa, honey, peanut butter, coconut oil, and pineapple juice",
                  secondText: ""
                },
                strawberry_boundy: {
                  title: "Strawberry Bounty (5 pieces)",
                  firstText: "With desiccated coconut, light coconut milk, mashed strawberries, honey, and chocolate for topping",
                  secondText: ""
                }
            }
        }
    };
    
    const categories = [
      { id: "healthy", name: 'healthy'},
    ];

    const products = [
      { id: "xarouposokolatompoukies", categoryId: "healthy", photo: "images/xarouposokolatompoukies.jpg", tiles: "sugarfree;low calories;vegan;", price: "€3.50", href: "www.google.gr" },
      { id: "strawberry_boundy", categoryId: "healthy", photo: "images/strawberryboundy.jpg", tiles: "sugarfree;low calories;chocolate;", price: "€4.00", href: "www.google.gr" },
    ];


    createProducts();

    function createProducts(){

      const cardsBody = document.getElementById('cards-body');
      const listCategories = document.getElementById('list-categories');

      // Clear existing content
      cardsBody.innerHTML = '';
      listCategories.innerHTML = '';
      
      // Group products by category
      const categoryMap = {};
      products.forEach(product => {
          if (!categoryMap[product.categoryId]) {
              categoryMap[product.categoryId] = [];
          }
          categoryMap[product.categoryId].push(product);
      });

      // Generate HTML dynamically
      let i = 1;
      categories.forEach(category => {
          if (!categoryMap[category.id]) return;

          let translateCategoryTitle = translations[currentLanguage].categories[category.id];

          const container = document.createElement('div');
          const li = document.createElement('li');
          const aTag = document.createElement('a');
          if (i!=1) {
            container.className = 'margin-top-250';
            li.className = 'border-t border-solid';
          }
          //aTag.href = '#'+category.id;
          aTag.innerHTML = translateCategoryTitle.toUpperCase();
          aTag.className = 'btn text-primary font-bold a-tag-category';
          aTag.onclick = () => {
            goToAnchorAndCloseSideMenu(category.id);
          };

          cardsBody.appendChild(container);
          li.appendChild(aTag);
          listCategories.appendChild(li);

          // Create category section
          const categoryTitle = document.createElement('div');
          categoryTitle.className = 'category-title transition-all duration-1000 ease-out';
          categoryTitle.innerHTML = `
              <div class="py-05 margin-bottom-1 w-full border-b border-solid border-primary border-opacity-50">
                  <h1 id="${category.id}" class="text-primary font-bold text-xl">${translateCategoryTitle.toUpperCase()}</h1>
              </div>
          `;
          container.appendChild(categoryTitle);

          // Create grid container
          const gridContainer = document.createElement('div');
          gridContainer.className = 'grid grid-cols-2 gap-1';

          categoryMap[category.id].forEach(product => {
              // Create product card
              let translatedProductTitle = translations[currentLanguage].products[product.id].title;
              let translatedProfuctFirstText = translations[currentLanguage].products[product.id].firstText;
              const cardContainer = document.createElement('div');
              cardContainer.className = 'card-container transition-all duration-1000 ease-out';

              const card = document.createElement('a');
              card.className = 'card transition-all duration-200 ease-in-out px-1 py-05 border-solid';
              card.href = product.href;

              card.innerHTML = `
                  <h1 class="font-semibold">${translatedProductTitle}</h1>
                  <div class="flex flex-wrap gap-025">
                      ${product.tiles.split(';').filter(tile => tile).map(tile => `
                          <div class="py-025 px-05 text-xs bg-primary text-primaryContent info-tile">
                              ${tile.toUpperCase()}
                          </div>`).join('')}
                  </div>
                  <div class="flex w-full h-full justify-between">
                      <div class="flex flex-col w-full pr-1 gap-05">
                          <p class="text-sm">${translatedProfuctFirstText}</p>
                      </div>
                      <div class="margin-top-05 self-center">
                          <img class="product-image" src="${product.photo}" width="400" height="200">
                      </div>
                  </div>
                  <div class="flex justify-between">
                      <div class="flex flex-col items-start">
                          <div class="margin-top-auto text-lg font-semibold text-primary inline-flex gap-05">
                              ${product.price}
                          </div>
                      </div>
                  </div>
              `;

              cardContainer.appendChild(card);
              gridContainer.appendChild(cardContainer);
          });

          container.appendChild(gridContainer);
          i++;
      });
    }

    $('#menu-icon').on('click', function () {
      openSideMenu()
    });

    $('#x-button').on('click', function () {
      closeSideMenu()
    });

    $('#button-side-menu').on('click', function () {
      closeSideMenu();
    });

    $('#lang-button').on('click', function () {
      openLanguageMenu();
    });

    $('#btn-arrow').on('click', function () {
      scrollToTop();
    });

    $('#gr-li').on('click', function () {
      closeLanguageMenu();
      if (currentLanguage == 'gr') return;
      //switchLanguageElements('gr-li', 'en-li');
      currentLanguage = 'gr';
      createProducts();
    });

    $('#en-li').on('click', function () {
      closeLanguageMenu();
      if (currentLanguage == 'en') return;
      //switchLanguageElements('en-li', 'gr-li');
      currentLanguage = 'en';
      createProducts();
    });

    // function switchLanguageElements(elementToMakePrimary, elementToMakeSecondary){
    //   const newPrimary = document.getElementById(elementToMakePrimary);
    //   newPrimary.classList.add("text-primaryContent");
    //   newPrimary.classList.add("bg-primary");
    //   newPrimary.classList.remove("text-secondaryContent");
    //   newPrimary.classList.remove("bg-white");

    //   const newSecondary = document.getElementById(elementToMakeSecondary);
    //   newSecondary.classList.remove("text-primaryContent");
    //   newSecondary.classList.remove("bg-primary");
    //   newSecondary.classList.add("text-secondaryContent");
    //   newSecondary.classList.add("bg-white");
    // }

    function scrollToTop() {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
      }); 
    }

    function closeLanguageMenu(){
      const listLanguageMenu = document.getElementById("list-language-menu");
      listLanguageMenu.classList.add("display-none");
    }

    function openLanguageMenu(){
      const listLanguageMenu = document.getElementById("list-language-menu");
      listLanguageMenu.classList.remove("display-none");
    }

    function closeSideMenu(){
      const sideContainerMenu = document.getElementById("side-container-menu");
      sideContainerMenu.classList.add("display-none");
    }

    function openSideMenu(){
      const sideContainerMenu = document.getElementById("side-container-menu");
      sideContainerMenu.classList.remove("display-none");
    }

    function goToAnchorAndCloseSideMenu(categoryId){
      var element = document.getElementById(categoryId);
      var headerOffset = 176;
      var elementPosition = element.getBoundingClientRect().top;
      var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
      });   
      closeSideMenu();
    }
    
  });

  window.onscroll = function(event) {
    const scrollBtn = document.getElementById("btn-arrow");
    window.scrollY > window.innerHeight - 500
      ? scrollBtn.classList.add("show")
      : scrollBtn.classList.remove("show");
  }

  window.onclick = function(event) {
    const listLangMenu = document.getElementById('list-language-menu');
    const langButton = document.getElementById('lang-button');
    const langButtonImg = document.getElementById('lang-button-img');
    if (!(listLangMenu.contains(event.target) || langButton.contains(event.target) || langButtonImg.contains(event.target)) ){
      const listLanguageMenu = document.getElementById("list-language-menu");
      listLanguageMenu.classList.add("display-none");
    }
  }
  
})(jQuery);
