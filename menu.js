(function ($) {
  $(function () {

    let currentLanguage = 'gr';
    let breakIfDownForMaintenance = false;
    let outputData = {};
    const apiKey = 'AIzaSyDjpCgr7OFoJXLBGN9Xzl8ktYbYkdt1TxA'; // Your API key from Google Developer Console
    //https://console.cloud.google.com/apis/credentials/key/1b4518f7-f092-4186-9ee3-ba4d1ec035aa?inv=1&invt=Abk6GA&project=menu-nutri-spot //jimskgg@gmail.com 
    const sheetId = '1EWNrDPHderW1v8CNyuF6454aijRpMok7YBHiAFDvjy8'; // Google Sheet ID
    //https://drive.google.com/drive/folders/1Firv30_I1x6b5ENz3MLu31ZxpDNLcTdE

    
    async function fetchSheetData(sheetId, apiKey) {
      try {
        // Define the gids for each sheet (Category, Products, Translations)
        const gids = {
          Maintenance: '1946345639',
          Categories: '9463046',
          Products: '1172715610',
          Translations: '0'
        };
    
        // Create an object to store the categories, products, and translations
        const categories = [];
        const products = [];
        const translations = { gr: { categories: {}, products: {} }, en: { categories: {}, products: {} } };

        // Fetch data for Categories, Products, and Translations sheets
        for (let sheetName in gids) {
          if (breakIfDownForMaintenance) break;
          const gid = gids[sheetName];
          const sheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`;

          const response = await fetch(sheetUrl);
          const json = await response.json();

          // Skip headers by starting from the second row
          const rows = json.values.slice(1);
          // Process each sheet based on its name (maintenance, categories, products, translations)
          if (sheetName === "Maintenance") {
            rows.forEach(row => {
              const [value] = row; // Map columns based on the sheet structure
                if (value == 'TRUE'){
                  handleDownForMaintentance();
                  breakIfDownForMaintenance = true;
                }
            });
          }

          if (sheetName === "Categories") {
            rows.forEach(row => {
              const [id, name] = row; // Map columns based on the sheet structure
              categories.push({ id, name });
            });
          }

          if (sheetName === "Products") {
            rows.forEach(row => {
              //const [id, categoryId, photo, tiles, price, href] = row; // Map columns based on the sheet structure
              const [id, categoryId, photo, tiles, price] = row; // Map columns based on the sheet structure
              products.push({ id, categoryId, photo, tiles, price });
            });
          }

          if (sheetName === "Translations") {
            rows.forEach(row => {
              const [id, type, greekTitle, englishTitle, greekFirstText, englishFirstText, greekSecondText, englishSecondText] = row;

              if (type === 'category') {
                // If translation is for category, map to the appropriate language object
                translations.gr.categories[id] = { title: greekTitle };
                translations.en.categories[id] = { title: englishTitle };
              } else if (type === 'product') {
                // If translation is for product, map to the appropriate language object
                translations.gr.products[id] = {
                  title: greekTitle,
                  firstText: greekFirstText,
                  secondText: greekSecondText || ""
                };
                translations.en.products[id] = {
                  title: englishTitle,
                  firstText: englishFirstText,
                  secondText: englishSecondText || ""
                };
              }
            });
          }
        }
        if (!breakIfDownForMaintenance){
          // Output the JSON data for further use
          const output = {
            translations,
            categories,
            products
          };
          outputData = output;
          showMainPage();
          createProducts();
        }
      } catch (error) {
        handleDownForMaintentance();
      }
    }

    fetchSheetData(sheetId, apiKey);

    /* EXAMPLE JSONS START
    const translations = {
        gr: {
            categories: {
                healthy: {
                  title: 'Υγιεινά'
                }
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
                healthy: {
                  title: 'Healthy'
                }
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
      { 
        id: "healthy", 
        name: 'healthy'
      },
    ];

    const products = [
      { 
        id: "xarouposokolatompoukies", 
        categoryId: "healthy", 
        photo: "images/xarouposokolatompoukies.jpg", 
        tiles: "sugarfree;low calories;vegan;", 
        price: "€3.50", 
        //href: "www.google.gr" 
      },
      { 
        id: "strawberry_boundy", 
        categoryId: "healthy", 
        photo: "images/strawberryboundy.jpg", 
        tiles: "sugarfree;low calories;chocolate;", 
        price: "€4.00", 
        //href: "www.google.gr" 
      },
    ];
    EXAMPLE JSONS END */

    function showMainPage(){
      const container = document.getElementById('container');
      container.classList.remove('display-none');
    }

    function handleDownForMaintentance(){
      const container = document.getElementById('container');
      const containerMaintenance = document.getElementById('container-maintenance');
      container.classList.add('display-none');
      containerMaintenance.classList.remove('display-none');
    }

    function createProducts(){
      if (breakIfDownForMaintenance) return;
      const cardsBody = document.getElementById('cards-body');
      const listCategories = document.getElementById('list-categories');

      // Clear existing content
      cardsBody.innerHTML = '';
      listCategories.innerHTML = '';
      
      // Group products by category
      const categoryMap = {};
      outputData.products.forEach(product => {
          if (!categoryMap[product.categoryId]) {
              categoryMap[product.categoryId] = [];
          }
          categoryMap[product.categoryId].push(product);
      });

      // Generate HTML dynamically
      let i = 1;
      outputData.categories.forEach(category => {
          if (!categoryMap[category.id]) return;

          let translateCategoryTitle = outputData.translations[currentLanguage].categories[category.id].title;

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
              let translatedProductTitle = outputData.translations[currentLanguage].products[product.id].title;
              let translatedProfuctFirstText = outputData.translations[currentLanguage].products[product.id].firstText;
              const cardContainer = document.createElement('div');
              cardContainer.className = 'card-container transition-all duration-1000 ease-out';

              const card = document.createElement('a');
              card.className = 'card transition-all duration-200 ease-in-out px-1 py-05 border-solid cursor-pointer';
              //card.href = product.href;
              card.onclick = () => {
                createProductModal(product.id);
              };

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

    function createProductModal(productId) {
      // Find the product by ID
      const product = outputData.products.find(p => p.id === productId);
    
      if (!product) {
        console.error('Product not found!');
        return '';
      }
    
      // Extract tiles
      const tiles = product.tiles.split(';').filter(tile => tile); // Split and remove empty values
    
      // Create HTML structure
      let translatedProductTitle = outputData.translations[currentLanguage].products[product.id].title;
      let translatedProfuctFirstText = outputData.translations[currentLanguage].products[product.id].firstText;

      const cardModal = `
        <div>
          <img class="product-modal-image" src="${product.photo}" width="400" height="200">
        </div>
        <div class="p-150">
          <h1 class="font-bold text-3xl">${translatedProductTitle || ''}</h1>
          <div class="flex flex-wrap items-center gap-05 margin-top-1">
            <div class="flex flex-wrap gap-025">
              ${tiles.map(tile => `
                <div class="py-025 px-05 text-xs bg-primary text-primaryContent info-tile">
                  ${tile.toUpperCase()}
                </div>`).join('')}
            </div>
          </div>
          <p>${translatedProfuctFirstText || ''}</p>
          <div></div>
        </div>
        <div class="sticky bottom-0 flex justify-between items-center p-150 bg-white text-baseContent">
          <div class="text-primary text-xl">
            <div class="flex flex-col items-start">
              <div class="flex flex-col items-start">
                <div class="text-lg font-semibold text-primary inline-flex gap-025 margin-top-auto">
                  ${product.price}
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    
      const cardModalElement = document.getElementById('product-modal-card-item');
      cardModalElement.innerHTML = cardModal;
      openProductModal();
    }

    $('#menu-icon').on('click', function () {
      openSideMenu()
    });

    $('#x-button').on('click', function () {
      closeSideMenu()
    });

    $('#x-modal-card-button').on('click', function () {
      closeProductModal()
    });

    $('#button-side-menu').on('click', function () {
      closeSideMenu();
    });

    $('#button-product-modal').on('click', function () {
      closeProductModal();
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
      currentLanguage = 'gr';
      createProducts();
    });

    $('#en-li').on('click', function () {
      closeLanguageMenu();
      if (currentLanguage == 'en') return;
      currentLanguage = 'en';
      createProducts();
    });

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

    function closeProductModal(){
      const productModal = document.getElementById("product-modal");
      productModal.classList.add("display-none");
    }

    function openProductModal(){
      const productModal = document.getElementById("product-modal");
      productModal.classList.remove("display-none");
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
